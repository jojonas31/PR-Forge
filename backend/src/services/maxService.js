import { UserExerciseMax, Exercise } from "../models/index.js";
import {
  calculateEstimatedOneRepMax,
  calculateExerciseStrengthPoints,
} from "../utils/strengthCalculations.js";

const updateExerciseMaxesFromLogs = async ({ userId, createdLogs, transaction }) => {
  const bestByExercise = new Map();

  for (const log of createdLogs) {
    const estimatedOneRepMax = calculateEstimatedOneRepMax(log.weight, log.reps);

    if (estimatedOneRepMax <= 0) {
      continue;
    }

    const exerciseId = log.exercise_id;
    const currentBest = bestByExercise.get(exerciseId);

    if (!currentBest || estimatedOneRepMax > currentBest.oneRepMax) {
      bestByExercise.set(exerciseId, {
        oneRepMax: estimatedOneRepMax,
        log,
      });
    }
  }

  for (const [exerciseId, result] of bestByExercise) {
    const roundedOneRepMax = Number(result.oneRepMax.toFixed(2));

    const existingMax = await UserExerciseMax.findOne({
      where: {
        user_id: userId,
        exercise_id: exerciseId,
      },
      transaction,
    });

    const isNewPersonalRecord = !existingMax || roundedOneRepMax > Number(existingMax.one_rep_max);

    if (!isNewPersonalRecord) {
      continue;
    }

    if (existingMax) {
      await existingMax.update(
        {
          one_rep_max: roundedOneRepMax,
        },
        { transaction },
      );
    } else {
      await UserExerciseMax.create(
        {
          user_id: userId,
          exercise_id: exerciseId,
          one_rep_max: roundedOneRepMax,
        },
        { transaction },
      );
    }

    await result.log.update(
      {
        is_pr: true,
      },
      { transaction },
    );
  }
};

const getUserStrengthSummary = async (userId) => {
  const userMaxes = await UserExerciseMax.findAll({
    where: {
      user_id: userId,
    },
    include: [
      {
        model: Exercise,
        required: true,
        where: {
          metric_type: "TRADITIONAL",
        },
        attributes: ["id", "name", "strength_factor"],
      },
    ],
  });

  const exercises = userMaxes.map((userMax) => {
    const exercise = userMax.Exercise;

    const points = calculateExerciseStrengthPoints(userMax.one_rep_max, exercise.strength_factor);

    return {
      exercise_id: exercise.id,
      name: exercise.name,
      one_rep_max: Number(userMax.one_rep_max),
      points,
    };
  });

  const totalPoints = exercises.reduce((total, exercise) => total + exercise.points, 0);

  return {
    total_points: totalPoints,
    exercises,
  };
};

export { updateExerciseMaxesFromLogs, getUserStrengthSummary };
