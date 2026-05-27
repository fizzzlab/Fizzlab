"use client";

const stats = [
  { label: "Avg. Steps Target Hit", value: "0%", icon: WalkerIcon },
  { label: "Avg. Sleep Target Hit", value: "0%", icon: MoonIcon },
  { label: "Avg. Active Days / Week", value: "0", icon: CalendarIcon, note: "(Platform avg: 3.5)" },
  { label: "Overall Consistency Score", value: "0%", icon: TrendIcon },
];

const metricTargets = [
  { label: "Steps", value: "0%" },
  { label: "Active Days", value: "0%" },
  { label: "Sleep Duration", value: "0%" },
  { label: "Active Minutes", value: "0%" },
  { label: "Sleep Consistency", value: "0%" },
];

const deviceStats = [
  ["Fitbit", 0],
  ["Withings", 0],
  ["Garmin", 0],
  ["Huawei", 0],
  ["Disconnected", 0],
];

export function AdminAnalyticsPage() {
  return (
    <div className="space-y-4 text-slate-900">
      <header className="flex flex-wrap items-start justify-between gap-4 px-6 pt-5">
        <div>
          <h1 className="text-[2rem] font-semibold tracking-tight text-[#22252f] sm:text-[2.2rem]">Behavioral Analytics</h1>
          <p className="mt-1 text-sm text-slate-500">Aggregated pseudonymous trends • No individual data surfaced</p>
        </div>

        <button
          onClick={() => alert("This feature will be implemented soon!")}
          className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 cursor-pointer"
        >
          <RefreshIcon />
          Refresh
        </button>
      </header>

      <section className="grid gap-4 px-6 pt-1 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <article key={stat.label} className="rounded-[18px] border border-[#d7dbe7] bg-white px-5 py-4 shadow-[0_1px_0_rgba(15,23,42,0.02)]">
            <div className="flex items-center justify-between gap-3">
              <h2 className="max-w-40 text-sm font-medium text-slate-600">{stat.label}</h2>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eef0f8] text-slate-500">
                <stat.icon />
              </div>
            </div>
            <p className="mt-5 text-[2.1rem] font-semibold leading-none text-[#22252f]">{stat.value}</p>
            {stat.note ? <p className="mt-3 text-xs text-slate-500">{stat.note}</p> : <div className="mt-4 h-1.5 rounded-full bg-[#e3e5ef]" />}
          </article>
        ))}
      </section>

      <section className="grid gap-4 px-6 pt-1 grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.9fr)]">
        <article className="rounded-[18px] border border-[#d7dbe7] bg-white shadow-[0_1px_0_rgba(15,23,42,0.02)]">
          <div className="border-b border-[#e6e8f0] px-5 py-4">
            <h2 className="text-[1.15rem] font-medium text-[#22252f]">Weekly Target Hit Rate (%)</h2>
          </div>
          <div className="p-4">
            <div className="flex min-h-75 items-center justify-center rounded-[14px] border border-dashed border-[#cad3ee] bg-[#fafbff] text-center text-slate-400">
              <div>
                <div className="mx-auto flex h-10 w-10 items-center justify-center text-[#b3b9cf]">
                  <BarsIcon />
                </div>
                <p className="mt-3 text-sm text-slate-500">No weekly report data yet</p>
              </div>
            </div>
          </div>
        </article>

        <article className="rounded-[18px] border border-[#d7dbe7] bg-white shadow-[0_1px_0_rgba(15,23,42,0.02)]">
          <div className="border-b border-[#e6e8f0] px-5 py-4">
            <h2 className="text-[1.15rem] font-medium text-[#22252f]">Target Achievement by Metric</h2>
          </div>
          <div className="space-y-4 px-5 py-4">
            {metricTargets.map((metric) => (
              <div key={metric.label}>
                <div className="flex items-center justify-between text-sm text-slate-700">
                  <span>{metric.label}</span>
                  <span>{metric.value}</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-[#e4e7f2]" />
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-4 px-6 pt-1 pb-4 grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.9fr)]">
        <article className="rounded-[18px] border border-[#d7dbe7] bg-white shadow-[0_1px_0_rgba(15,23,42,0.02)]">
          <div className="border-b border-[#e6e8f0] px-5 py-4">
            <h2 className="text-[1.15rem] font-medium text-[#22252f]">Sync Activity (30d)</h2>
          </div>
          <div className="p-4">
            <div className="flex min-h-75 items-center justify-center rounded-[14px] border border-dashed border-[#cad3ee] bg-[#fafbff] text-center text-slate-400">
              <div>
                <div className="mx-auto flex h-10 w-10 items-center justify-center text-[#c0c5d8]">
                  <SyncIcon />
                </div>
                <p className="mt-3 text-sm text-slate-500">No sync activity yet</p>
              </div>
            </div>
          </div>
        </article>

        <article className="rounded-[18px] border border-[#d7dbe7] bg-white shadow-[0_1px_0_rgba(15,23,42,0.02)]">
          <div className="border-b border-[#e6e8f0] px-5 py-4">
            <h2 className="text-[1.15rem] font-medium text-[#22252f]">Wearable Distribution</h2>
          </div>
          <div className="space-y-4 px-5 py-4">
            {deviceStats.map(([label, value], index) => (
              <div key={label} className={`flex items-center justify-between ${index < deviceStats.length - 1 ? "pb-3" : ""}`}>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span className={`h-2 w-2 rounded-full ${label === "Disconnected" ? "bg-[#e8a39a]" : "bg-[#c6cbe0]"}`} />
                  {label}
                </div>
                <span className="text-sm text-slate-700">{value}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}

function RefreshIcon() {
  return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12a8 8 0 1 1-2.4-5.7" /><path d="M20 4v6h-6" /></svg>;
}

function BarsIcon() {
  return <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 19V11" /><path d="M12 19V7" /><path d="M18 19v-4" /></svg>;
}

function SyncIcon() {
  return <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h5V2" /><path d="M20 17h-5v5" /><path d="M5 17a8 8 0 0 0 12 2" /><path d="M19 7a8 8 0 0 0-12-2" /></svg>;
}

function WalkerIcon() {
  return <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18c2-5 3.8-8.5 6-12 1 3.4 2.8 6.8 6 10" /><circle cx="8" cy="7" r="2" /></svg>;
}

function MoonIcon() {
  return <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a7 7 0 1 0 9 9A9 9 0 1 1 12 3Z" /></svg>;
}

function CalendarIcon() {
  return <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M8 3v4" /><path d="M16 3v4" /><path d="M4 10h16" /></svg>;
}

function TrendIcon() {
  return <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19h16" /><path d="m6 15 4-4 4 3 4-6" /></svg>;
}