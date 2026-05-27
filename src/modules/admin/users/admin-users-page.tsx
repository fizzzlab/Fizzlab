"use client";

import { useMemo, useState } from "react";

type FilterKey = "all" | "connected" | "expired" | "disconnected";

const filters: Array<{ key: FilterKey; label: string }> = [
  { key: "all", label: "All" },
  { key: "connected", label: "Connected" },
  { key: "expired", label: "Expired" },
  { key: "disconnected", label: "Disconnected" },
];

const userRows = [
  {
    email: "test+2@pulsetrack.io",
    provider: "-",
    connection: "-",
    lastSync: "Never",
    joined: "Jan 15, 2024",
    status: "Inactive",
  },
  {
    email: "test+1@pulsetrack.io",
    provider: "-",
    connection: "-",
    lastSync: "Never",
    joined: "Jan 14, 2024",
    status: "Inactive",
  },
  {
    email: "demo_user@example.com",
    provider: "-",
    connection: "-",
    lastSync: "Never",
    joined: "Jan 10, 2024",
    status: "Inactive",
  },
];

export function AdminUsersPage() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const visibleRows = useMemo(() => userRows, [activeFilter]);

  return (
    <div className="px-6 py-5 text-slate-900">
      <header>
        <h1 className="text-[2rem] font-semibold tracking-tight text-[#22252f] sm:text-[2.15rem]">User Management</h1>
        <p className="mt-1 text-sm text-slate-500">9 registered • 0 with active connections</p>
      </header>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <label className="flex h-9 w-48 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-500 shadow-sm">
          <SearchIcon />
          <input
            type="search"
            placeholder="Search email..."
            className="w-full bg-transparent outline-none placeholder:text-slate-400"
          />
        </label>

        <div className="flex flex-wrap gap-1.5">
          {filters.map((filter) => {
            const active = filter.key === activeFilter;

            return (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`h-8 rounded-full border px-4 text-sm font-semibold transition-colors cursor-pointer ${
                  active
                    ? "border-[#2d7ef7] bg-[#2d7ef7] text-white shadow-[0_4px_14px_rgba(45,126,247,0.22)]"
                    : "border-[#cfd6e5] bg-[#eef1fa] text-slate-600 hover:bg-slate-100"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      <section className="mt-4 overflow-hidden rounded-[18px] border border-[#cfd6e5] bg-white shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-215 border-collapse text-left">
            <thead>
              <tr className="border-b border-[#d7dcec] bg-[#f4f6fd] text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-slate-500">
                <th className="px-5 py-3">User</th>
                <th className="px-4 py-3">Provider</th>
                <th className="px-4 py-3">Connection</th>
                <th className="px-4 py-3">Last Sync</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr key={row.email} className="border-b border-[#e3e7f1] last:border-b-0 text-[0.92rem] text-slate-700">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8eefc] text-[0.72rem] font-semibold text-[#b8c5ea] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.8)]">
                        <UserBadgeIcon />
                      </div>
                      <span className="font-medium text-slate-700">{row.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-500">{row.provider}</td>
                  <td className="px-4 py-4 text-slate-500">{row.connection}</td>
                  <td className="px-4 py-4 text-slate-600">{row.lastSync}</td>
                  <td className="px-4 py-4 text-slate-600">{row.joined}</td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-[#eef0f7] px-2.5 py-1 text-[0.66rem] font-semibold text-slate-500">
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-3 text-slate-500">
                      <button onClick={() => alert("This feature will be implemented soon!")} className="cursor-pointer transition-colors hover:text-[#2d7ef7]" aria-label={`Inspect ${row.email}`}>
                        <InspectIcon />
                      </button>
                      <button onClick={() => alert("This feature will be implemented soon!")} className="cursor-pointer transition-colors hover:text-[#c56a00]" aria-label={`Delete ${row.email}`}>
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function SearchIcon() {
  return <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>;
}

function UserBadgeIcon() {
  return <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#c8d5ef]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="3" /><path d="M5 20a7 7 0 0 1 14 0" /></svg>;
}

function InspectIcon() {
  return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>;
}

function TrashIcon() {
  return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" /><path d="M9 7V4h6v3" /></svg>;
}