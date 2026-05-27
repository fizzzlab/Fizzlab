"use client";

const badgeGroups = [
  {
    title: "Step Explorer",
    subtitle: "Current streak: 0 weeks · Next: Step Sprout (1w)",
    accent: "text-blue-600",
    border: "border-[#cfd8ee]",
    glow: "bg-[#f8fbff]",
    icon: StepBadgeIcon,
    cards: ["Step Sprout", "Step Scout", "Step Strider", "Step Champion", "Step Legend"],
  },
  {
    title: "Active Days Warrior",
    subtitle: "Current streak: 0 weeks · Next: Routine Rookie (1w)",
    accent: "text-orange-600",
    border: "border-[#d9dded]",
    glow: "bg-[#fffaf5]",
    icon: CalendarBadgeIcon,
    cards: ["Routine Rookie", "Routine Builder", "Weekly Warrior", "Habit Hero", "Consistency Keeper"],
  },
  {
    title: "Active Minutes Machine",
    subtitle: "Current streak: 0 weeks · Next: Move Starter (1w)",
    accent: "text-red-500",
    border: "border-[#d9e0ef]",
    glow: "bg-[#fff7f7]",
    icon: StopWatchBadgeIcon,
    cards: ["Move Starter", "Momentum Maker", "Consistency Engine", "Endurance Mode", "Iron Routine"],
  },
  {
    title: "Sleep Builder",
    subtitle: "Current streak: 0 weeks · Next: Sleep Starter (1w)",
    accent: "text-emerald-600",
    border: "border-[#d6eddc]",
    glow: "bg-[#f6fff7]",
    icon: SleepBadgeIcon,
    cards: ["Sleep Starter", "Sleep Builder", "Sleep Routine", "Sleep Strong", "Sleep Legend"],
  },
  {
    title: "Sleep Routine Master",
    subtitle: "Current streak: 0 weeks · Next: Routine Finder (1w)",
    accent: "text-indigo-600",
    border: "border-[#dbe2f3]",
    glow: "bg-[#f7f9ff]",
    icon: BedBadgeIcon,
    cards: ["Routine Finder", "Routine Builder", "Routine Keeper", "Routine Anchor", "Routine Master"],
  },
  {
    title: "Session Streak",
    subtitle: "Current streak: 0 weeks · Next: Session Starter (1w)",
    accent: "text-emerald-600",
    border: "border-[#d7e7da]",
    glow: "bg-[#f5fff6]",
    icon: LinkBadgeIcon,
    cards: ["Session Starter", "Session Builder", "Session Streak", "Session Strong", "Session Legend"],
  },
];

const summaryCards = [
  { label: "Badges Earned", value: "0/30", icon: TrophyIcon, tone: "bg-[#ffe7d3] text-[#bb6300]" },
  { label: "Active Streaks", value: "0", icon: FlameIcon, tone: "bg-[#e4ecff] text-[#2563eb]" },
  { label: "Longest Streak", value: "0w", icon: FlagIcon, tone: "bg-[#d7ffd8] text-[#2ca44f]" },
];

