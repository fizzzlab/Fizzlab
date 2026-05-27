"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const genderOptions = ["Select", "Female", "Male", "Other"];

export function SignUpPage() {
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#eef3ff] text-slate-900 lg:grid lg:grid-cols-2">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(65,130,244,0.17),transparent_0_24%),radial-gradient(circle_at_82%_18%,rgba(33,214,161,0.16),transparent_0_18%),linear-gradient(180deg,#eef3ff_0%,#e9effd_100%)]" />
      <div className="absolute inset-0 opacity-50 bg-[linear-gradient(rgba(255,255,255,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.3)_1px,transparent_1px)] bg-size-[80px_80px]" />

      <section className="relative z-10 flex min-h-[54vh] items-center justify-center px-6 py-10 sm:px-8 lg:min-h-screen lg:px-10">
        <div className="relative w-full max-w-105 rounded-[28px] border border-white/70 bg-white/75 px-7 py-8 shadow-[0_24px_70px_rgba(15,23,42,0.18)] backdrop-blur-2xl ring-1 ring-white/60 sm:px-8">
          <div className="absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-[#4182f4]/40 to-transparent" />
          <div className="text-center">
            <h1 className="text-[2rem] font-semibold tracking-tight text-slate-900 sm:text-[2.15rem]">Get started free</h1>
            <p className="mt-1.5 text-sm leading-6 text-slate-500">No credit/debit cards required</p>
          </div>

          <form className="mt-9 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-[#4182f4]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="gender" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Gender
                </label>
                <div className="relative">
                  <select
                    id="gender"
                    name="gender"
                    defaultValue="Select"
                    className="h-11 w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 pr-10 text-sm text-slate-700 outline-none transition-colors focus:border-[#4182f4]"
                  >
                    {genderOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon />
                </div>
              </div>

              <div>
                <label htmlFor="dob" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Date of Birth
                </label>
                <input
                  id="dob"
                  name="dob"
                  type="text"
                  placeholder="mm/dd/yyyy"
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-[#4182f4]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-slate-700">
                Password
              </label>
              <div className="flex h-11 items-center rounded-lg border border-slate-300 bg-white px-4 transition-colors focus-within:border-[#4182f4]">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "password" : "text"}
                  placeholder="••••••••"
                  className="h-full w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Show password" : "Hide password"}
                  className="ml-3 inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-semibold text-slate-700">
                Confirm Password
              </label>
              <div className="flex h-11 items-center rounded-lg border border-slate-300 bg-white px-4 transition-colors focus-within:border-[#4182f4]">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "password" : "text"}
                  placeholder="••••••••"
                  className="h-full w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((current) => !current)}
                  aria-label={showConfirmPassword ? "Show confirm password" : "Hide confirm password"}
                  className="ml-3 inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                >
                  {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-2 pt-1 text-[0.78rem] leading-5 text-slate-600">
              <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#4182f4] focus:ring-[#4182f4]" />
              <span>
                I agree to the{' '}
                <a href="#" className="text-[#4182f4] hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-[#4182f4] hover:underline">
                  Privacy Policy
                </a>
              </span>
            </label>

            <button
              type="submit"
              className="mt-2 flex h-11 w-full items-center justify-center rounded-lg bg-[#4182f4] text-sm font-semibold text-white shadow-[0_10px_24px_rgba(65,130,244,0.24)] transition-transform hover:-translate-y-px"
            >
              Create Account
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link href="/sign-in" className="font-semibold text-[#4182f4] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </section>

      <section className="relative hidden min-h-[46vh] overflow-hidden bg-[#070a14] px-8 py-10 text-white/86 sm:px-12 lg:flex lg:min-h-screen lg:px-16 lg:py-14 lg:opacity-90">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_30%,rgba(18,112,255,0.22),transparent_0_18%),radial-gradient(circle_at_72%_58%,rgba(33,214,161,0.18),transparent_0_16%),linear-gradient(135deg,#04070f_0%,#08162b_46%,#05070f_100%)]" />
        <div className="absolute inset-0 opacity-70 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[72px_72px]" />

        <div className="relative mx-auto flex w-full max-w-130 flex-col items-center justify-center text-center">
          <Image src="/branding/logo_full.png" alt="Fizzz" width={360} height={160} priority className="h-auto w-57.5 sm:w-67.5 lg:w-75" />
          <h2 className="mt-10 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-[3.35rem]">Build better habits.</h2>
          <p className="mt-6 max-w-md text-base leading-7 text-white/58 sm:text-[1.05rem] sm:leading-8 text-right">
            Join Fizzz and start tracking your weekly activity, sleep, and consistency — without clinical data or complicated dashboards.
          </p>

          <p className="absolute bottom-0 left-1/2 w-full -translate-x-1/2 text-[0.65rem] font-medium uppercase tracking-[0.28em] text-white/28 sm:text-[0.7rem]">
            Encrypted • GDPR compliant • Behavioural data only
          </p>
        </div>
      </section>
    </main>
  );
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
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
