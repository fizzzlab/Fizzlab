"use client";

const deviceCards = [
  {
    name: "Fitbit",
    description: "Steps, active minutes, sleep duration and consistency — synced weekly from Fitbit cloud.",
    icon: FitbitIcon,
  },
  {
    name: "Withings",
    description: "Steps, sleep duration and active sessions — synced weekly from Withings Health Mate.",
    icon: WithingsIcon,
  },
  {
    name: "Garmin",
    description: "Steps, active minutes, sleep and activity sessions — pushed from Garmin Connect cloud.",
    icon: GarminIcon,
  },
  {
    name: "Huawei Health",
    description: "Steps, sleep duration and activity sessions — synced weekly from Huawei Health Kit.",
    icon: HuaweiIcon,
  },
];

const collectedItems = [
  "Daily step count",
  "Number of active days",
  "Sleep consistency score",
  "Activity session duration",
  "Active minutes per day",
  "Sleep duration (hours)",
  "Activity session count",
];

export function DashboardDevices() {
  return (
    <div className="space-y-6 pb-6">
      <header className="rounded-[28px] bg-[linear-gradient(135deg,#f8faff_0%,#eef3ff_100%)] px-6 py-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] ring-1 ring-slate-200/70">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[2.1rem] font-semibold tracking-tight text-[#1f2430]">Connected Devices</h1>
            <p className="mt-1 text-[0.98rem] text-slate-600">
              Manage your wearable OAuth connections • Data pulled automatically each week
            </p>
          </div>

          <div className="rounded-full border border-[#9ad9ae] bg-[#e6fbec] px-3 py-1 text-xs font-semibold text-[#167a37] shadow-sm">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#1f9d4d] align-middle" />
            Cloud-to-Cloud
          </div>
        </div>
      </header>

      <section className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        {deviceCards.map(({ name, description, icon: Icon }) => (
          <article key={name} className="rounded-[10px] border border-slate-200 bg-white px-4 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-[#edf3ff] text-[#155fd0] ring-1 ring-[#d5e1f8]">
                <Icon />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-[1.08rem] font-medium text-slate-900">{name}</h2>
                  <span className="rounded-full border border-[#ffd0d0] bg-[#fff2f2] px-2 py-0.5 text-[0.65rem] font-semibold text-[#f03b3b]">
                    Not Connected
                  </span>
                </div>
                <p className="mt-3 text-[0.92rem] leading-6 text-slate-600">{description}</p>
              </div>
            </div>

            <button
              onClick={() => alert("This feature will be implemented soon!")}
              className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-[6px] bg-[#0b5fc7] text-sm font-semibold text-white shadow-[0_10px_20px_rgba(11,95,199,0.24)] transition-transform hover:translate-y-[-1px] cursor-pointer"
            >
              <ConnectIcon />
              Connect via OAuth
            </button>
          </article>
        ))}
      </section>

      <section className="rounded-[12px] border border-slate-200 bg-white px-6 py-6 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
        <h2 className="text-[1.08rem] font-semibold text-slate-900">Data Collected Per Sync</h2>
        <p className="mt-1 text-sm text-slate-500">Strictly behavioural — no physiological data ever requested</p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {collectedItems.map((item) => (
            <div key={item} className="rounded-[8px] border border-[#e2e7f4] bg-[#f5f7ff] px-3 py-2.5 text-sm font-medium text-slate-700 shadow-sm">
              <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[#155fd0] align-middle" />
              {item}
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-slate-200 pt-4 text-sm text-slate-500">
          <span className="mr-2 inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-300 text-[10px] leading-none text-slate-500">i</span>
          No heart rate, HRV, SpO2, stress score, recovery, VO2 Max, blood pressure, or any physiological data is ever collected or stored.
        </div>
      </section>
    </div>
  );
}

function ConnectIcon() {
  return <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 12h10" /><path d="M13 6l4 6-4 6" /><path d="M11 6l-4 6 4 6" /></svg>;
}

function FitbitIcon() {
  return <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 12l4-4" /><path d="M11 8l6 6" /><path d="M8 13l3 3" /><path d="M9 5h2" /></svg>;
}

function WithingsIcon() {
  return <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="5" width="12" height="14" rx="2" /><path d="M9 9h6" /><path d="M9 13h6" /></svg>;
}

function GarminIcon() {
  return <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4a6 6 0 0 1 6 6v4a6 6 0 0 1-12 0v-4a6 6 0 0 1 6-6Z" /><path d="M9 11h6" /></svg>;
}

function HuaweiIcon() {
  return <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 6h14v12H5z" /><path d="M9 9l6 3-6 3V9Z" /></svg>;
}