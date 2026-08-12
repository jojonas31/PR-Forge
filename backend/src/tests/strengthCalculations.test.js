import { describe, it, expect } from "vitest";
import {
  calculateEstimatedOneRepMax,
  calculateExerciseStrengthPoints,
} from "../utils/strengthCalculations.js";

describe("strengthCalculations", () => {
  describe("calculateEstimatedOneRepMax", () => {
    it("returns the same weight when performing one repetition", () => {
      const weight = 100;
      const reps = 1;

      const result = calculateEstimatedOneRepMax(weight, reps);

      expect(result).toBe(weight);
    });

    it("calculates the estimated 1RM using the Epley formula", () => {
      const weight = 100;
      const reps = 5;

      const result = calculateEstimatedOneRepMax(weight, reps);

      expect(result).toBeCloseTo(116.67, 2);
    });

    it("accepts weight as a numeric string", () => {
      const weight = "100";
      const reps = 5;

      const result = calculateEstimatedOneRepMax(weight, reps);

      expect(result).toBeCloseTo(116.67, 2);
    });

    it("accepts repetitions as a numeric string", () => {
      const weight = 100;
      const reps = "5";

      const result = calculateEstimatedOneRepMax(weight, reps);

      expect(result).toBeCloseTo(116.67, 2);
    });
  });

  describe("calculateExerciseStrengthPoints", () => {
    it("multiplies the maximum by the strength factor", () => {
      const estimatedOneRepMax = 120;
      const strengthFactor = 1.5;

      const result = calculateExerciseStrengthPoints(estimatedOneRepMax, strengthFactor);

      expect(result).toBe(180);
    });

    it("rounds the resulting points to the nearest integer", () => {
      const estimatedOneRepMax = 101.5;
      const strengthFactor = 1.25;

      const result = calculateExerciseStrengthPoints(estimatedOneRepMax, strengthFactor);

      expect(result).toBe(127);
    });
  });
});
