import { cookies } from "next/headers";
import { Dumbbell, Trophy, ChartNoAxesColumn } from "lucide-react";
import { getUserAllMaxService } from "@/services/maxes";

export default async function StatsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt_token")?.value;

  const allMaxes = await getUserAllMaxService(token);

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <ChartNoAxesColumn className="h-7 w-7 text-yellow-500" />

            <h1 className="text-3xl font-black uppercase tracking-wider text-white">Your stats</h1>
          </div>

          <p className="text-sm text-zinc-500">
            Your best estimated results from completed workouts.
          </p>
        </header>

        {allMaxes.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/40 px-6 py-14 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 text-zinc-600">
              <Trophy className="h-6 w-6" />
            </div>

            <h2 className="mb-2 text-lg font-bold uppercase tracking-wide text-zinc-300">
              No records yet
            </h2>

            <p className="mx-auto max-w-md text-sm leading-relaxed text-zinc-500">
              Complete a workout to automatically register your first estimated one-repetition
              maximum.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {allMaxes.map((max) => {
              const oneRepMax = Number(max.one_rep_max) || 0;

              return (
                <article
                  key={max.id}
                  className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-yellow-500/50 hover:bg-zinc-900 hover:shadow-lg hover:shadow-yellow-500/5"
                >
                  <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-yellow-500/5 blur-2xl transition-colors group-hover:bg-yellow-500/10" />

                  <div className="relative mb-5 flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-yellow-500/20 bg-yellow-500/10 text-yellow-500">
                        <Dumbbell className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500">
                          Personal record
                        </p>

                        <h2 className="truncate text-lg font-black uppercase tracking-wide text-zinc-100">
                          {max.Exercise?.name || "Exercise"}
                        </h2>
                      </div>
                    </div>

                    <Trophy className="h-5 w-5 shrink-0 text-yellow-500/60" />
                  </div>

                  <div className="relative mb-4 rounded-lg border border-zinc-800 bg-zinc-950/60 p-4">
                    <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
                      <Trophy className="h-3.5 w-3.5 text-yellow-500" />
                      Estimated 1RM
                    </div>

                    <div className="flex items-end gap-2">
                      <span className="font-mono text-4xl font-black tracking-tight text-yellow-500">
                        {oneRepMax.toFixed(1)}
                      </span>

                      <span className="mb-1 text-sm font-bold uppercase text-zinc-500">kg</span>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-yellow-500 transition-all duration-300 group-hover:w-full" />
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
