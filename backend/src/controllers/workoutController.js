import {
  WorkoutSession,
  Routine,
  RoutineDay,
  RoutineDayExercise,
  Exercise,
} from "../models/index.js";
import { finishWorkout, getWeeklyRoutineProgress } from "../services/workoutService.js";

const saveWorkoutHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const { routine_id, routine_day_id, exercise_logs, notes } = req.body;

    if (!routine_id) {
      return res.status(400).json({
        error: "routine_id is required",
      });
    }

    if (!Array.isArray(exercise_logs) || exercise_logs.length === 0) {
      return res.status(400).json({
        error: "At least one exercise log is required",
      });
    }

    const result = await finishWorkout({
      userId,
      routineId: routine_id,
      routineDayId: routine_day_id,
      exerciseLogs: exercise_logs,
      notes,
    });

    return res.status(201).json({
      message: "Workout saved successfully",

      sessionId: result.sessionId,

      experience: {
        gained: result.experienceProgress.experienceGained,
        level: result.experienceProgress.level,
        current: result.experienceProgress.experience,
        required: result.experienceProgress.experienceRequired,
        percentage: result.experienceProgress.experiencePercentage,
        levels_gained: result.experienceProgress.levelsGained,
      },
    });
  } catch (error) {
    console.error("Error saving workout:", error);

    return res.status(error.statusCode || 500).json({
      error: error.statusCode === 404 ? error.message : "Internal server error",
    });
  }
};

const getWorkoutPreparation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { routineId } = req.params;

    const routineWithDays = await Routine.findOne({
      where: {
        id: routineId,
        user_id: userId,
      },
      include: [
        {
          model: RoutineDay,
          as: "days",
          include: [
            {
              model: Exercise,
              as: "exercises",
              through: {
                attributes: ["sets", "reps", "target_time", "sequence_number"],
              },
            },
          ],
        },
      ],
      order: [
        [{ model: RoutineDay, as: "days" }, "day_number", "ASC"],
        [
          { model: RoutineDay, as: "days" },
          { model: Exercise, as: "exercises" },
          RoutineDayExercise,
          "sequence_number",
          "ASC",
        ],
      ],
    });

    if (!routineWithDays) {
      return res.status(404).json({
        error: "Routine not found",
      });
    }

    if (routineWithDays.days.length === 0) {
      return res.status(400).json({
        error: "Routine has no days",
      });
    }

    const lastSession = await WorkoutSession.findOne({
      where: {
        user_id: userId,
        routine_id: routineId,
      },
      attributes: ["routine_day_id"],
      order: [["createdAt", "DESC"]],
    });

    let nextDayIndex = 0;

    if (lastSession?.routine_day_id) {
      const lastDayIndex = routineWithDays.days.findIndex(
        (day) => Number(day.id) === Number(lastSession.routine_day_id),
      );

      if (lastDayIndex !== -1) {
        nextDayIndex = (lastDayIndex + 1) % routineWithDays.days.length;
      }
    }

    const routineDay = routineWithDays.days[nextDayIndex];

    return res.status(200).json({
      routineDetails: {
        id: routineWithDays.id,
        name: routineWithDays.name,
        logic_engine: routineWithDays.logic_engine,
      },
      routineDay,
    });
  } catch (error) {
    console.error("Error loading workout:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

const getWeeklyProgress = async (req, res) => {
  try {
    const userId = req.user.id;

    const progress = await getWeeklyRoutineProgress(userId);

    return res.status(200).json(progress);
  } catch (error) {
    console.error("Error getting weekly routine progress:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export { saveWorkoutHistory, getWorkoutPreparation, getWeeklyProgress };
