"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { finishWorkoutAction } from "@/actions/workout";
import { useRouter } from "next/navigation";

export default function ActiveWorkoutForm({ initialExercises, routineId, routineDayId }) {
  const router = useRouter();
  const [workoutData, setWorkoutData] = useState(() =>
    initialExercises.map((ex) => ({
      exerciseId: ex.id,
      name: ex.name,
      sets: Array.from({ length: ex.RoutineDayExercise?.sets || 0 }, (_, i) => ({
        setNumber: i + 1,
        targetReps: ex.RoutineDayExercise?.reps || 0,
        weight: "",
        reps: ex.RoutineDayExercise?.reps || "",
        completed: false,
      })),
    })),
  );

  const handleCancel = () => {
    if (confirm("Cancel workout")) {
      router.push("/routines");
    }
  };

  const updateSet = (exIndex, setIndex, changes) => {
    setWorkoutData((currentData) =>
      currentData.map((exercise, currentExIndex) =>
        currentExIndex !== exIndex
          ? exercise
          : {
              ...exercise,
              sets: exercise.sets.map((set, currentSetIndex) =>
                currentSetIndex !== setIndex
                  ? set
                  : {
                      ...set,
                      ...changes,
                    },
              ),
            },
      ),
    );
  };

  const findInvalidCompletedSet = () => {
    for (let exIndex = 0; exIndex < workoutData.length; exIndex++) {
      const exercise = workoutData[exIndex];
      for (let setIndex = 0; setIndex < exercise.sets.length; setIndex++) {
        const set = exercise.sets[setIndex];
        const weightNumber = Number(set.weight);
        const repsNumber = Number(set.reps);

        const isInvalid =
          set.completed &&
          (!Number.isFinite(weightNumber) ||
            weightNumber < 0 ||
            !Number.isInteger(repsNumber) ||
            repsNumber <= 0);

        if (isInvalid) {
          return { exIndex, setIndex, exerciseName: exercise.name, setNumber: set.setNumber };
        }
      }
    }
    return null;
  };

  const handleFinish = async () => {
    const invalidSet = findInvalidCompletedSet();

    if (invalidSet) {
      alert(`Check set #${invalidSet.setNumber} of ${invalidSet.exerciseName}`);
      updateSet(invalidSet.exIndex, invalidSet.setIndex, { completed: false });
      return;
    }

    const logsToSave = [];

    workoutData.forEach((exercise) => {
      exercise.sets.forEach((set) => {
        if (set.completed) {
          logsToSave.push({
            exercise_id: exercise.exerciseId,
            set_number: set.setNumber,
            weight: Number(set.weight),
            reps: Number(set.reps),
            is_pr: false,
          });
        }
      });
    });

    if (logsToSave.length === 0) {
      alert("At least one completed set is required");
      return;
    }

    await finishWorkoutAction(logsToSave, routineId, routineDayId);
  };

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6 mb-24">
      {workoutData.map((ex, exIndex) => (
        <div
          key={ex.exerciseId}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-md"
        >
          <h2 className="text-lg font-bold text-white mb-3 tracking-wide">{ex.name}</h2>

          <div className="grid grid-cols-[56px_1fr_1fr_64px] gap-2 text-xs font-mono text-zinc-500 uppercase mb-2 px-1">
            <span>Serie</span>
            <span className="text-center">Weight (kg)</span>
            <span className="text-center">Reps</span>
            <span className="text-right">State</span>
          </div>

          <div className="flex flex-col gap-2">
            {ex.sets.map((set, setIndex) => (
              <div
                key={set.setNumber}
                className={`grid grid-cols-[56px_1fr_1fr_64px] gap-2 items-center p-2 rounded-lg border transition-colors ${
                  set.completed
                    ? "bg-green-500/5 border-green-500/30"
                    : "bg-zinc-950/40 border-zinc-800"
                }`}
              >
                <span className="text-sm font-medium text-zinc-400 font-mono">
                  #{set.setNumber} <span className="text-xs text-zinc-600">({set.targetReps})</span>
                </span>

                <input
                  type="number"
                  placeholder="0"
                  value={set.weight}
                  onChange={(e) =>
                    updateSet(exIndex, setIndex, {
                      weight: e.target.value,
                    })
                  }
                  className="w-full min-w-0 bg-zinc-900 border border-zinc-700 rounded text-center py-1 text-white text-sm font-mono focus:border-yellow-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />

                <input
                  type="number"
                  placeholder={set.targetReps}
                  value={set.reps}
                  onChange={(e) =>
                    updateSet(exIndex, setIndex, {
                      reps: e.target.value,
                    })
                  }
                  className="w-full min-w-0 bg-zinc-900 border border-zinc-700 rounded text-center py-1 text-white text-sm font-mono focus:border-yellow-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      updateSet(exIndex, setIndex, {
                        completed: !set.completed,
                      })
                    }
                    aria-pressed={set.completed}
                    aria-label={
                      set.completed
                        ? `Mark set ${set.setNumber} as incomplete`
                        : `Mark set ${set.setNumber} as completed`
                    }
                    className={`p-1.5 rounded transition-colors ${
                      set.completed
                        ? "bg-green-500 text-zinc-950"
                        : "bg-zinc-800 text-zinc-400 hover:text-green-500"
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-zinc-950/80 backdrop-blur-md border-t border-zinc-800">
        <div className="w-full max-w-md mx-auto flex gap-4">
          <button
            onClick={handleCancel}
            className="flex-1 py-4 bg-zinc-900/50 text-red-500 border border-red-900/30 font-black rounded-xl uppercase tracking-wider hover:bg-red-500/10 hover:border-red-500/50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleFinish}
            className="flex-1 py-4 bg-yellow-500 text-zinc-950 font-black rounded-xl uppercase tracking-wider shadow-lg shadow-yellow-500/10 hover:bg-yellow-400 transition-colors"
          >
            Finish
          </button>
        </div>
      </div>
    </div>
  );
}
