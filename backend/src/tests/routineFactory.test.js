import { describe, expect, it } from "vitest";

import getRoutineEngine from "../services/routineFactory.js";
import ManualEngine from "../services/routineEngines/ManualEngine.js";
import BeginnerEngine from "../services/routineEngines/BeginnerEngine.js";

describe("getRoutineEngine", () => {
  it("returns a ManualEngine for MANUAL", () => {
    const result = getRoutineEngine("MANUAL");

    expect(result).toBeInstanceOf(ManualEngine);
  });

  it("returns a BeginnerEngine for BEGINNER", () => {
    const result = getRoutineEngine("BEGINNER");

    expect(result).toBeInstanceOf(BeginnerEngine);
  });

  it("throws an error for an unsupported engine", () => {
    const createUnsupportedEngine = () => getRoutineEngine("ADVANCED");

    expect(createUnsupportedEngine).toThrow("Not supported Engine");
  });
});
