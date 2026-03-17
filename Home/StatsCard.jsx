import React from "react";

const ACCENTS = {
  indigo: {
    ring: "ring-indigo-100",
    chip: "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-200",
    glow: "from-indigo-500/10 via-indigo-500/0 to-transparent",
  },
  emerald: {
    ring: "ring-emerald-100",
    chip: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
    glow: "from-emerald-500/10 via-emerald-500/0 to-transparent",
  },
  amber: {
    ring: "ring-amber-100",
    chip: "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200",
    glow: "from-amber-500/10 via-amber-500/0 to-transparent",
  },
  rose: {
    ring: "ring-rose-100",
    chip: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200",
    glow: "from-rose-500/10 via-rose-500/0 to-transparent",
  },
};

const StatsCard = ({ label, value, icon: Icon, accent = "indigo", helper }) => {
  const styles = ACCENTS[accent] ?? ACCENTS.indigo;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ${styles.ring} transition duration-200 hover:-translate-y-0.5 hover:shadow-md`}
    >
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${styles.glow}`} />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${styles.chip}`}>
            {Icon ? <Icon className="text-base" /> : null}
            <span className="truncate">{label}</span>
          </div>

          <div className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">{value}</div>
          {helper ? <div className="mt-1 text-sm text-slate-600">{helper}</div> : null}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
