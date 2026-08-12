import { Dumbbell, Play } from "lucide-react";

export default function RoutinePreviewPanel({ routine, onStartWorkout }) {
  const days = routine.days || [];

  return (
    <section className="relative flex-1 lg:h-full min-h-0 bg-zinc-900 border border-yellow-600/30 rounded-xl p-5 sm:p-8 flex flex-col ">
      <h2 className="text-xl font-bold text-yellow-500 tracking-widest uppercase mb-8 text-center">
        Routine Preview
      </h2>

      <div className="mb-5">
        <h3 className="text-xl font-bold text-white">{routine.name}</h3>

        <div className="flex items-center gap-3 mt-3">
          <span className="text-yellow-500 font-mono text-xs bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded-md">
            {routine.logic_engine}
          </span>
        </div>
      </div>

      <div className="flex-1 min-h-0 lg:overflow-y-auto pr-2 mb-5 flex flex-col gap-4">
        {days.length === 0 ? (
          <p className="text-zinc-500 text-sm text-center py-8">
            This routine has no training days.
          </p>
        ) : (
          days.map((day) => (
            <section key={day.id}>
              <h4 className="text-yellow-500 text-sm font-bold mb-2">Day {day.day_number}</h4>

              <div className="flex flex-col gap-2">
                {day.exercises?.length > 0 ? (
                  day.exercises.map((exercise, index) => {
                    const details = exercise.RoutineDayExercise;

                    return (
                      <div
                        key={exercise.id}
                        className="min-h-12 flex items-center justify-between gap-3 bg-zinc-800/30 border border-zinc-800 px-3 py-2 rounded-lg"
                      >
                        <div className="min-w-0 flex items-center gap-2">
                          <span className="w-4 shrink-0 text-zinc-600 text-xs font-mono">
                            {index + 1}
                          </span>

                          <Dumbbell className="w-4 h-4 shrink-0 text-zinc-500" />

                          <span className="truncate text-zinc-300 text-sm font-medium">
                            {exercise.name}
                          </span>
                        </div>

                        <span className="shrink-0 text-xs text-zinc-300 font-mono bg-zinc-950 px-3 py-1 rounded border border-zinc-800">
                          {details?.target_time
                            ? `${details?.sets ?? "-"}x${details.target_time}s`
                            : `${details?.sets ?? "-"}x${details?.reps ?? "-"}`}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-zinc-600 text-xs py-2">No exercises added.</p>
                )}
              </div>
            </section>
          ))
        )}
      </div>

      <button
        type="button"
        onClick={() => onStartWorkout(routine.id)}
        className="mt-auto w-full py-4 bg-yellow-500 text-zinc-950 font-black rounded-lg hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2 tracking-wider shadow-lg shadow-yellow-500/10"
      >
        <Play className="w-4 h-4 fill-current" />
        START WORKOUT
      </button>
    </section>
  );
}
