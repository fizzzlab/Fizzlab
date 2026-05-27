"use client";
import { useState } from "react";
import { useThemeMode } from "@/shared/theme/theme-provider";

const notificationItems = [
  {
    title: "Sync confirmations",
    description: "Get notified when weekly data sync completes.",
    icon: ConfirmIcon,
    color: "bg-[#dcfce7] text-[#15803d]",
    toggle: "bg-[#15803d]",
  },
  {
    title: "Consistency nudges",
    description: "Receive encouragement when you hit targets.",
    icon: FlameIcon,
    color: "bg-[#f6e6d2] text-[#b76a08]",
    toggle: "bg-[#b76a08]",
  },
  {
    title: "Connection alerts",
    description: "Get alerted when a wearable token expires.",
    icon: ShieldIcon,
    color: "bg-[#dce8ff] text-[#2563eb]",
    toggle: "bg-[#2563eb]",
  },
];

export function DashboardSettings() {
  const { theme, toggleTheme } = useThemeMode();
  const [toggles, setToggles] = useState<Record<string, boolean>>(() =>
    notificationItems.reduce((acc, item) => {
      acc[item.title] = false;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const handleToggle = (key: string) => {
    setToggles((s) => ({ ...s, [key]: !s[key] }));
  };

  const notifySoon = () => alert("This feature will be implemented soon!");

  return (
    <div className="space-y-6 pb-6">
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] bg-[linear-gradient(135deg,#f8faff_0%,#eef3ff_100%)] px-6 py-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] ring-1 ring-slate-200/70">
        <div>
          <h1 className="text-[2.1rem] font-semibold tracking-tight text-[#1f2430]">Settings</h1>
          <p className="mt-1 text-[0.98rem] text-slate-600">Manage your account, security, and notification preferences.</p>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 cursor-pointer"
          aria-pressed={theme === "dark"}
        >
          <ThemeIcon dark={theme === "dark"} />
          {theme === "dark" ? "Dark mode" : "Light mode"}
        </button>
      </header>

      <section className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
          <div className="flex items-center gap-2 text-[1.08rem] font-semibold text-slate-900">
            <UserIcon />
            Profile
          </div>

          <div className="mt-5 flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0b5fc7] text-lg font-semibold text-white shadow-sm">
              F
            </div>
            <div className="pt-0.5">
              <p className="text-sm font-semibold text-slate-900">fizzlab@gmail.com</p>
              <p className="text-xs text-slate-500">Member since 31 Mar 2026</p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[10px] bg-[#f1f3ff] px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">Email</p>
              <p className="mt-2 text-sm text-slate-800">fizzlab@gmail.com</p>
            </div>
            <div className="rounded-[10px] bg-[#f1f3ff] px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">Joined</p>
              <p className="mt-2 text-sm text-slate-800">31 Mar 2026</p>
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
          <div className="flex items-center gap-2 text-[1.08rem] font-semibold text-slate-900">
            <KeyIcon />
            Change password
          </div>

          <div className="mt-5 space-y-4">
            <Field label="Current" placeholder="Current password" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="New" placeholder="Min. 8 chars" />
              <Field label="Confirm" placeholder="Repeat" />
            </div>
            <div className="flex justify-end">
              <button
                onClick={notifySoon}
                className="w-full sm:w-auto rounded-md bg-[#0b5fc7] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(11,95,199,0.24)] transition-colors duration-150 hover:brightness-95 cursor-pointer"
              >
                Update password
              </button>
            </div>
          </div>
        </article>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[1.08rem] font-semibold text-slate-900">
            <BellIcon />
            Email notifications
          </div>
          <button
            onClick={notifySoon}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-colors duration-150 hover:bg-slate-50 cursor-pointer"
          >
            Save changes
          </button>
        </div>

        <div className="mt-5 grid gap-0 rounded-xl border border-slate-200 grid-cols-1 md:grid-cols-3">
          {notificationItems.map(({ title, description, icon: Icon, color, toggle }, index) => (
            <div key={title} className={`px-4 py-4 ${index > 0 ? "border-t border-slate-200 md:border-l md:border-t-0" : ""}`}>
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${color}`}>
                <Icon />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-slate-900">{title}</h3>
              <p className="mt-1 max-w-[17ch] text-sm leading-6 text-slate-600">{description}</p>
              <div className="mt-4">
                <button
                  aria-pressed={!!toggles[title]}
                  onClick={() => handleToggle(title)}
                  className={`h-5 w-10 rounded-full p-0.5 transition-colors duration-150 ${
                    toggles[title] ? toggle : "bg-slate-200"
                  } cursor-pointer`}
                >
                  <div
                    className={`h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform duration-150 ${
                      toggles[title] ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
          <div className="flex items-center gap-2 text-[1.08rem] font-semibold text-slate-900">
            <LockIcon />
            Privacy & data rights
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
            Only behavioural metrics are processed in pseudonymous form. Under GDPR you can request access, rectification, or deletion of all personal data at any time. No physiological data is ever collected.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Pill title="Data scope" value="Behavioural only" />
            <Pill title="Storage" value="AES-256 encrypted" />
            <Pill title="Compliance" value="GDPR ready" />
          </div>

          <button
            onClick={notifySoon}
            className="mt-5 w-full sm:w-auto rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors duration-150 hover:bg-slate-50 cursor-pointer"
          >
            Export my data
          </button>
        </article>

        <article className="rounded-xl border border-[#f4c7c7] bg-[#fffafa] px-5 py-5 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
          <div className="flex items-center gap-2 text-[1.08rem] font-semibold text-[#e11d1d]">
            <TrashIcon />
            Danger zone
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Permanently delete your account, all connections, sync history, and personal data. This cannot be undone.
          </p>
          <button
            onClick={notifySoon}
            className="mt-6 w-full sm:w-auto rounded-lg border border-[#f2b3b3] bg-[#fff1f1] px-4 py-2 text-sm font-semibold text-[#d93030] shadow-sm transition-colors duration-150 hover:brightness-95 cursor-pointer"
          >
            Delete my account
          </button>
        </article>
      </section>
    </div>
  );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</span>
      <input
        type="password"
        placeholder={placeholder}
        className="h-10 w-full rounded-md border border-[#d5d9eb] bg-[#f4f5ff] px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
      />
    </label>
  );
}

function Pill({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg bg-[#f2f3ff] px-4 py-3 text-center">
      <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">{title}</p>
      <p className="mt-2 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function UserIcon() {
  return <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="3" /><path d="M5 20a7 7 0 0 1 14 0" /></svg>;
}

function KeyIcon() {
  return <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="12" r="3" /><path d="M11 12h10" /><path d="M18 12v2" /><path d="M15 12v2" /></svg>;
}

function BellIcon() {
  return <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 17H5a1 1 0 0 1-.8-1.6l1.1-1.5A4 4 0 0 0 6 12V9a6 6 0 0 1 12 0v3a4 4 0 0 0 .7 2.3l1.1 1.5A1 1 0 0 1 19 17h-4" /><path d="M10 20a2 2 0 0 0 4 0" /></svg>;
}

function LockIcon() {
  return <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>;
}

function TrashIcon() {
  return <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" /><path d="M9 7V4h6v3" /></svg>;
}

function ConfirmIcon() {
  return <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="m9 12 2 2 4-5" /></svg>;
}

function FlameIcon() {
  return <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3c1.8 3 .8 4.8-.7 6.6C9.8 11.4 9 13 9 15a3 3 0 0 0 6 0c0-1.2-.3-2.3-1-3.2 2.3 1 4 3.3 4 6.2a6 6 0 0 1-12 0C6 12.8 8.7 9.2 12 3Z" /></svg>;
}

function ShieldIcon() {
  return <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v5c0 5-3.3 8.7-7 10-3.7-1.3-7-5-7-10V6l7-3Z" /></svg>;
}

function ThemeIcon({ dark }: { dark: boolean }) {
  return dark ? (
    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a7 7 0 1 0 9 9A9 9 0 1 1 12 3Z" /></svg>
  ) : (
    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>
  );
}