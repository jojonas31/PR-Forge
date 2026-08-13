import sequelize from "../config/database.js";
import { Op } from "sequelize";
import { getUtcWeekRange } from "../utils/dateRanges.js";
import { grantWorkoutExperience } from "./experienceService.js";
import {
  Routine,
  RoutineDay,
  RoutineDayExercise,
  WorkoutSession,
  ExerciseLog,
} from "../models/index.js";

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

    const plannedExercises = await RoutineDayExercise.findAll({
      where: {
        routine_day_id: routineDayId,
      },
      attributes: ["exercise_id"],
      transaction,
    });

    const logsToSave = [];

    for (const log of exerciseLogs) {
      const belongsToDay = plannedExercises.some(
        (exercise) => exercise.exercise_id === log.exercise_id,
      );
      const setNumber = Number(log.set_number);
      const weight = Number(log.weight);
      const reps = Number(log.reps);

      if (!belongsToDay) {
        const error = new Error("Exercise does not belong to routine day");
        error.statusCode = 400;
        throw error;
      }

      if (
        !Number.isInteger(setNumber) ||
        setNumber < 1 ||
        !Number.isFinite(weight) ||
        weight < 0 ||
        !Number.isInteger(reps) ||
        reps < 1
      ) {
        const error = new Error("Invalid exercise log values");
        error.statusCode = 400;
        throw error;
      }

      logsToSave.push({
        exercise_id: log.exercise_id,
        set_number: setNumber,
        weight,
        reps,
      });
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

    const sessionLogs = logsToSave.map((log) => ({
      ...log,
      workout_session_id: session.id,
    }));

    const createdLogs = await ExerciseLog.bulkCreate(sessionLogs, {
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
