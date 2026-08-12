const BASE_EXPERIENCE_REQUIRED = 1000;
const EXPERIENCE_PER_WORKOUT = 100;

const getRequiredExperience = (level) => {
  const numericLevel = Number(level);

  return numericLevel * BASE_EXPERIENCE_REQUIRED;
};

const getExperiencePercentage = (experience, requiredExperience) => {
  const numericExperience = Number(experience);
  const numericRequiredExperience = Number(requiredExperience);

  if (
    !Number.isFinite(numericExperience) ||
    !Number.isFinite(numericRequiredExperience) ||
    numericExperience <= 0 ||
    numericRequiredExperience <= 0
  ) {
    return 0;
  }

  return Math.min(100, Math.round((numericExperience / numericRequiredExperience) * 100));
};

const applyExperience = ({ currentLevel, currentExperience, experienceGained }) => {
  const parsedLevel = Number(currentLevel);
  const parsedExperience = Number(currentExperience);
  const parsedExperienceGained = Number(experienceGained);

  let level = Number.isInteger(parsedLevel) && parsedLevel >= 1 ? parsedLevel : 1;

  let experience =
    Number.isInteger(parsedExperience) && parsedExperience >= 0 ? parsedExperience : 0;

  const safeExperienceGained =
    Number.isInteger(parsedExperienceGained) && parsedExperienceGained > 0
      ? parsedExperienceGained
      : 0;

  experience += safeExperienceGained;

  let requiredExperience = getRequiredExperience(level);

  let levelsGained = 0;

  while (experience >= requiredExperience) {
    experience -= requiredExperience;
    level += 1;
    levelsGained += 1;

    requiredExperience = getRequiredExperience(level);
  }

  return {
    level,
    experience,
    requiredExperience,
    experiencePercentage: getExperiencePercentage(experience, requiredExperience),
    levelsGained,
  };
};

export { EXPERIENCE_PER_WORKOUT, getRequiredExperience, getExperiencePercentage, applyExperience };
