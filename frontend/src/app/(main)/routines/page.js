"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getRoutinesAction } from "@/actions/routines";
import { getExercisesAction } from "@/actions/exercises";
import { getUsernameAction } from "@/actions/user";
import CreateRoutineForm from "@/components/CreateRoutineForm";
import SelectRoutinePanel from "@/components/SelectRoutinePanel";
import RoutinePreviewPanel from "@/components/RoutinePreviewPanel";
import { getWorkoutPreparationAction } from "@/actions/workout";

export default function RoutinesPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [dbExercises, setDbExercise] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [selectedRoutineId, setSelectedRoutineId] = useState(null);
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const [workout, setWorkout] = useState(null);

  const activeRoutine = routines.find((r) => r.is_active);
  const router = useRouter();
  const selectedRoutine = routines.find((routine) => routine.id === selectedRoutineId) ?? null;

  const loadRoutines = async () => {
    try {
      const routinesDB = await getRoutinesAction();
      setRoutines(routinesDB);

      const activeRoutineDB = routinesDB.find((routine) => routine.is_active);

      if (activeRoutineDB) {
        const workoutPreparation = await getWorkoutPreparationAction(activeRoutineDB.id);
        setWorkout(workoutPreparation);
      } else {
        setWorkout(null);
      }
    } catch (error) {
      setError("Failure loading routines");
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const exercisesRes = await getExercisesAction();
        const usernameRes = await getUsernameAction();
        setDbExercise(exercisesRes);
        setUsername(usernameRes);

        await loadRoutines();
      } catch (error) {
        setError("Failure loading initial data");
      }
    };
    void loadInitialData();
  }, []);

  return (
    <main className="flex flex-col items-center w-full max-w-6xl mx-auto p-4 sm:p-8 mt-6 sm:mt-12 gap-8">
      <div className="w-full">
        <h2 className="text-yellow-500 text-sm font-black tracking-[0.2em] mb-4 uppercase text-center">
          Current Forge
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg p-3 text-sm mb-4 text-center">
            {error}
          </div>
        )}

        {activeRoutine ? (
          <div className="bg-zinc-900 border border-yellow-500/50 rounded-xl p-6 shadow-[0_0_15px_rgba(234,179,8,0.1)] relative overflow-hidden flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/10 rounded-bl-full"></div>
            <div className="z-10 text-center sm:text-left">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">{activeRoutine.name}</h3>
                {workout?.routineDay && (
                  <span className="text-zinc-400 text-sm">
                    Next workout: Day {workout.routineDay.day_number}
                  </span>
                )}
              </div>
              <p className="text-zinc-400 text-sm">Continue your progress from the last session.</p>
            </div>
            <button
              type="button"
              onClick={() => router.push(`/workout/${activeRoutine.id}`)}
              className="bg-yellow-500 text-zinc-950 font-black px-8 py-3 rounded-lg uppercase tracking-wider hover:bg-yellow-400 transition-colors z-10 w-full sm:w-auto"
            >
              Continue
            </button>
          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Welcome, {username}.</h3>
            <p className="text-zinc-400">
              Begin your forge. Select or create your first routine below.
            </p>
          </div>
        )}
      </div>

      <div className="w-full flex flex-col lg:flex-row lg:h-150 gap-8">
        <SelectRoutinePanel
          routines={routines}
          isCreating={isCreating}
          setIsCreating={(val) => {
            setIsCreating(val);
            if (val) setSelectedRoutineId(null);
          }}
          setRoutines={setRoutines}
          onSelectRoutine={(routine) => {
            setSelectedRoutineId(routine.id);
            setIsCreating(false);
          }}
        />

        {isCreating && (
          <CreateRoutineForm
            dbExercises={dbExercises}
            onSuccess={() => {
              loadRoutines();
              setIsCreating(false);
            }}
          />
        )}

        {!isCreating && selectedRoutine && (
          <RoutinePreviewPanel
            routine={selectedRoutine}
            onStartWorkout={(id) => {
              router.push(`/workout/${id}`);
            }}
          />
        )}
      </div>
    </main>
  );
}
