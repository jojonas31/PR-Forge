import { describe, expect, it } from "vitest";

import ManualEngine from "../services/routineEngines/ManualEngine.js";

describe("ManualEngine", () => {
  it("preserves the exercise configuration", () => {
    const engine = new ManualEngine();
    const routineDay = { id: 42 };
    const exercises = [
      {
        exercise_id: 6,
        sets: 4,
        reps: 8,
      },
      {
        exercise_id: 8,
        sets: 3,
        reps: 5,
        target_time: 30,
      },
    ];

    const result = engine.prepareExercises(exercises, routineDay);

    expect(result).toEqual([
      {
        routine_day_id: 42,
        exercise_id: 6,
        sets: 4,
        reps: 8,
        target_time: null,
        sequence_number: 1,
      },
      {
        routine_day_id: 42,
        exercise_id: 8,
        sets: 3,
        reps: 5,
        target_time: 30,
        sequence_number: 2,
      },
    ]);
  });
});
