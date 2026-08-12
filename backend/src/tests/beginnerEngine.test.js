import { describe, expect, it } from "vitest";

import BeginnerEngine from "../services/routineEngines/BeginnerEngine.js";

describe("BeginnerEngine", () => {
  it("changes the routine properly", () => {
    const engine = new BeginnerEngine();
    const routineDay = { id: 42 };
    const exercises = [
      {
        exercise_id: 5,
        sets: 3,
        weight: 100,
        reps: 5,
      },
      {
        exercise_id: 13,
        sets: 2,
        weight: 80,
        reps: 12,
      },
    ];

    const result = engine.prepareExercises(exercises, routineDay);

    expect(result).toEqual([
      {
        routine_day_id: 42,
        exercise_id: 5,
        sets: 3,
        reps: 10,
        target_time: null,
        sequence_number: 1,
      },
      {
        routine_day_id: 42,
        exercise_id: 13,
        sets: 3,
        reps: 10,
        target_time: null,
        sequence_number: 2,
      },
    ]);
  });
});
