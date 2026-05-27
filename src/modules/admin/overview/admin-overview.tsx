"use client";

export function AdminOverview() {
  return (
    <div className="space-y-4 text-slate-900">
      <header className="flex items-start justify-between gap-4 border-b border-slate-200 bg-[#f8f8fc] px-6 py-5">
        <div>
          <h1 className="text-[2rem] font-semibold tracking-tight text-[#22252f] sm:text-[2.2rem]">System Overview</h1>
          <p className="mt-1 text-sm text-slate-500">Platform health, user metrics, and automation status.</p>
        </div>

        <button
          onClick={() => alert("This feature will be implemented soon!")}
          className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 cursor-pointer"
        >
          <RefreshIcon />
          Refresh
        </button>
      </header>

      <section className="grid gap-4 px-6 pt-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <article key={stat.label} className="rounded-[18px] border border-[#d7dbe7] bg-white px-5 py-4 shadow-[0_1px_0_rgba(15,23,42,0.02)]">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-medium text-slate-600">{stat.label}</h2>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eef0f8] text-slate-500">
                <stat.icon />
              </div>
            </div>
            <p className="mt-6 text-[2.1rem] font-semibold leading-none" style={{ color: stat.valueColor }}>
              {stat.value}
            </p>
            <p className="mt-2 text-sm text-slate-500">• {stat.note}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 px-6 pt-1 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <article key={section.title} className="rounded-[18px] border border-[#d7dbe7] bg-white px-5 py-4 shadow-[0_1px_0_rgba(15,23,42,0.02)]">
            <h2 className="text-[1.15rem] font-medium text-[#22252f]">{section.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{section.text}</p>
            <a
              href={section.href}
              onClick={(event) => {
                event.preventDefault();
                alert("This feature will be implemented soon!");
              }}
              className="mt-5 inline-flex items-center gap-1 text-sm font-medium cursor-pointer hover:underline"
              style={{ color: section.color }}
            >
              Open <span aria-hidden="true">→</span>
            </a>
          </article>
        ))}
      </section>

      <section className="px-6 pt-2 pb-4">
        <article className="rounded-[18px] border border-[#d7dbe7] bg-white shadow-[0_1px_0_rgba(15,23,42,0.02)]">
          <div className="flex items-center justify-between border-b border-[#e6e8f0] px-5 py-4">
            <div>
              <h2 className="text-[1.15rem] font-medium text-[#22252f]">Recent Sync Events</h2>
              <p className="mt-1 text-sm text-slate-500">Latest wearable sync activity</p>
            </div>
            <button onClick={() => alert("This feature will be implemented soon!")} className="text-sm font-medium text-[#0f67e6] cursor-pointer hover:underline">
              View all →
            </button>
          </div>

          <div className="flex min-h-75 items-center justify-center px-6 py-10 text-center">
            <div>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e9eaf4] text-slate-500">
                <ClockIcon />
              </div>
              <h3 className="mt-5 text-[1.15rem] font-semibold text-[#22252f]">No sync events yet.</h3>
              <p className="mt-2 text-sm text-slate-500">Events will appear after the first weekly cron run.</p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}

const stats = [
  { label: "Total Users", value: "9", note: "registered accounts", valueColor: "#c56a00", icon: UsersIcon },
  { label: "Active Connections", value: "0", note: "wearables connected", valueColor: "#155fd0", icon: ConnectionsIcon },
  { label: "Syncs (30d)", value: "0", note: "successful this month", valueColor: "#c56a00", icon: MailIcon },
  { label: "Avg Consistency", value: "0%", note: "platform avg this month", valueColor: "#c56a00", icon: TrendIcon },
];

const sections = [
  { title: "User Management", text: "View users, connection status, support actions", href: "#", color: "#c56a00" },
  { title: "Sync Health", text: "Monitor sync jobs, retry logs, email delivery", href: "#", color: "#0f67e6" },
  { title: "Analytics", text: "Aggregate behaviour trends and target hit rates", href: "#", color: "#c56a00" },
];

function RefreshIcon() {
  return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12a8 8 0 1 1-2.4-5.7" /><path d="M20 4v6h-6" /></svg>;
}

function UsersIcon() {
  return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 11a3 3 0 1 0 0-6" /></svg>;
}

function ConnectionsIcon() {
  return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 12h10" /><path d="M13 6l4 6-4 6" /><path d="M11 6l-4 6 4 6" /></svg>;
}

function MailIcon() {
  return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>;
}

function TrendIcon() {
  return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19h16" /><path d="m6 15 4-4 4 3 4-6" /></svg>;
}

function ClockIcon() {
  return <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></svg>;
}