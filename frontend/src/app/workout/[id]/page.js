import ActiveWorkoutForm from "@/components/ActiveWorkoutForm";
import { getWorkoutPreparationAction } from "@/actions/workout";

export default async function WorkoutPage({ params }) {
  const { id } = await params;

  const workoutPreparation = await getWorkoutPreparationAction(id);

  const routine = workoutPreparation?.routineDetails;
  const routineDay = workoutPreparation?.routineDay;
  const exercises = routineDay?.exercises || [];

  return (
    <main className="min-h-screen bg-zinc-950 p-4 sm:p-6">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-black text-yellow-500 uppercase tracking-widest">
          {routine?.name || "Workout"}
        </h1>

        <p className="mt-2 text-sm font-bold uppercase tracking-wider text-zinc-400">
          Day {routineDay?.day_number}
        </p>
      </header>

      <ActiveWorkoutForm
        initialExercises={exercises}
        routineId={routine?.id}
        routineDayId={routineDay?.id}
      />
    </main>
  );
}