export function DashboardBadges() {
  return (
    <div className="space-y-6 pb-6">
      <header className="px-1 pt-1">
        <h1 className="text-[2.05rem] font-semibold tracking-tight text-[#111827]">Goals &amp; Badges</h1>
        <p className="mt-1 text-[1.02rem] text-slate-700">Build streaks, earn badges, stay consistent.</p>
      </header>

      <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {summaryCards.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="rounded-[10px] border border-slate-200 bg-white px-5 py-4 shadow-[0_8px_22px_rgba(15,23,42,0.06)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-slate-600">{label}</p>
                <p className="mt-1 text-[2rem] font-semibold leading-none text-[#0b57c7]">{value}</p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-[10px] ${tone}`}>
                <Icon />
              </div>
            </div>
          </div>
        ))}
      </section>

      <div className="flex flex-wrap gap-3 text-sm font-semibold">
        <button onClick={() => alert("This feature will be implemented soon!") } className="w-full sm:w-auto rounded-full bg-[#ad6100] px-5 py-2 text-white shadow-sm cursor-pointer transition-colors hover:brightness-95">Goal Progress</button>
        <button onClick={() => alert("This feature will be implemented soon!") } className="w-full sm:w-auto rounded-full bg-[#e6e7ef] px-5 py-2 text-slate-500 cursor-pointer transition-colors hover:bg-slate-100">Earned (0)</button>
      </div>

      <section className="space-y-4">
        {badgeGroups.map(({ title, subtitle, accent, border, glow, icon: Icon, cards }) => (
          <article key={title} className={`rounded-[12px] border ${border} bg-white px-5 py-4 shadow-[0_8px_22px_rgba(15,23,42,0.05)]`}>
            <div className="flex items-start gap-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${glow} ring-1 ring-slate-200/80`}>
                <Icon />
              </div>
              <div>
                <h2 className="text-[1.15rem] font-medium text-slate-900">{title}</h2>
                <p className={`text-xs ${accent}`}>{subtitle}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
              {cards.map((badge, index) => (
                <div key={badge} className="rounded-[10px] border border-slate-100 bg-[#fbfbfd] px-3 py-4 text-center text-slate-400 shadow-sm">
                  <LockIcon />
                  <p className="mt-2 text-xs font-medium text-slate-500">{badge}</p>
                  <p className="mt-1 text-[10px] text-slate-400">{index + 1}w streak</p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
              <span>Progress to {cards[0]}</span>
              <span>0/w</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-slate-100 ring-1 ring-slate-200/80">
              <div className="h-full w-[2%] rounded-full bg-[#d7dbee]" />
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

function TrophyIcon() {
  return <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 4h8v3a4 4 0 0 1-8 0V4Z" /><path d="M6 5H4a1 1 0 0 0-1 1c0 2.8 2 5 5 5" /><path d="M18 5h2a1 1 0 0 1 1 1c0 2.8-2 5-5 5" /><path d="M12 12v4" /><path d="M9 20h6" /><path d="M10 16h4" /></svg>;
}

function FlameIcon() {
  return <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3c1.8 3 .8 4.8-.7 6.6C9.8 11.4 9 13 9 15a3 3 0 0 0 6 0c0-1.2-.3-2.3-1-3.2 2.3 1 4 3.3 4 6.2a6 6 0 0 1-12 0C6 12.8 8.7 9.2 12 3Z" /></svg>;
}

function FlagIcon() {
  return <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 21V4" /><path d="M6 5c2.4-1.7 5.3-1.7 7.7 0 2.1 1.5 4.4 1.6 7 .2v9.2c-2.7 1.4-5 .9-7-.6-2.4-1.7-5.3-1.7-7.7 0" /></svg>;
}

function StepBadgeIcon() {
  return <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-[#2563eb]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18c2-5 3.8-8.5 6-12 1 3.4 2.8 6.8 6 10" /><circle cx="8" cy="7" r="2" /></svg>;
}

function CalendarBadgeIcon() {
  return <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-[#f97316]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M8 3v4" /><path d="M16 3v4" /><path d="M4 9h16" /></svg>;
}

function StopWatchBadgeIcon() {
  return <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-[#ef4444]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2h4" /><path d="M12 14l3-3" /><circle cx="12" cy="14" r="7" /><path d="M9 3h6" /></svg>;
}

function SleepBadgeIcon() {
  return <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-[#16a34a]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 13a8 8 0 1 1-10-10 7 7 0 0 0 10 10Z" /></svg>;
}

function BedBadgeIcon() {
  return <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-[#6366f1]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18v6" /><path d="M4 12V8h8a4 4 0 0 1 4 4" /></svg>;
}

function LinkBadgeIcon() {
  return <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-[#16a34a]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1" /><path d="M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1" /></svg>;
}

function LockIcon() {
  return <svg viewBox="0 0 24 24" className="mx-auto h-5 w-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>;
}
