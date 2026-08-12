import { describe, expect, it } from "vitest";

import {
  getRequiredExperience,
  getExperiencePercentage,
  applyExperience,
} from "../utils/levelCalculations.js";

describe("getRequiredExperience", () => {
  it.each([
    { level: 1, expected: 1000 },
    { level: 2, expected: 2000 },
    { level: 5, expected: 5000 },
  ])("requires $expected XP for level $level", ({ level, expected }) => {
    const result = getRequiredExperience(level);

    expect(result).toBe(expected);
  });
});

describe("getExperiencePercentage", () => {
  it.each([
    {
      experience: 500,
      required: 1000,
      expected: 50,
    },
    {
      experience: 333,
      required: 1000,
      expected: 33,
    },
    {
      experience: 1500,
      required: 1000,
      expected: 100,
    },
  ])("returns $expected% for $experience/$required XP", ({ experience, required, expected }) => {
    const result = getExperiencePercentage(experience, required);

    expect(result).toBe(expected);
  });

  it.each([
    { experience: 0, required: 1000 },
    { experience: -100, required: 1000 },
    { experience: 500, required: 0 },
    { experience: 500, required: -1000 },
  ])("returns zero for invalid values", ({ experience, required }) => {
    const result = getExperiencePercentage(experience, required);

    expect(result).toBe(0);
  });
});

describe("applyExperience", () => {
  it("adds experience without increasing the level", () => {
    const progress = {
      currentLevel: 1,
      currentExperience: 200,
      experienceGained: 100,
    };

    const result = applyExperience(progress);

    expect(result).toEqual({
      level: 1,
      experience: 300,
      requiredExperience: 1000,
      experiencePercentage: 30,
      levelsGained: 0,
    });
  });

  it("increases the level when reaching the required experience", () => {
    const progress = {
      currentLevel: 1,
      currentExperience: 900,
      experienceGained: 100,
    };

    const result = applyExperience(progress);

    expect(result).toEqual({
      level: 2,
      experience: 0,
      requiredExperience: 2000,
      experiencePercentage: 0,
      levelsGained: 1,
    });
  });

  it("can increase multiple levels and preserve remaining experience", () => {
    const progress = {
      currentLevel: 1,
      currentExperience: 900,
      experienceGained: 3100,
    };

    const result = applyExperience(progress);

    expect(result).toEqual({
      level: 3,
      experience: 1000,
      requiredExperience: 3000,
      experiencePercentage: 33,
      levelsGained: 2,
    });
  });
});
