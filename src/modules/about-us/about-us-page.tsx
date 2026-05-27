"use client";

import Image from "next/image";
import Link from "next/link";

import { useThemeMode } from "@/shared/theme/theme-provider";

const principles = [
  {
    title: "Behaviour, not biology",
    text: "We track steps, active days, sleep hours, and routines. Never clinical signals like heart rate, SpO₂, or stress scores.",
    icon: StepIcon,
    tone: "text-[#2563eb] bg-[#e7efff]",
  },
  {
    title: "Automated, not intrusive",
    text: "Your wearable syncs automatically. We evaluate your week in the background and only surface the moments that matter.",
    icon: SyncIcon,
    tone: "text-[#0f9f6e] bg-[#dff8ef]",
  },
  {
    title: "Private by design",
    text: "We collect only what we need to run your account and personalise your experience. Your data is never sold.",
    icon: ShieldIcon,
    tone: "text-[#f59e0b] bg-[#fff1d8]",
  },
];

const footerLinks = ["Privacy Policy", "Terms of Service", "Security", "Contact", "Careers"];

export function AboutUsPage() {
  const { theme } = useThemeMode();
  const dark = theme === "dark";

  return (
    <main id="top" className="about-us-shell overflow-hidden text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="Home" className="flex items-center">
            <Image src="/branding/logo_full.png" alt="Fizzz" width={104} height={42} priority className={`h-9 w-auto object-contain ${dark ? "invert" : ""}`} />
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/sign-up"
              className="inline-flex h-9 items-center justify-center rounded-[10px] bg-[#4b82f7] px-4 text-[0.78rem] font-semibold text-white shadow-[0_10px_22px_rgba(75,130,247,0.28)] transition-transform hover:-translate-y-px"
            >
              Get Started
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex h-9 items-center justify-center rounded-[10px] border border-slate-200 bg-white px-4 text-[0.78rem] font-medium text-slate-700 shadow-[0_1px_0_rgba(255,255,255,0.85)]"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.98fr)_minmax(360px,1fr)] lg:gap-14">
          <div className="max-w-2xl">
            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.28em] text-[#356cf4]">Our philosophy</p>
            <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-[1.06] tracking-tight text-[#1e2330] sm:text-5xl lg:text-7xl">
              Wellness built on consistency, <span className="text-[#356cf4]">not perfection.</span>
            </h1>
            <p className="mt-6 max-w-xl text-[0.96rem] leading-7 text-slate-600 sm:text-[1.02rem]">
              Fizzz is a cloud-based wellness engagement platform that works quietly in the background. We connect to your wearable, track your habits week by week, and recognise your consistency. No data to enter manually. Just showing up, counted.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-[0.8rem] text-slate-500">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-slate-200">
                <Dot tone="bg-[#2dc28d]" /> Automated Syncing
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-slate-200">
                <Dot tone="bg-[#356cf4]" /> Data Privacy
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-95 sm:max-w-117.5 lg:max-w-110">
            <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-[34px] bg-white/80 blur-2xl opacity-70" />
            <div className="relative overflow-hidden rounded-[34px] border border-slate-200 bg-white p-3 shadow-[0_28px_70px_rgba(58,77,102,0.18)]">
              <Image
                src="/about-us/Overlay+Border+Shadow.png"
                alt="Wearable on a table"
                width={640}
                height={850}
                priority
                className={`h-auto w-full rounded-[28px] object-cover ${dark ? "invert" : ""}`}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8 lg:pb-16">
        <div className="mx-auto mb-8 flex w-full max-w-2xl flex-col items-center text-center">
          <h2 className="text-[1.95rem] font-semibold tracking-tight text-[#1e2330] sm:text-[2.2rem]">What we believe</h2>
          <div className="mt-3 h-1 w-10 rounded-full bg-[#356cf4]" />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {principles.map((item) => (
            <article key={item.title} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
              <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${item.tone}`}>
                <item.icon />
              </div>
              <h3 className="mt-4 text-[1.1rem] font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
              {item.title === "Behaviour, not biology" ? (
                <p className="mt-4 text-[0.78rem] italic leading-6 text-slate-400">
                  Fizzz is a wellness engagement platform, not a medical or diagnostic product.
                </p>
              ) : null}
              {item.title === "Automated, not intrusive" ? (
                <div>
                  <p className="mt-4 flex items-center gap-2 text-[0.78rem] italic leading-6 text-slate-400">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[#2dc28d]">
                      <CheckIcon />
                    </span>
                    <span>A badge earned</span>
                  </p>
                  <p className="flex items-center gap-2 text-[0.78rem] italic leading-6 text-slate-400">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[#2dc28d]">
                      <CheckIcon />
                    </span>
                    <span>A target hit</span>
                  </p>
                </div>
              ) : null}
              {item.title === "Private by design" ? (
                <div className="mt-5 rounded-2xl bg-[#f3f5fc] p-4 text-sm leading-6 text-slate-600">
                  You can request full deletion of your account and data at any time.
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="rounded-4xl bg-[#356cf4] px-6 py-10 text-center text-white shadow-[0_24px_70px_rgba(53,108,244,0.28)] sm:px-8 lg:px-10">
          <h2 className="text-[1.65rem] font-semibold tracking-tight sm:text-[2.1rem]">Ready to start showing up?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-[0.88rem] leading-7 text-white/78 sm:text-[0.95rem]">
            Join thousands of high-performers who trust Fizzz to keep their wellness journey consistent without the clutter of clinical data.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/sign-up" className="inline-flex h-11 items-center justify-center rounded-full bg-white px-8 text-[0.92rem] font-semibold text-[#356cf4] shadow-[0_12px_28px_rgba(0,0,0,0.16)]">
              Get Started
            </Link>
            <Link href="#top" className="inline-flex h-11 items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 text-[0.92rem] font-semibold text-white/95">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200/80 bg-white/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 text-sm text-slate-500 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <div className="text-[1.1rem] font-semibold text-[#356cf4]">Fizzz</div>
            <p className="mt-1 text-[0.78rem]">© 2024 Fizzz Health-Tech. All rights reserved.</p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[0.78rem] text-slate-400">
            {footerLinks.map((link) => (
              <a key={link} href="#" className="hover:text-slate-700">
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}

function Dot({ tone }: { tone: string }) {
  return <span className={`h-1.5 w-1.5 rounded-full ${tone}`} />;
}

function StepIcon() {
  return <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18c2-5 3.8-8.5 6-12 1 3.4 2.8 6.8 6 10" /><circle cx="8" cy="7" r="2" /></svg>;
}

function SyncIcon() {
  return <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h5V2" /><path d="M20 17h-5v5" /><path d="M5 17a8 8 0 0 0 12 2" /><path d="M19 7a8 8 0 0 0-12-2" /></svg>;
}

function ShieldIcon() {
  return <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v5c0 5-3.3 8.7-7 10-3.7-1.3-7-5-7-10V6l7-3Z" /></svg>;
}

function CheckIcon() {
  return <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m20 6-11 11-5-5" /></svg>;
}