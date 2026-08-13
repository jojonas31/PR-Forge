import Link from "next/link";
import { Hammer, CalendarDays, HelpCircle, Star } from "lucide-react";
import { cookies } from "next/headers";
import { StatCard } from "@/components/StatCard";
import { getActiveRoutineAction } from "@/actions/routines";
import { getStrengthPointsService } from "@/services/maxes";
import { getWeeklyProgressService } from "@/services/workout";

export default async function Home() {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("jwt_token")?.value;

  const activeRoutine = await getActiveRoutineAction();

  let strengthPoints = 0;

  let weeklyProgress = {
    completed_workouts: 0,
    total_days: 0,
    progress_percentage: 0,
  };

  if (token) {
    const [strengthResult, weeklyProgressResult] = await Promise.allSettled([
      getStrengthPointsService(token),
      getWeeklyProgressService(token),
    ]);

    if (strengthResult.status === "fulfilled") {
      strengthPoints = strengthResult.value.total_points;
    }

    if (weeklyProgressResult.status === "fulfilled") {
      weeklyProgress = weeklyProgressResult.value;
    }
  }

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto p-4 sm:p-8 mt-6 sm:mt-12 gap-10 sm:gap-16">
      <h1 className="hidden sm:block text-4xl md:text-5xl font-bold text-yellow-500 tracking-wider">
        PR Forge
      </h1>

      {activeRoutine ? (
        <Link
          href={`/workout/${activeRoutine.id}`}
          className="group w-full max-w-lg bg-zinc-900/50 border border-yellow-600/50 hover:border-yellow-500 rounded-xl p-5 sm:p-8 flex flex-col items-center justify-center transition-all hover:bg-zinc-800/50 hover:shadow-[0_0_15px_rgba(202,138,4,0.1)]"
        >
          <div className="flex items-center gap-3 sm:gap-4 mb-2">
            <Hammer className="text-yellow-500 w-7 h-7 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform" />
            <h2 className="text-xl sm:text-2xl font-bold text-yellow-500 tracking-wider sm:tracking-widest uppercase">
              Start Daily Forge
            </h2>
          </div>
          <p className="text-zinc-400 text-sm mt-2">{activeRoutine.name}</p>
        </Link>
      ) : (
        <div className="w-full max-w-lg bg-zinc-900/50 border border-yellow-600/50 rounded-xl p-5 sm:p-8 flex flex-col items-center justify-center opacity-50">
          <div className="flex items-center gap-3 sm:gap-4 mb-2">
            <Hammer className="text-yellow-500 w-7 h-7 sm:w-8 sm:h-8" />
            <h2 className="text-xl sm:text-2xl font-bold text-yellow-500 tracking-wider sm:tracking-widest uppercase">
              Start Daily Forge
            </h2>
          </div>
          <p className="text-zinc-400 text-sm mt-2">Select a routine</p>
        </div>
      )}

      <section className="w-full flex flex-col items-center gap-6">
        <h3 className="text-zinc-500 text-sm font-semibold tracking-widest uppercase mb-2">
          Kingdom Summary
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <StatCard
            icon={CalendarDays}
            title="Weekly Workouts"
            subtitle="Completed"
            value={weeklyProgress.completed_workouts}
            unit={`/ ${weeklyProgress.total_days}`}
          >
            <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-4 overflow-hidden">
              <div
                className="bg-zinc-400 h-full rounded-full transition-all"
                style={{
                  width: `${weeklyProgress.progress_percentage}%`,
                }}
              />
            </div>
          </StatCard>

          <StatCard
            icon={Star}
            title="Estimated Strength"
            subtitle="Points"
            value={strengthPoints}
            unit="pts"
          >
            <details className="group absolute right-4 top-4 z-20">
              <summary
                className="flex h-5 w-5 cursor-pointer list-none items-center justify-center text-zinc-500 transition-colors hover:text-yellow-500 [&::-webkit-details-marker]:hidden"
                aria-label="Explain strength points"
              >
                <HelpCircle className="h-4 w-4" />
              </summary>

              <p className="absolute right-0 mt-2 w-64 rounded-lg border border-zinc-700 bg-zinc-950 p-3 text-left text-xs leading-relaxed text-zinc-300 shadow-xl">
                Points are based on your best estimated 1RM for each strength exercise. Each result
                is adjusted by the exercise and added to your total.
              </p>
            </details>
          </StatCard>
        </div>
      </section>
    </div>
  );
}
