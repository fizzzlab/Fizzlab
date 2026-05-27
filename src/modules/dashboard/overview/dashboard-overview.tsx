"use client";

const statCards = [
  { label: "Active Days / Week", icon: TrendUpIcon, tone: "emerald" },
  { label: "Sleep Duration", icon: MoonIcon, tone: "blue" },
  { label: "Active Minutes", icon: TimerIcon, tone: "amber" },
];

const automationRows = [
  { label: "Weekly Processing", value: "Mon 6am UTC", live: true },
  { label: "Email Delivery", value: "Mailgun active", live: true },
  { label: "Token Refresh", value: "No device", live: false },
  { label: "Last Sync", value: "Never", live: false },
];

export function DashboardOverview() {
  return (
    <div className="grid gap-4 grid-cols-1 xl:grid-cols-[minmax(0,1fr)_336px]">
      <section className="min-w-0 space-y-4">
        <header className="rounded-[24px] px-2 pt-2">
          <h1 className="text-[2.05rem] font-semibold tracking-tight text-[#0a4ca8]">Overview</h1>
          <p className="mt-1 text-[1.05rem] text-slate-700">Behavioural consistency at a glance</p>
        </header>

        <div className="rounded-[10px] border border-[#e07d00] bg-[#ffe1c7] px-6 py-5 shadow-[0_8px_20px_rgba(224,125,0,0.09)]">
          <div className="flex items-center gap-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[#c76300] text-white">
              <WarningIcon />
            </div>
            <p className="max-w-[46rem] text-[0.95rem] font-semibold leading-6 text-[#7a4200]">
              No wearable connected — Connect your Fitbit, Withings, Garmin, or Huawei device to start automated weekly syncing.
            </p>
            <div className="ml-auto shrink-0">
              <button onClick={() => alert("This feature will be implemented soon!")} className="w-full sm:w-auto rounded-[8px] bg-[#c56a00] px-5 py-2 text-sm font-semibold text-white shadow-[0_8px_16px_rgba(197,106,0,0.22)] cursor-pointer transition-colors hover:brightness-95">
                Connect Device
              </button>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[10px] border border-[#a9c7f6] bg-white px-7 pb-7 pt-6 shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
          <div className="absolute -right-14 -top-20 h-56 w-56 rounded-full bg-[#eef3fd]" />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-[0.74rem] font-semibold uppercase tracking-[0.12em] text-[#1257c6]">Steps Last Week</p>
              <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                No data yet
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-[12px] bg-[#155fd0] text-white shadow-[0_10px_20px_rgba(21,95,208,0.25)]">
              <WalkerIcon />
            </div>
          </div>

          <div className="mt-16 h-2 w-16 rounded-full bg-[#1257c6]" />
          <div className="mt-12 h-3 rounded-full bg-[#e9edf7] ring-1 ring-[#d7deee]" />
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {statCards.map(({ label, icon: Icon, tone }) => (
            <article key={label} className="min-h-[163px] rounded-[10px] border border-[#d7deee] bg-white px-4 py-4 shadow-[0_8px_22px_rgba(15,23,42,0.06)]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="max-w-[8ch] text-[0.8rem] font-semibold uppercase leading-5 tracking-[0.08em] text-slate-600">{label}</p>
                </div>
                <div className={`flex h-7 w-7 items-center justify-center rounded-md ${toneStyles[tone]}`}>
                  <Icon />
                </div>
              </div>
              <div className="mt-10 text-4xl leading-none text-slate-700">—</div>
              <div className="mt-6 h-2 rounded-full bg-slate-200/80" />
              <p className="mt-4 text-xs text-slate-500">• No data yet</p>
            </article>
          ))}
        </div>

        <section className="rounded-[10px] border border-[#d7deee] bg-[#f4f6fd] px-5 py-5 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
          <h2 className="text-[1.1rem] font-semibold text-[#1257c6]">Recent Sync Activity</h2>
          <p className="mt-1 text-sm text-slate-600">Latest processing runs</p>
          <div className="mt-4 border-t border-slate-200" />
          <div className="flex min-h-[246px] flex-col items-center justify-center text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#c3d2ff] bg-[#dfe8ff] text-[#1257c6]">
              <SyncIcon />
            </div>
            <p className="mt-4 text-lg font-semibold text-slate-800">No sync activity yet.</p>
            <p className="mt-1 max-w-md text-sm text-slate-600">This will populate after your first weekly processing run.</p>
          </div>
        </section>
      </section>

      <aside className="space-y-4 xl:pt-2">
        <section className="rounded-[10px] border border-[#d7deee] bg-[#f3f5fc] px-4 py-4 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[1.08rem] font-semibold text-[#1257c6]">Automation</h2>
              <p className="mt-0.5 text-xs text-slate-500">Pipeline status</p>
            </div>
            <span className="rounded-full bg-[#7ef08c] px-3 py-1 text-[0.65rem] font-semibold text-[#0a6424] shadow-sm ring-1 ring-[#5be373]">Active</span>
          </div>

          <div className="mt-4 border-t border-slate-200" />
          <div className="mt-3 space-y-2">
            {automationRows.map((row) => (
              <div key={row.label} className={`flex items-center justify-between rounded-[9px] border px-3 py-3 text-sm ${row.live ? "border-[#dfe7fb] bg-white" : "border-[#e4e7ef] bg-[#f7f8fc] text-slate-400"}`}>
                <div className="flex items-center gap-2 font-medium text-slate-700">
                  <span className={`h-2 w-2 rounded-full ${row.live ? "bg-emerald-400" : "bg-slate-300"}`} />
                  {row.label}
                </div>
                <span className="text-xs font-semibold text-[#155fd0]">{row.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-slate-200" />
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[1.08rem] font-semibold text-[#1257c6]">Connected Devices</h2>
              <p className="mt-0.5 text-xs text-slate-500">Wearable OAuth connections</p>
            </div>
            <button onClick={() => alert("This feature will be implemented soon!")} className="rounded-[6px] bg-[#155fd0] px-3 py-1.5 text-[0.7rem] font-semibold text-white shadow-sm cursor-pointer transition-colors hover:brightness-95">Manage</button>
          </div>

          <div className="mt-4 border-t border-slate-200" />
          <div className="mt-4 rounded-[12px] border-2 border-dashed border-[#4f80e5] bg-white px-3 py-7 text-center shadow-inner">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#2f69df] text-white">
              <BoltIcon />
            </div>
            <p className="mt-6 text-xs font-semibold text-slate-700">No devices connected yet</p>
            <a href="#" onClick={(e) => { e.preventDefault(); alert("This feature will be implemented soon!"); }} className="mt-2 inline-block text-[0.75rem] font-semibold text-[#155fd0] cursor-pointer">Connect a device →</a>
          </div>
        </section>

        <section className="rounded-[10px] border border-[#d7deee] bg-[#f3f5fc] px-4 py-4 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-[7px] bg-[#ffe1c5] text-[#bc6400] ring-1 ring-[#efbf85]">
              <TrophyIcon />
            </div>
            <div>
              <h2 className="text-[1.08rem] font-semibold text-[#1257c6]">Badge Progress</h2>
              <p className="text-xs text-slate-500">0 earned • 0 active streaks</p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {[
              { name: "Step Explorer", next: "Step Sprout", icon: StepBadgeIcon, tone: "mint" },
              { name: "Active Days Warrior", next: "Routine Rookie", icon: FlameBadgeIcon, tone: "blue" },
              { name: "Active Minutes Maker", next: "Move Starter", icon: TimerBadgeIcon, tone: "amber" },
              { name: "Sleep Builder", next: "Sleep Starter", icon: SleepBadgeIcon, tone: "slate" },
            ].map(({ name, next, icon: Icon, tone }) => (
              <div key={name} className={`flex items-center gap-3 rounded-[9px] border px-3 py-3 ${badgeStyles[tone]}`}>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/75 text-[#1149b5] shadow-sm">
                  <Icon />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">{name}</p>
                  <p className="truncate text-[0.68rem] uppercase tracking-[0.15em] text-slate-500">Next • {next}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}

const toneStyles: Record<string, string> = {
  emerald: "bg-[#b7f8c2] text-[#107a2f] ring-1 ring-[#79e19a]",
  blue: "bg-[#d8e5ff] text-[#1d57d0] ring-1 ring-[#a9c2ff]",
  amber: "bg-[#ffe2c8] text-[#c46b00] ring-1 ring-[#f0bc87]",
};

const badgeStyles: Record<string, string> = {
  mint: "border-[#c9efd5] bg-[#dff7e3]",
  blue: "border-[#cad9f5] bg-[#d6e2fb]",
  amber: "border-[#ead6bf] bg-[#e7d8c8]",
  slate: "border-[#d1d9ea] bg-[#d7e0f4]",
};

function TrophyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 4h8v3a4 4 0 0 1-8 0V4Z" />
      <path d="M6 5H4a1 1 0 0 0-1 1c0 2.8 2 5 5 5" />
      <path d="M18 5h2a1 1 0 0 1 1 1c0 2.8-2 5-5 5" />
      <path d="M12 12v4" />
      <path d="M9 20h6" />
      <path d="M10 16h4" />
    </svg>
  );
}

function TrendUpIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m4 15 5-5 4 4 7-7" />
      <path d="M15 7h5v5" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a7 7 0 1 0 9 9A9 9 0 1 1 12 3Z" />
    </svg>
  );
}

function TimerIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2h4" />
      <path d="M12 14l3-3" />
      <circle cx="12" cy="14" r="7" />
    </svg>
  );
}

function FlameBadgeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-[#f97316]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3c1.8 3 .8 4.8-.7 6.6C9.8 11.4 9 13 9 15a3 3 0 0 0 6 0c0-1.2-.3-2.3-1-3.2 2.3 1 4 3.3 4 6.2a6 6 0 0 1-12 0C6 12.8 8.7 9.2 12 3Z" />
    </svg>
  );
}

function TimerBadgeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-[#ef4444]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2h4" />
      <path d="M12 14l3-3" />
      <circle cx="12" cy="14" r="7" />
      <path d="M9 3h6" />
    </svg>
  );
}

function SleepBadgeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-[#16a34a]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 13a8 8 0 1 1-10-10 7 7 0 0 0 10 10Z" />
    </svg>
  );
}

function StepBadgeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-[#2563eb]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 18c2-5 3.8-8.5 6-12 1 3.4 2.8 6.8 6 10" />
      <circle cx="8" cy="7" r="2" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <path d="M10.3 4.8a2 2 0 0 1 3.4 0l7 12A2 2 0 0 1 19 20H5a2 2 0 0 1-1.7-3.2l7-12Z" />
    </svg>
  );
}

function WalkerIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="4" r="2" />
      <path d="M12 6v4l3 2" />
      <path d="M10 10l-3 6" />
      <path d="M12 12l-1 7" />
      <path d="M15 12l3 5" />
    </svg>
  );
}

function SyncIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h5V2" />
      <path d="M20 17h-5v5" />
      <path d="M5 17a8 8 0 0 0 12 2" />
      <path d="M19 7a8 8 0 0 0-12-2" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m13 2-8 10h6l-1 10 8-10h-6l1-10Z" />
    </svg>
  );
}
