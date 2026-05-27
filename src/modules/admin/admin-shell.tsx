"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { ReactNode } from "react";
import { useThemeMode } from "@/shared/theme/theme-provider";

const navItems = [
  { label: "Overview", href: "/admin/overview", iconSrc: "/admin_sidebar/collapsed/overview_black.png", iconSrcActive: "/admin_sidebar/active/overview_white.png" },
  { label: "Users", href: "/admin/users", iconSrc: "/admin_sidebar/collapsed/users_black.png", iconSrcActive: "/admin_sidebar/active/users_white.png" },
  { label: "Sync Health", href: "/admin/sync-health", iconSrc: "/admin_sidebar/collapsed/health_black.png", iconSrcActive: "/admin_sidebar/active/health_white.png" },
  { label: "Analytics", href: "/admin/analytics", iconSrc: "/admin_sidebar/collapsed/analytics_black.png", iconSrcActive: "/admin_sidebar/active/analytics_white.png" },
  { label: "Badges", href: "/admin/badges", iconSrc: "/admin_sidebar/collapsed/badges_black.png", iconSrcActive: "/admin_sidebar/active/badges_white.png" },
];

const notifySoon = () => alert("This feature will be implemented soon!");

export function AdminShell({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useThemeMode();

  return (
    <div className="admin-shell min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-400 gap-4 px-3 py-3 sm:px-4 lg:px-5">
        {/* Desktop sidebar - hidden on small screens */}
        <aside className="admin-sidebar sticky top-3 hidden sm:flex h-[calc(100vh-1.5rem)] shrink-0 flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-[#f5f7ff]/95 shadow-[0_8px_30px_rgba(15,23,42,0.08)] backdrop-blur transition-[width] duration-300 ease-out">
          <div className="flex items-center py-4">
            <Link href="/admin/overview" aria-label="Admin home" className="logo-wrap flex h-15 w-full items-center justify-center overflow-hidden rounded-xl">
              <LogoMark />
            </Link>
          </div>

          <nav className="flex flex-1 flex-col gap-2 px-2 py-2 lg:px-3">
            {navItems.map(({ label, href, iconSrc, iconSrcActive }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);

              return (
                <Link
                  key={label}
                  href={href}
                  className={`small-img flex h-11 items-center gap-3 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? "bg-[#095fce] text-white shadow-[0_10px_24px_rgba(9,95,206,0.22)]"
                      : "text-slate-500 hover:bg-white hover:text-slate-900"
                  }`}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-lg">
                    <Image src={active ? iconSrcActive : iconSrc} alt={label} width={16} height={16} className="block h-4 w-4 object-contain" />
                  </span>
                  <span className="sidebar-fade min-w-0 overflow-hidden whitespace-nowrap transition-opacity duration-200">
                    {label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto p-3 lg:p-4">
            <div className="profile-block flex items-center gap-3 rounded-2xl p-3">
              <div className="profile-block-item-1 flex h-10 w-10 items-center justify-center rounded-full bg-[#2563eb] text-sm font-semibold text-white">
                A
              </div>
              <div className="profile-block-item-2 sidebar-fade min-w-0 overflow-hidden transition-opacity duration-200">
                <p className="truncate text-sm font-medium text-slate-900">Admin</p>
                <p className="truncate text-xs text-slate-500">admin@fizzz.io</p>
              </div>
            </div>
            <button onClick={toggleTheme} className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition-colors hover:bg-slate-50 cursor-pointer" aria-pressed={theme === "dark"}>
              <ThemeIcon dark={theme === "dark"} />
              <span className="sidebar-fade min-w-0 overflow-hidden whitespace-nowrap transition-opacity duration-200">{theme === "dark" ? "Dark mode" : "Light mode"}</span>
            </button>
            <button onClick={notifySoon} className="logout-btn mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#b00010] px-3 text-sm font-medium text-white shadow-[0_10px_24px_rgba(176,0,16,0.18)] transition-transform hover:scale-[1.01] cursor-pointer">
              <LogoutIcon />
              <span className="sidebar-fade min-w-0 overflow-hidden whitespace-nowrap transition-opacity duration-200">
                Logout
              </span>
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 py-1.5">
          <div className="flex items-center gap-3 px-3 py-2 sm:hidden">
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm"
            >
              <BurgerIcon />
            </button>
            <Link href="/admin/overview" aria-label="Admin home" className="flex items-center">
              <Image src="/branding/logo_collapsed.png" alt="Admin" width={92} height={32} className="h-8 w-auto object-contain" />
            </Link>
          </div>

          {mobileOpen ? (
            <div className="fixed inset-0 z-40 sm:hidden">
              <button aria-label="Close menu" className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
              <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
                  <Link href="/admin/overview" aria-label="Admin home" onClick={() => setMobileOpen(false)}>
                    <Image src="/branding/logo_full.png" alt="Fizzz Admin" width={120} height={40} className="h-8 w-auto object-contain" />
                  </Link>
                  <button type="button" aria-label="Close menu" onClick={() => setMobileOpen(false)} className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600">
                    <CloseIcon />
                  </button>
                </div>
                <nav className="px-3 py-3">
                  {navItems.map(({ label, href, iconSrc, iconSrcActive }) => {
                    const active = pathname === href || pathname.startsWith(`${href}/`);

                    return (
                      <Link
                        key={label}
                        href={href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${active ? "bg-[#095fce] text-white" : "text-slate-700 hover:bg-slate-100"}`}
                      >
                        <span className="flex h-5 w-5 items-center justify-center">
                          <Image src={active ? iconSrcActive : iconSrc} alt={label} width={16} height={16} className="block h-4 w-4 object-contain" />
                        </span>
                        <span>{label}</span>
                      </Link>
                    );
                  })}
                </nav>
                <div className="border-t border-slate-200 p-4">
                  <button onClick={toggleTheme} className="mb-3 flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 cursor-pointer" aria-pressed={theme === "dark"}>
                    <ThemeIcon dark={theme === "dark"} />
                    {theme === "dark" ? "Dark mode" : "Light mode"}
                  </button>
                  <button onClick={notifySoon} className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#b00010] px-3 text-sm font-medium text-white shadow-[0_10px_24px_rgba(176,0,16,0.18)]">
                    <LogoutIcon />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {children}
        </main>
      </div>
    </div>
  );
}

function LogoMark() {
  return (
    <div className="flex h-full w-[80%] items-center justify-center">
      <img src="/branding/logo_full.png" alt="Fizzz" className="logo-full block max-h-full max-w-full object-contain" />
      <img src="/branding/logo_collapsed.png" alt="F" className="logo-collapsed block max-h-[90%] max-w-full object-contain" />
    </div>
  );
}

function LogoutIcon() {
  return <img src="/sidebar/logout_icon.png" alt="Logout" />;
}

function BurgerIcon() {
  return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></svg>;
}

function CloseIcon() {
  return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12" /><path d="M18 6 6 18" /></svg>;
}

function ThemeIcon({ dark }: { dark: boolean }) {
  return dark ? (
    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a7 7 0 1 0 9 9A9 9 0 1 1 12 3Z" /></svg>
  ) : (
    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>
  );
}

function GridIcon({ active }: { active: boolean }) {
  return <svg viewBox="0 0 24 24" className={`h-4.5 w-4.5 ${active ? "text-white" : "text-[#2563eb]"}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h7v7H4z" /><path d="M13 4h7v7h-7z" /><path d="M4 13h7v7H4z" /><path d="M13 13h7v7h-7z" /></svg>;
}

function UsersIcon({ active }: { active: boolean }) {
  return <svg viewBox="0 0 24 24" className={`h-4.5 w-4.5 ${active ? "text-white" : "text-slate-500"}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 11a3 3 0 1 0 0-6" /><path d="M16 20a5 5 0 0 0-4-4.9" /></svg>;
}

function SyncIcon({ active }: { active: boolean }) {
  return <svg viewBox="0 0 24 24" className={`h-4.5 w-4.5 ${active ? "text-white" : "text-slate-500"}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h5V2" /><path d="M20 17h-5v5" /><path d="M5 17a8 8 0 0 0 12 2" /><path d="M19 7a8 8 0 0 0-12-2" /></svg>;
}

function ChartIcon({ active }: { active: boolean }) {
  return <svg viewBox="0 0 24 24" className={`h-4.5 w-4.5 ${active ? "text-white" : "text-slate-500"}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19h16" /><path d="M6 17V9" /><path d="M12 17V5" /><path d="M18 17v-7" /></svg>;
}

function BadgeIcon({ active }: { active: boolean }) {
  return <svg viewBox="0 0 24 24" className={`h-4.5 w-4.5 ${active ? "text-white" : "text-slate-500"}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l3 5 6 1-4.5 4.1 1.1 6L12 16.8 6.4 19.1l1.1-6L3 9l6-1 3-5Z" /></svg>;
}