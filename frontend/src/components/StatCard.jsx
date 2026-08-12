export function StatCard({ icon: Icon, title, subtitle, value, unit, children }) {
  return (
    <article className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 sm:p-8 flex flex-col items-center text-center hover:border-zinc-700 transition-colors relative overflow-hidden">
      <Icon className="text-zinc-600 w-8 h-8 mb-4" />
      <p className="text-zinc-400 text-xs tracking-widest uppercase mb-4">{title}</p>
      <p className="text-zinc-300 text-sm mb-1">{subtitle}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-bold text-white">{value}</span>
        <span className="text-zinc-500 font-semibold">{unit}</span>
      </div>
      {children}
    </article>
  );
}
