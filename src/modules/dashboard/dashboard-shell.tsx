"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { ReactNode } from "react";

const navItems = [
  { label: "Overview", href: "/dashboard/overview", iconSrc: "/sidebar/collapsed/overview_icon.png", iconSrcActive: "/sidebar/active/overview_white.png"},
  { label: "Badges", href: "/dashboard/badges", iconSrc: "/sidebar/collapsed/badges_icon.png", iconSrcActive: "/sidebar/active/badges_white.png" },
  { label: "Devices", href: "/dashboard/devices", iconSrc: "/sidebar/collapsed/devices_icon.png", iconSrcActive: "/sidebar/active/devices_white.png" },
  { label: "Settings", href: "/dashboard/settings", iconSrc: "/sidebar/collapsed/setting_icon.png", iconSrcActive: "/sidebar/active/settings_white.png" },
];

const notifySoon = () => alert("This feature will be implemented soon!");


export function DashboardShell({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="dashboard-shell min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-400 gap-4 px-3 py-3 sm:px-4 lg:px-5">
        {/* Desktop sidebar - hidden on small screens */}
        <aside className="dashboard-sidebar sticky top-3 hidden sm:flex h-[calc(100vh-1.5rem)] shrink-0 flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-[#f5f7ff]/95 shadow-[0_8px_30px_rgba(15,23,42,0.08)] backdrop-blur transition-[width] duration-300 ease-out">
          <div className="flex items-center py-4">
            <Link href="/" aria-label="Home" className="logo-wrap flex h-15 w-full items-center justify-center overflow-hidden rounded-xl">
              <LogoMark />
            </Link>
          </div>

          <nav className="flex flex-1 flex-col gap-2 px-2 py-2 lg:px-3 ">
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
                D
              </div>
              <div className="profile-block-item-2 sidebar-fade min-w-0 overflow-hidden transition-opacity duration-200">
                <p className="truncate text-sm font-medium text-slate-900">DilanKasupun</p>
                <p className="truncate text-xs text-slate-500">dilankasupun009@gmail.com</p>
              </div>
            </div>
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
            <Link href="/" aria-label="Home" className="flex items-center">
              <Image src="/branding/logo_collapsed.png" alt="Fizzz" width={92} height={32} className="h-8 w-auto object-contain" />
            </Link>
          </div>

          {mobileOpen ? (
            <div className="fixed inset-0 z-40 sm:hidden">
              <button aria-label="Close menu" className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
              <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
                  <Link href="/" aria-label="Home" onClick={() => setMobileOpen(false)}>
                    <Image src="/branding/logo_full.png" alt="Fizzz" width={120} height={40} className="h-8 w-auto object-contain" />
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
      <img src="/branding/logo_full.png" alt="Fizzz" className="logo-full max-h-full max-w-full object-contain block" />
      <img src="/branding/logo_collapsed.png" alt="F" className="logo-collapsed max-h-[90%] max-w-full object-contain block" />
    </div>
  );
}

function LogoutIcon() {
  return <img src="/sidebar/logout_icon.png" alt="Logout-Icon"  />;
}

function BurgerIcon() {
  return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></svg>;
}

function CloseIcon() {
  return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12" /><path d="M18 6 6 18" /></svg>;
}
