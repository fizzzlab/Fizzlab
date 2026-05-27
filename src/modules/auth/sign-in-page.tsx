"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#eef3ff] text-slate-900 lg:grid lg:grid-cols-2">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(75,130,247,0.18),transparent_0_26%),radial-gradient(circle_at_82%_16%,rgba(33,214,161,0.16),transparent_0_18%),linear-gradient(180deg,#eef3ff_0%,#e9effd_100%)]" />
      <div className="absolute inset-0 opacity-50 bg-[linear-gradient(rgba(255,255,255,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.3)_1px,transparent_1px)] bg-size-[80px_80px]" />

      <section className="relative hidden min-h-[42vh] overflow-hidden bg-[#071023] px-8 py-10 text-white/86 sm:px-12 lg:flex lg:min-h-screen lg:px-16 lg:py-14 lg:opacity-90">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_24%,rgba(26,116,255,0.32),transparent_0_22%),radial-gradient(circle_at_78%_78%,rgba(33,214,161,0.22),transparent_0_17%),linear-gradient(135deg,#07101d_0%,#08162b_46%,#040915_100%)]" />
        <div className="absolute inset-0 opacity-70 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[72px_72px]" />
        <div className="relative flex min-h-[42vh] w-full flex-col justify-between lg:min-h-[calc(100vh-7rem)]">
          <div className="mx-auto flex w-full max-w-130 flex-1 flex-col justify-center">
            <Image src="/branding/logo_full.png" alt="Fizzz" width={360} height={160} priority className="h-auto w-57.5 sm:w-67.5 lg:w-75" />
            <h1 className="mt-10 whitespace-nowrap text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-[3rem]">
              Welcome back.
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-white/58 sm:text-[1.05rem] sm:leading-8">
              Your health intelligence awaits. Sign in to access your personalized insights and continue your vitality journey.
            </p>
          </div>

          <p className="mx-auto mt-10 w-full max-w-130 text-[0.65rem] font-medium uppercase tracking-[0.28em] text-white/28 sm:text-[0.7rem]">
            Encrypted • GDPR compliant • Behavioural data only
          </p>
        </div>
      </section>

      <section className="relative z-10 flex min-h-[58vh] items-center justify-center px-6 py-10 sm:px-8 lg:min-h-screen lg:px-10">
        <div className="relative w-full max-w-105 rounded-[28px] border border-white/70 bg-white/75 p-8 shadow-[0_24px_70px_rgba(15,23,42,0.18)] backdrop-blur-2xl ring-1 ring-white/60">
          <div className="absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-[#356cf4]/40 to-transparent" />
          <div className="text-center">
            <h2 className="text-[2.15rem] font-semibold tracking-tight text-slate-900">Sign In</h2>
            <p className="mt-1.5 text-sm leading-6 text-slate-500">Enter your credentials to access your account.</p>
          </div>

          <form className="mt-9 space-y-6">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@company.com"
                className="h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-[#356cf4]"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between gap-4">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <Link href="/" className="text-xs font-semibold text-[#356cf4] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="flex h-12 items-center rounded-lg border border-slate-300 bg-white px-4 transition-colors focus-within:border-[#356cf4]">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="h-full w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="ml-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#0b60cf] text-sm font-semibold text-white shadow-[0_10px_24px_rgba(11,96,207,0.26)] transition-transform hover:-translate-y-px"
            >
              Sign in
              <ArrowRightIcon />
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-600">
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" className="font-semibold text-[#356cf4] hover:underline">
              Create one free
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 2.4-1.2" />
      <path d="M6.2 6.4C3.4 8.2 2 12 2 12s3.5 6 10 6c1.4 0 2.6-.2 3.7-.5" />
      <path d="M9.9 4.3A10.8 10.8 0 0 1 12 4c6.5 0 10 6 10 6s-1.1 1.9-3.2 3.8" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h13" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
