"use client";

import { useState } from "react";

type LogFilter = "all" | "success" | "failed" | "retrying";

const stats = [
  { label: "Total Sync Attempts", value: "0", note: "Awaiting initial run", icon: AttemptsIcon, tone: "#5d8df8" },
  { label: "Successful Syncs", value: "0", note: "0.0% completion rate", icon: SuccessIcon, tone: "#45d86d" },
  { label: "Failed / Retrying", value: "0", note: "No incidents detected", icon: WarningIcon, tone: "#ff9f91" },
  { label: "Success Rate", value: "0%", note: "", icon: TrendIcon, tone: "#f0ad76" },
];

const emailRows = [
  { title: "Acknowledgement", text: "Sent on every successful sync to verify data integrity." },
  { title: "Encouragement", text: "Sent when consistency score >= 70% to motivate user progress." },
  { title: "Re-authentication", text: "Sent when OAuth token refresh fails and manual intervention is needed." },
];

const logFilters: Array<{ key: LogFilter; label: string }> = [
  { key: "all", label: "All" },
  { key: "success", label: "Success" },
  { key: "failed", label: "Failed" },
  { key: "retrying", label: "Retrying" },
];

export function AdminSyncHealthPage() {
  const [activeFilter, setActiveFilter] = useState<LogFilter>("all");

  return (
    <div className="space-y-4 text-slate-900">
      <header className="flex flex-wrap items-start justify-between gap-4 px-6 pt-5">
        <div>
          <h1 className="text-[2rem] font-semibold tracking-tight text-[#22252f] sm:text-[2.2rem]">Sync Health</h1>
          <p className="mt-1 text-sm text-slate-500">Wearable sync logs, retry status, and email delivery health.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={() => alert("This feature will be implemented soon!")} className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 cursor-pointer">
            <RefreshIcon />
            Refresh
          </button>
          <button onClick={() => alert("This feature will be implemented soon!")} className="inline-flex h-10 items-center gap-2 rounded-md border border-[#0c56d6] bg-[#0f67e6] px-4 text-sm font-medium text-white shadow-[0_10px_20px_rgba(15,103,230,0.22)] transition-colors hover:brightness-95 cursor-pointer">
            <PlayIcon />
            Trigger Weekly Job
          </button>
        </div>
      </header>

      <section className="grid gap-4 px-6 pt-1 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <article key={stat.label} className="rounded-[18px] border border-[#d7dbe7] bg-white px-5 py-4 shadow-[0_1px_0_rgba(15,23,42,0.02)]">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-medium text-slate-600">{stat.label}</h2>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eef0f8]" style={{ color: stat.tone }}>
                <stat.icon />
              </div>
            </div>
            <p className="mt-6 text-[2.1rem] font-semibold leading-none text-[#22252f]">{stat.value}</p>
            <p className="mt-2 text-sm text-slate-500">{stat.note || " "}</p>
            {stat.label === "Success Rate" ? <div className="mt-4 h-1.5 rounded-full bg-[#e8ebf3]"><div className="h-full w-[0%] rounded-full bg-[#d5d9e8]" /></div> : null}
          </article>
        ))}
      </section>

      <section className="px-6 pt-1">
        <article className="overflow-hidden rounded-[18px] border border-[#d7dbe7] bg-white shadow-[0_1px_0_rgba(15,23,42,0.02)]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e6e8f0] px-5 py-4">
            <div>
              <h2 className="text-[1.15rem] font-medium text-[#22252f]">Sync Logs</h2>
              <p className="mt-1 text-sm text-slate-500">Last 100 sync attempts</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-full border border-[#d5d9e7] bg-[#f3f4fa] p-1 text-[0.72rem] font-medium text-slate-500 shadow-sm">
                {logFilters.map((filter) => {
                  const active = filter.key === activeFilter;
                  return (
                    <button
                      key={filter.key}
                      onClick={() => setActiveFilter(filter.key)}
                      className={`rounded-full px-3 py-1 transition-colors cursor-pointer ${active ? "bg-white text-slate-700 shadow-sm" : "hover:text-slate-700"}`}
                    >
                      {filter.label}
                    </button>
                  );
                })}
              </div>
              <button onClick={() => alert("This feature will be implemented soon!")} className="rounded-md border border-slate-200 bg-white p-2 text-slate-500 shadow-sm transition-colors hover:bg-slate-50 cursor-pointer">
                <FilterIcon />
              </button>
            </div>
          </div>

          <div className="flex min-h-75 items-center justify-center px-6 py-12 text-center">
            <div>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e9eaf4] text-slate-400">
                <ClockIcon />
              </div>
              <h3 className="mt-5 text-[1.15rem] font-semibold text-[#22252f]">No sync logs yet</h3>
              <p className="mt-2 text-sm text-slate-500">Logs will appear automatically after the first weekly cron run or once you trigger a manual sync.</p>
              <button onClick={() => alert("This feature will be implemented soon!")} className="mt-5 inline-flex h-9 items-center rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 cursor-pointer">
                Learn more about sync scheduling
              </button>
            </div>
          </div>
        </article>
      </section>

      <section className="px-6 pt-1 pb-4">
        <article className="overflow-hidden rounded-[18px] border border-[#d7dbe7] bg-white shadow-[0_1px_0_rgba(15,23,42,0.02)]">
          <div className="border-b border-[#e6e8f0] px-5 py-4">
            <h2 className="text-[1.15rem] font-medium text-[#22252f]">Email System Health</h2>
            <p className="mt-1 text-sm text-slate-500">Mailgun delivery pipeline status</p>
          </div>

          <div className="divide-y divide-[#e6e8f0]">
            {emailRows.map((row) => (
              <div key={row.title} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dff7e3] text-[#1fa35a]">
                    <MailCheckIcon />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#22252f]">{row.title}</h3>
                    <p className="mt-1 max-w-136 text-sm text-slate-500">{row.text}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span>Mailgun · thisisdevspace.site</span>
                  <span className="rounded-full bg-[#5be373] px-2.5 py-1 text-[0.65rem] font-semibold text-white">Active</span>
                  <button onClick={() => alert("This feature will be implemented soon!")} className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50 cursor-pointer">
                    Test
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[#e6e8f0] px-5 py-3 text-[0.72rem] text-slate-500">
            Detailed delivery logs available in your Mailgun dashboard at app.mailgun.com
          </div>
        </article>
      </section>
    </div>
  );
}

function RefreshIcon() {
  return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12a8 8 0 1 1-2.4-5.7" /><path d="M20 4v6h-6" /></svg>;
}

function PlayIcon() {
  return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 7 8 5-8 5V7Z" /></svg>;
}

function FilterIcon() {
  return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16" /><path d="M7 12h10" /><path d="M10 18h4" /></svg>;
}

function ClockIcon() {
  return <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></svg>;
}

function MailCheckIcon() {
  return <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="5" width="16" height="14" rx="2" /><path d="m4 7 8 5 5-3" /><path d="m13 16 2 2 4-4" /></svg>;
}

function AttemptsIcon() {
  return <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a9 9 0 1 0 9 9" /><path d="M12 7v5l3 2" /></svg>;
}

function SuccessIcon() {
  return <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="m9 12 2 2 4-5" /></svg>;
}

function WarningIcon() {
  return <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4" /><path d="M12 17h.01" /><path d="M10.3 4.8a2 2 0 0 1 3.4 0l7 12A2 2 0 0 1 19 20H5a2 2 0 0 1-1.7-3.2l7-12Z" /></svg>;
}

function TrendIcon() {
  return <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19h16" /><path d="m6 15 4-4 4 3 4-6" /></svg>;
}