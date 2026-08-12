"use client";
import { Anvil, Hammer, Trash2 } from "lucide-react";
import { DeleteRoutineAction } from "@/actions/routines";

export default function SelectRoutinePanel({
  routines,
  isCreating,
  setIsCreating,
  setRoutines,
  onSelectRoutine,
}) {
  const handleDeleteRoutine = async (routineId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this routine?");
    if (!confirmDelete) return;

    try {
      await DeleteRoutineAction(routineId);

      setRoutines((currentRoutines) =>
        currentRoutines.filter((routine) => routine.id !== routineId),
      );
    } catch (error) {
      alert("Could not delete routine");
    }
  };

  return (
    <section className="flex-1 bg-zinc-900 border border-yellow-600/30 rounded-xl p-5 sm:p-8 flex flex-col items-center text-center">
      <h2 className="text-xl font-bold text-yellow-500 tracking-widest uppercase mb-12">
        All Routines
      </h2>

      {routines.length === 0 ? (
        <div className="flex flex-col items-center gap-4 mb-12">
          <p className="text-zinc-300 text-lg">No routines forged yet!</p>
          <div className="relative flex items-center justify-center w-24 h-24 my-4">
            <Anvil className="absolute bottom-0 text-yellow-500 w-16 h-16" />
          </div>
          <p className="text-zinc-500 text-sm">Start by creating your first routine.</p>
        </div>
      ) : (
        <div className="flex flex-col w-full gap-2 mb-12 max-h-80 overflow-y-auto pr-2">
          {routines.map((routine) => (
            <div
              key={routine.id}
              onClick={() => onSelectRoutine(routine)}
              className="bg-zinc-800/50 border border-zinc-700 p-4 rounded-lg flex justify-between items-center gap-3 text-left hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <div className="min-w-0">
                <h3 className="text-zinc-200 font-bold truncate">{routine.name}</h3>
                <p className="text-zinc-500 text-xs font-mono mt-1">{routine.logic_engine}</p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteRoutine(routine.id);
                }}
                className="shrink-0 text-zinc-500 hover:text-red-400 transition-colors p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => setIsCreating(!isCreating)}
        className={` mt-auto w-full py-4 border font-bold rounded-lg transition-colors flex items-center justify-center gap-2 uppercase tracking-wider ${
          isCreating
            ? "border-red-500 text-red-500 hover:bg-red-500/10"
            : "border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
        }`}
      >
        {isCreating ? (
          "Cancel"
        ) : (
          <>
            <Hammer className="w-5 h-5" />
            Create Routine
          </>
        )}
      </button>
    </section>
  );
}
