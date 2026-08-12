import { User } from "../models/index.js";

import { EXPERIENCE_PER_WORKOUT, applyExperience } from "../utils/levelCalculations.js";

const grantWorkoutExperience = async ({ userId, transaction }) => {
  const user = await User.findByPk(userId, {
    transaction,
    lock: transaction.LOCK.UPDATE,
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const progress = applyExperience({
    currentLevel: Number(user.level),
    currentExperience: Number(user.experience),
    experienceGained: EXPERIENCE_PER_WORKOUT,
  });

  await user.update(
    {
      level: progress.level,
      experience: progress.experience,
    },
    {
      transaction,
    },
  );

  return {
    experienceGained: EXPERIENCE_PER_WORKOUT,
    level: progress.level,
    experience: progress.experience,
    experienceRequired: progress.requiredExperience,
    experiencePercentage: progress.experiencePercentage,
    levelsGained: progress.levelsGained,
  };
};

export { grantWorkoutExperience };
