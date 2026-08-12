"use client";

import { useState } from "react";
import { Plus, Trash2, HelpCircle } from "lucide-react";
import { CreateRoutineAction } from "@/actions/routines";

const MAX_ROUTINE_DAYS = 7;

export default function CreateRoutineForm({ dbExercises, onSuccess }) {
  const [name, setName] = useState("");
  const [engine, setEngine] = useState("MANUAL");
  const firstDayId = crypto.randomUUID();
  const [days, setDays] = useState([
    {
      ui_id: firstDayId,
      day_number: 1,
      exercises: [],
    },
  ]);
  const [activeDayId, setActiveDayId] = useState(firstDayId);
  const activeDay = days.find((day) => day.ui_id === activeDayId);

  const handleSelectExercise = (uiId, exerciseSelectedId) => {
    const selectedDbEx = dbExercises.find((ex) => ex.id === exerciseSelectedId);

    setDays(
      days.map((day) => {
        if (day.ui_id !== activeDayId) return day;

        return {
          ...day,
          exercises: day.exercises.map((exercise) =>
            exercise.ui_id === uiId
              ? {
                  ...exercise,
                  exercise_id: selectedDbEx.id,
                  name: selectedDbEx.name,
                }
              : exercise,
          ),
        };
      }),
    );
  };

  const handleAddExercise = () => {
    setDays(
      days.map((day) => {
        if (day.ui_id !== activeDayId) return day;

        return {
          ...day,
          exercises: [
            ...day.exercises,
            {
              ui_id: crypto.randomUUID(),
              exercise_id: "",
              name: "",
              sets: 3,
              reps: 10,
              sequence_number: day.exercises.length + 1,
            },
          ],
        };
      }),
    );
  };

  const handleRemoveExercise = (idToRemove) => {
    setDays(
      days.map((day) => {
        if (day.ui_id !== activeDayId) return day;

        const updatedExercises = day.exercises
          .filter((exercise) => exercise.ui_id !== idToRemove)
          .map((exercise, index) => ({
            ...exercise,
            sequence_number: index + 1,
          }));

        return {
          ...day,
          exercises: updatedExercises,
        };
      }),
    );
  };

  const handleUpdateExercise = (id, field, value) => {
    setDays(
      days.map((day) => {
        if (day.ui_id !== activeDayId) return day;

        return {
          ...day,
          exercises: day.exercises.map((exercise) =>
            exercise.ui_id === id
              ? {
                  ...exercise,
                  [field]: Number(value),
                }
              : exercise,
          ),
        };
      }),
    );
  };

  const handleAddDay = () => {
    if (days.length >= MAX_ROUTINE_DAYS) {
      return;
    }

    const newDay = {
      ui_id: crypto.randomUUID(),
      day_number: days.length + 1,
      exercises: [],
    };

    setDays((currentDays) => [...currentDays, newDay]);

    setActiveDayId(newDay.ui_id);
  };

  const handleRemoveDay = () => {
    if (days.length === 1) {
      alert("A routine must have at least one day.");
      return;
    }

    const removedDayIndex = days.findIndex((day) => day.ui_id === activeDayId);

    const updatedDays = days
      .filter((day) => day.ui_id !== activeDayId)
      .map((day, index) => ({
        ...day,
        day_number: index + 1,
      }));

    const nextActiveIndex = Math.min(removedDayIndex, updatedDays.length - 1);

    setDays(updatedDays);
    setActiveDayId(updatedDays[nextActiveIndex].ui_id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emptyDay = days.find((day) => day.exercises.length === 0);

    if (emptyDay) {
      setActiveDayId(emptyDay.ui_id);
      alert(`Day ${emptyDay.day_number} must have at least one exercise.`);
      return;
    }

    const payload = {
      name,
      logic_engine: engine,
      days: days.map((day) => ({
        day_number: day.day_number,
        exercises: day.exercises.map((exercise, index) => ({
          exercise_id: exercise.exercise_id,
          sets: exercise.sets,
          reps: exercise.reps,
          sequence_number: index + 1,
        })),
      })),
    };

    try {
      await CreateRoutineAction(payload);
      onSuccess();
    } catch (error) {
      alert("error creating routine");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex-1 lg:h-full min-w-0 overflow-hidden bg-zinc-900 border border-yellow-600/30 rounded-xl p-5 sm:p-8 flex flex-col"
    >
      <h2 className="text-xl font-bold text-yellow-500 tracking-widest uppercase mb-8 text-center">
        Create New Routine
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="flex flex-col gap-2">
          <label className="text-zinc-400 text-sm">Routine Name</label>

          <input
            required
            value={name}
            type="text"
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Push Pull Legs"
            className="h-10 bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 w-full focus:outline-none focus:border-yellow-500"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm text-zinc-400">Logic Engine</label>

            <details className="group relative">
              <summary
                className="flex h-5 w-5 cursor-pointer list-none items-center justify-center rounded-full text-zinc-500 transition-colors hover:text-yellow-500 [&::-webkit-details-marker]:hidden"
                aria-label="Explain logic engines"
              >
                <HelpCircle className="h-4 w-4" />
              </summary>

              <div className="absolute right-0 z-20 mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-lg border border-zinc-700 bg-zinc-950 p-3 text-left shadow-xl">
                <p className="mb-2 text-xs leading-relaxed text-zinc-300">
                  <strong className="text-yellow-500">Manual:</strong> You choose the sets and
                  repetitions.
                </p>

                <p className="text-xs leading-relaxed text-zinc-300">
                  <strong className="text-yellow-500">Beginner:</strong> Automatically configures
                  every exercise as 3 sets of 10 repetitions.
                </p>
              </div>
            </details>
          </div>

          <select
            value={engine}
            onChange={(e) => setEngine(e.target.value)}
            className="h-10 bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 w-full focus:outline-none focus:border-yellow-500"
          >
            <option value="MANUAL">MANUAL</option>
            <option value="BEGINNER">BEGINNER</option>
          </select>
        </div>
      </div>

      <div className="mb-2">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h3 className="text-zinc-200 text-sm font-bold uppercase tracking-wider">Routine Days</h3>

          <div className="flex items-center gap-4">
            {days.length > 1 && (
              <button
                type="button"
                onClick={handleRemoveDay}
                className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Remove Day
              </button>
            )}

            <button
              type="button"
              onClick={handleAddDay}
              disabled={days.length >= MAX_ROUTINE_DAYS}
              className={`text-sm transition-colors ${
                days.length >= MAX_ROUTINE_DAYS
                  ? "text-zinc-600 cursor-not-allowed"
                  : "text-yellow-500 hover:text-yellow-400"
              }`}
            >
              {days.length >= MAX_ROUTINE_DAYS ? "Maximum 7 Days" : "+ Add Day"}
            </button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {days.map((day) => (
            <button
              key={day.ui_id}
              type="button"
              onClick={() => setActiveDayId(day.ui_id)}
              className={`shrink-0 px-4 py-2 rounded-lg border font-medium transition-colors ${
                day.ui_id === activeDayId
                  ? "border-yellow-500 bg-yellow-500/10 text-yellow-500"
                  : "border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300"
              }`}
            >
              Day {day.day_number}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[28px_minmax(0,1fr)_56px_56px_36px] gap-3 px-3 mb-2 text-[10px] uppercase tracking-wider text-zinc-600">
        <span />
        <span>Exercise</span>
        <span className="text-center">Sets</span>
        <span className="text-center">Reps</span>
        <span />
      </div>

      <div className="h-auto max-h-30 overflow-y-auto pr-2 mb-4 border border-zinc-800 rounded-lg overflow-hidden">
        {activeDay?.exercises.map((ex, index) => (
          <div
            key={ex.ui_id}
            className={`grid grid-cols-[28px_minmax(0,1fr)_56px_56px_36px] items-center gap-3 px-3 py-3 ${
              index !== activeDay.exercises.length - 1 ? "border-b border-zinc-800" : ""
            }`}
          >
            <span className="text-xs text-zinc-600 font-mono text-center">{index + 1}</span>

            <select
              required
              value={ex.exercise_id}
              onChange={(e) => handleSelectExercise(ex.ui_id, e.target.value)}
              className=" h-9 bg-zinc-950 border border-zinc-700 rounded-md px-3 text-sm text-zinc-200 outline-none focus:border-yellow-500"
            >
              <option disabled value="">
                Select exercise...
              </option>

              {dbExercises.map((dbEx) => (
                <option key={dbEx.id} value={dbEx.id}>
                  {dbEx.name}
                </option>
              ))}
            </select>

            <input
              required
              aria-label="Sets"
              title="Sets"
              type="number"
              min="1"
              value={ex.sets}
              onChange={(e) => handleUpdateExercise(ex.ui_id, "sets", e.target.value)}
              className="h-9 w-full bg-zinc-950 border border-zinc-700 rounded-md text-center text-sm text-zinc-300 outline-none focus:border-yellow-500 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />

            <input
              required
              aria-label="Reps"
              title="Reps"
              type="number"
              min="1"
              value={ex.reps}
              onChange={(e) => handleUpdateExercise(ex.ui_id, "reps", e.target.value)}
              className="h-9 w-full bg-zinc-950 border border-zinc-700 rounded-md text-center text-sm text-zinc-300 outline-none focus:border-yellow-500 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />

            <button
              type="button"
              onClick={() => handleRemoveExercise(ex.ui_id)}
              aria-label="Remove exercise"
              className="h-9 w-9 flex items-center justify-center text-zinc-600 rounded-md hover:bg-red-500/10 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleAddExercise}
        className="w-full py-2.5 mt-3 mb-5 border border-dashed border-zinc-700 text-zinc-400 text-sm font-semibold rounded-lg hover:border-yellow-500/50 hover:text-yellow-500 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Exercise
      </button>

      <button
        type="submit"
        className="w-full py-4 border border-yellow-500 text-yellow-500 font-bold rounded-lg hover:bg-yellow-500/10 transition-colors uppercase tracking-wider mt-auto"
      >
        Save Routine
      </button>
    </form>
  );
}
