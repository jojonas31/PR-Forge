import sequelize from "../config/database.js";
import { Op } from "sequelize";
import { getUtcWeekRange } from "../utils/dateRanges.js";
import { grantWorkoutExperience } from "./experienceService.js";
import { Routine, RoutineDay, WorkoutSession, ExerciseLog } from "../models/index.js";

import { updateExerciseMaxesFromLogs } from "./maxService.js";

const finishWorkout = async ({ userId, routineId, routineDayId, exerciseLogs, notes }) => {
  return sequelize.transaction(async (transaction) => {
    const routine = await Routine.findOne({
      where: {
        id: routineId,
        user_id: userId,
      },
      transaction,
    });

    if (!routine) {
      const error = new Error("Routine not found");
      error.statusCode = 404;
      throw error;
    }

    const routineDay = await RoutineDay.findOne({
      where: {
        id: routineDayId,
        routine_id: routineId,
      },
      transaction,
    });

    if (!routineDay) {
      const error = new Error("Routine day not found");
      error.statusCode = 404;
      throw error;
    }

    const session = await WorkoutSession.create(
      {
        user_id: userId,
        routine_id: routineId,
        routine_day_id: routineDayId,
        notes: notes || null,
      },
      { transaction },
    );

    const logsToSave = exerciseLogs.map((log) => ({
      workout_session_id: session.id,
      exercise_id: log.exercise_id,
      set_number: log.set_number,
      weight: Number(log.weight) || 0,
      reps: Number(log.reps) || 0,
      duration_seconds: Number(log.duration_seconds) || 0,
      is_pr: false,
    }));

    const createdLogs = await ExerciseLog.bulkCreate(logsToSave, {
      transaction,
      validate: true,
      returning: true,
    });

    await updateExerciseMaxesFromLogs({
      userId,
      createdLogs,
      transaction,
    });

    await Routine.update(
      {
        is_active: false,
      },
      {
        where: {
          user_id: userId,
        },
        transaction,
      },
    );

    await Routine.update(
      {
        is_active: true,
      },
      {
        where: {
          id: routineId,
          user_id: userId,
        },
        transaction,
      },
    );

    const experienceProgress = await grantWorkoutExperience({
      userId,
      transaction,
    });

    return {
      sessionId: session.id,
      experienceProgress,
    };
  });
};

const getWeeklyRoutineProgress = async (userId) => {
  const { weekStart, nextWeekStart } = getUtcWeekRange();

  const activeRoutine = await Routine.findOne({
    where: {
      user_id: userId,
      is_active: true,
    },
    attributes: ["id", "name"],
    include: [
      {
        model: RoutineDay,
        as: "days",
        attributes: ["id"],
        required: false,
      },
    ],
  });

  if (!activeRoutine) {
    return {
      routine_id: null,
      completed_workouts: 0,
      total_days: 0,
      progress_percentage: 0,
      week_start: weekStart.toISOString(),
      next_week_start: nextWeekStart.toISOString(),
    };
  }

  const totalDays = activeRoutine.days.length;

  const sessionCount = await WorkoutSession.count({
    where: {
      user_id: userId,
      routine_id: activeRoutine.id,
      createdAt: {
        [Op.gte]: weekStart,
        [Op.lt]: nextWeekStart,
      },
    },
  });

  const completedWorkouts = Math.min(sessionCount, totalDays);

  const progressPercentage = totalDays > 0 ? Math.round((completedWorkouts / totalDays) * 100) : 0;

  return {
    routine_id: activeRoutine.id,
    routine_name: activeRoutine.name,
    completed_workouts: completedWorkouts,
    total_days: totalDays,
    progress_percentage: progressPercentage,
    week_start: weekStart.toISOString(),
    next_week_start: nextWeekStart.toISOString(),
  };
};

export { finishWorkout, getWeeklyRoutineProgress };
