import ManualEngine from "./routineEngines/ManualEngine.js";
import BeginnerEngine from "./routineEngines/BeginnerEngine.js";

const getRoutineEngine = (engineType) => {
  const engines = {
    MANUAL: ManualEngine,
    BEGINNER: BeginnerEngine,
  };

  const EngineClass = engines[engineType];
  if (!EngineClass) throw new Error("Not supported Engine");
  return new EngineClass();
};

export default getRoutineEngine;
