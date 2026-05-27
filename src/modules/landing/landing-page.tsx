import Image from "next/image";
import Link from "next/link";

const featureCards = [
  {
    title: "Zero Manual Entry",
    text: "Connect your wearable once. Data flows automatically from your device cloud every week — no syncing, no logging, no friction.",
    iconSrc: "/landing/cardImgs/one.png",
  },
  {
    title: "Behavioural Consistency",
    text: "Weekly analysis of steps, active minutes, sleep duration and day-over-day consistency. Non-clinical, fully behavioural.",
    iconSrc: "/landing/cardImgs/two.png",
  },
  {
    title: "Automated Weekly Emails",
    text: "Receive a formatted email every Monday with your consistency summary, target status, and trend analysis. No app required.",
    iconSrc: "/landing/cardImgs/three.png",
  },
  {
    title: "Fitbit & Withings Native",
    text: "Native OAuth integration with cloud-to-cloud sync. Retry logic, rate-limit handling, andtoken auto-refresh built in.",
    iconSrc: "/landing/cardImgs/four.png",
  },
  {
    title: "GDPR Compliant",
    text: "Data minimisation by design. Request full deletion at any time from your account settings. Pseudonymous analytics only.",
    iconSrc: "/landing/cardImgs/five.png",
  },
  {
    title: "Encrypted & Secure",
    text: "OAuth tokens encrypted at rest. Automated refresh. Tokens never exposed in logs. Enterprise-grade security by default.",
    iconSrc: "/landing/cardImgs/six.png",
  },
];

const steps = [
  {
    number: "01",
    title: "Create Your Account",
    text: "Register with your email address. Verify in one click. No credit card, no setup fees — free during MVP access.",
  },
  {
    number: "02",
    title: "Connect Your Wearable",
    text: "Authorise Fitbit or Withings via secure OAuth. Fizzz connects directly to the device cloud — no app install needed.",
  },
  {
    number: "03",
    title: "Receive Weekly Insights",
    text: "Every Monday, your behavioural data is processed and you receive an automated email with your consistency summary.",
  },
];

const principles = [
  {
    title: "Behaviour, not biology",
    text: "We track steps, active days, sleep hours and routines. Never clinical signals like heart rate, SpO₂ or stress scores. Fizzz is a wellness engagement platform, not a medical or diagnostic product.",
  },
  {
    title: "Automated, not intrusive",
    text: "Your wearable syncs automatically. We evaluate your week in the background and only reach out when something worth saying happens. A badge earned, a target hit, a gentle nudge to reconnect.",
  },
  {
    title: "Private by design",
    text: "We collect only what we need to run your account and personalise your experience. Your data is never sold. You can request full deletion of your account and data at any time.",
  },
];

const collected = [
  "Email address",
  "Wearable OAuth token",
  "Dates of syncs",
  "Wearable activity summary",
];

export function LandingPage() {
  return (
    <main className="landing-shell overflow-hidden text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-300/70 bg-[#f3f5fd]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#top" className="flex items-center">
            <Image src="/branding/logo_full.png" alt="Fizzz" width={98} height={40} priority className="h-9 w-auto object-contain" />
          </a>

          <div className="flex items-center gap-2">
            <Link
              href="/about-us"
              className="inline-flex h-9 shrink-0 items-center justify-center rounded-[10px] border border-emerald-200 bg-emerald-50 px-4 text-[0.78rem] font-semibold text-emerald-800 shadow-[0_1px_0_rgba(255,255,255,0.9)]"
            >
              About Us
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex h-9 items-center justify-center rounded-[10px] bg-[#4b82f7] px-4 text-[0.78rem] font-semibold text-white shadow-[0_10px_22px_rgba(75,130,247,0.28)] transition-transform hover:translate-y-[-1px]"
            >
              Get Started
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex h-9 items-center justify-center rounded-[10px] border border-slate-200 bg-white px-4 text-[0.78rem] font-medium text-slate-700 shadow-[0_1px_0_rgba(255,255,255,0.85)] ml-2"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <section id="top" className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.98fr)_minmax(420px,1fr)] lg:gap-12">
          <div>
            <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm">
              Now live — Fitbit & Withings supported
            </div>
            <h1 className="mt-6 text-5xl font-semibold leading-[0.95] tracking-tight text-[#1e2330] sm:text-6xl lg:text-7xl">
              <span className="whitespace-nowrap inline-block">Track Behaviour.</span>
              <span className="block bg-gradient-to-r from-[#1c79ef] via-[#2fa8d6] to-[#4ed58a] bg-clip-text text-transparent">Not Health.</span>
            </h1>
            <p className="mt-6 max-w-xl text-[1.02rem] leading-8 text-slate-600 sm:text-[1.07rem]">
              Fizzz syncs with your wearable and automatically delivers weekly
              behavioural consistency reports — steps, sleep, active days, active
              minutes. No physiological data. No clinical analysis. No dashboards
              to obsess over.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/sign-in"
                className="rounded-xl bg-[#356cf4] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(53,108,244,0.27)] transition-transform hover:translate-y-[-1px]"
              >
                Start Free - It’s Card Included →
              </Link>
              <a
                href="#"
                className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm"
              >
                See How It Works
              </a>
            </div>

            <div className="mt-6 inline-block text-sm text-emerald-700">
              <span className="mr-4">✓ GDPR Compliant</span>
              <span className="mr-4">✓ Encrypted at Rest</span>
              <span className="mr-4">✓ No Physiological Data</span>
              <span>✓ Free during MVP</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute inset-0 -rotate-3 rounded-[42px] bg-gradient-to-br from-[#c6d7ff] via-[#ecf2ff] to-[#d6f5f0] opacity-70 blur-2xl" />
            <div className="relative rounded-[34px] border border-white/70 bg-white/70 p-6 shadow-[0_30px_80px_rgba(48,78,154,0.18)] backdrop-blur-xl">
              <div className="absolute left-8 top-6 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#ff6b6b]" />
                <span className="h-3 w-3 rounded-full bg-[#ffd166]" />
                <span className="h-3 w-3 rounded-full bg-[#6edc7e]" />
              </div>
              <div className="rounded-[28px] border border-slate-200/80 bg-[#f9fbff] p-5">
                <div className="grid gap-4 sm:grid-cols-[180px_minmax(0,1fr)]">
                  <div className="rounded-[22px] bg-white/90 p-3 shadow-sm ring-1 ring-slate-200/70">
                    <div className="h-28 rounded-[18px] bg-[#eff5ff] p-3">
                      <div className="mb-2 flex items-center justify-between text-[10px] font-semibold text-slate-600">
                        <span>Activity</span>
                        <span>•••</span>
                      </div>
                      <div className="mt-2 flex h-16 items-end gap-1.5">
                        {[22, 34, 18, 42, 28, 46].map((h, index) => (
                          <span
                            key={index}
                            className="w-3 rounded-t-full bg-gradient-to-t from-[#39c1ff] to-[#6e84ff]"
                            style={{ height: `${h}px` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center rounded-[26px] bg-gradient-to-br from-white to-[#eef4ff] p-3 shadow-[0_20px_40px_rgba(23,39,103,0.12)]">
                    <Image
                      src="/landing/hero-section-1.png"
                      alt="Fizzz hero illustration"
                      width={560}
                      height={418}
                      priority
                      className="h-auto w-full select-none object-contain"
                    />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <Metric label="Steps" value="7,842" accent="from-emerald-400 to-emerald-500" />
                  <Metric label="Sleep" value="7h 36m" accent="from-blue-400 to-blue-500" />
                  <Metric label="Hydration" value="72%" accent="from-cyan-400 to-sky-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="replica w-full flex justify-center px-5 py-16 sm:py-20 lg:py-24">
        <div id="dashboard" className="w-full max-w-4xl">
          <div className="overflow-hidden rounded-[16px] border border-slate-200/80 bg-white shadow-[0_24px_70px_rgba(29,39,78,0.11)]">
            <div className="flex items-center justify-between border-b border-slate-200/80 bg-[#eef1fb] px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#ff6b6b]" />
                <span className="h-3 w-3 rounded-full bg-[#ffd166]" />
                <span className="h-3 w-3 rounded-full bg-[#6edc7e]" />
              </div>
              <div className="flex flex-1 justify-center px-8">
                <div className="flex h-8 w-full max-w-[250px] items-center justify-center rounded-md border border-slate-300/80 bg-white text-[0.7rem] text-slate-500 shadow-sm">
                  app.fizzz.io/dashboard
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Live
              </div>
            </div>

            <div className="grid gap-0 lg:grid-cols-[185px_minmax(0,1fr)]">
              <aside className="hidden xl:block border-r border-slate-200/80 bg-[#eef1fb] px-4 py-4">
                <div className="flex items-center gap-2 px-1 pb-6">
                  <Image src="/branding/logo_full.png" alt="Fizzz" width={36} height={36} className="h-9 w-9 object-contain" />
                  <span className="text-[0.72rem] font-semibold leading-none text-[#2aa5b1]">Fizzz</span>
                </div>

                <nav className="space-y-1.5 text-sm">
                  <div className="flex items-center gap-2 rounded-lg bg-[#dfe8fb] px-3 py-2 font-medium text-[#356cf4]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#356cf4]" />
                    Overview
                  </div>
                  <div className="px-3 py-2 text-slate-600">Devices</div>
                  <div className="px-3 py-2 text-slate-600">Account</div>
                </nav>
              </aside>

              <section className="bg-white px-6 py-6">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <h3 className="text-[1.45rem] font-semibold tracking-tight text-slate-900">Overview</h3>
                    <p className="mt-1 text-xs text-slate-500">Week of 17 Feb 2025 · Auto-processed</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                    Consistent
                  </span>
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-3">
                  <MockStat title="Steps / day" value="8,420" detail="+12%" />
                  <MockStat title="Active days" value="5 of 7" detail="Target met" />
                  <MockStat title="Sleep duration" value="7.2 hrs" detail="Consistent" />
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-[1.12fr_0.88fr]">
                  <div className="rounded-[14px] border border-slate-200 bg-[#f6f8ff] p-4">
                    <p className="text-sm font-medium text-slate-700">Connected Devices</p>
                    <div className="mt-3 space-y-2 text-sm text-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#356cf4]" />Fitbit</span>
                        <span className="text-[0.72rem] text-emerald-700">Connected</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-slate-400" />Withings</span>
                        <span className="text-[0.72rem] text-slate-500">Not linked</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[14px] border border-slate-200 bg-[#f6f8ff] p-4">
                    <p className="text-sm font-medium text-slate-700">Automation Status</p>
                    <div className="mt-3 space-y-2 text-sm text-slate-600">
                      <div className="flex items-center justify-between gap-4">
                        <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-slate-400" />Weekly Processing</span>
                        <span className="text-[0.72rem] font-medium text-[#356cf4]">Mon 6am UTC</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-slate-400" />Email Delivery</span>
                        <span className="text-[0.72rem] font-medium text-[#356cf4]">Mailgun active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="mt-8 grid gap-4 text-center sm:grid-cols-2 lg:grid-cols-4">
            <Stat number="2" label="Wearable Platforms" content="Fitbit & Withings" />
            <Stat number="7" label="Behavioural Metrics" content="Per weekly sync" />
            <Stat number="100%" label="Automated Pipeline" content="Zero manual steps" />
            <Stat number="GDPR" label="Compliance Standard" content="Data minimisation" />
          </div>
        </div>
      </div>

      <SectionWrap eyebrow="Capabilities" title="Built to run without you" subtitle="Every component designed for serverless scale, GDPR compliance, and zero operational overhead.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featureCards.map((card) => (
            <FeatureCard key={`${card.title}-second`} {...card} compact />
          ))}
        </div>
      </SectionWrap>

      <SectionWrap eyebrow="Process" title="Three steps. Fully automated." subtitle="From signup to weekly insights in under 5 minutes. After that, everything runs itself.">
        <div className="grid gap-4 lg:grid-cols-3">
          {steps.map((step) => (
            <StepCard key={step.number} {...step} />
          ))}
        </div>
      </SectionWrap>

      <section id="get-started" className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(380px,0.95fr)]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#356cf4]">Weekly digest</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">Your inbox is your dashboard.</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Every Monday morning, Fizzz sends a structured consistency report directly to your inbox. No app to open. No login required. Just your data, formatted clearly.
            </p>
            <ul className="mt-8 space-y-4 text-sm leading-6 text-slate-700">
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#356cf4]" />
                <span>Weekly metric summary with trend details</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#356cf4]" />
                <span>Target hit / missed status per metric</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Consistency score for the week</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#356cf4]" />
                <span>Sent every Monday at 6am UTC</span>
              </li>
            </ul>
            <Link href="/sign-in" className="mt-8 inline-flex rounded-xl bg-[#356cf4] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(53,108,244,0.27)]">Get Your First Report →</Link>
          </div>

          <div className="mx-auto w-full max-w-[320px] overflow-hidden rounded-[12px] border border-slate-200 bg-white shadow-[0_20px_45px_rgba(27,38,89,0.18)]">
            <div className="flex h-8 items-center border-b border-slate-200 bg-[#eef0fb] px-3">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b6b]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#ffd166]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#6edc7e]" />
              </div>
              <div className="flex-1 text-center text-[0.68rem] font-medium text-slate-600">
                Weekly Consistency Report — Fizzz
              </div>
              <div className="w-8" />
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div className="flex items-center gap-2">
                  <Image src="/branding/logo_full.png" alt="Fizzz" width={36} height={36} className="h-9 w-9 object-contain" />
                  <div>
                    <p className="text-sm font-semibold leading-none text-slate-900">Fizzz</p>
                    <p className="mt-1 text-xs text-slate-500">reports@fizzz.io</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-emerald-700 ring-1 ring-emerald-200">
                  Delivered
                </span>
              </div>

              <div className="pt-6">
                <h3 className="text-[0.95rem] font-semibold text-slate-900">Your weekly consistency report is ready.</h3>
                <p className="mt-1 text-[0.68rem] text-slate-500">Week of 17 Feb 2025 · Fitbit sync</p>
              </div>

              <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                <MiniCard label="Steps" value="8,420 / day" detail="Target met" detailClassName="text-emerald-600" />
                <MiniCard label="Active days" value="5 of 7" detail="Target met" detailClassName="text-emerald-600" />
                <MiniCard label="Sleep duration" value="7.2 hrs avg" detail="Target met" detailClassName="text-emerald-600" />
                <MiniCard label="Active minutes" value="214 / week" detail="Below target" detailClassName="text-[#356cf4]" />
              </div>

              <div className="mt-2 rounded-[8px] border border-[#d7e1ff] bg-[#eef4ff] px-4 py-4 text-center">
                <p className="text-[0.68rem] text-slate-500">Consistency Score</p>
                <p className="mt-1 text-[2.05rem] font-semibold leading-none text-[#356cf4]">
                  82<span className="text-[1rem] text-emerald-500"> / 100</span>
                </p>
                <p className="mt-1 text-[0.68rem] text-slate-500">Above your 4-week average</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionWrap eyebrow="Transparency" title="Exactly what we collect. Nothing more." subtitle="Strict behaviour-only scope keeps Fizzz outside medical device regulation — protecting you and us.">
        <div className="notmini overflow-hidden rounded-[12px] border border-slate-300 bg-white shadow-sm">
          <div className="grid lg:grid-cols-2">
            <div className="border-b border-slate-200 p-6 lg:border-b-0 lg:border-r lg:border-slate-200 lg:p-8">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#356cf4]">• What we collect</p>
              <ul className="mt-5 space-y-3.5 text-[0.9rem] text-slate-700">
                {[
                  "Daily step count",
                  "Active minutes per day",
                  "Number of active days",
                  "Sleep duration (hours)",
                  "Sleep consistency score",
                  "Activity session count",
                  "Activity session duration",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#356cf4] text-[0.65rem] font-semibold text-[#356cf4]">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#f7f8fe] p-6 lg:p-8">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-slate-400">• Never collected</p>
              <ul className="mt-5 space-y-3.5 text-[0.9rem] text-slate-400">
                {[
                  "Heart Rate",
                  "HRV (Heart Rate Variability)",
                  "SpO2 (Blood Oxygen)",
                  "Stress Score",
                  "Recovery Score",
                  "VO2 Max",
                  "Blood Pressure",
                  "ECG / Cardiac data",
                  "Medication or symptoms",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-slate-300 text-[0.65rem] font-semibold text-slate-300">
                      −
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 max-w-[290px] text-[0.62rem] leading-4 text-slate-400">
                Behavioural scope keeps Fizzz outside medical device regulation — no diagnosis, no clinical analysis, no liability.
              </p>
            </div>
          </div>
        </div>
      </SectionWrap>

      <SectionWrap eyebrow="Transparency & Purpose" title="What we believe" subtitle="We’re building a wellness platform that respects your boundaries and focuses on the habits that matter.">
        <div className="grid gap-4 md:grid-cols-3">
          {principles.map((item) => (
            <div key={item.title} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#245cda]">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </SectionWrap>

      <SectionWrap eyebrow="How it Works" title="How it Works" subtitle="">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["1. Connect", "Sign up with your email and link your Fitbit or Withings account in one click. No app to download. Everything runs in the cloud."],
            ["2. Sync", "We pull your activity data automatically every day, straight from your wearable provider. No manual logging, ever."],
            ["3. Check Dashboard", "Log in anytime to see your connection status, badges earned, and weekly progress. Simple, clean, no noise."],
            ["4. Get recognised", "We send you a personalised email when a badge is earned, a target is hit, or a gentle nudge. That’s the only time you’ll hear from us."],
          ].map(([title, text]) => (
            <div key={title} className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-[#356cf4]">{title}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
        <div className="mini mx-auto w-full max-w-[760px] mt-10">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.03fr)_minmax(0,1fr)] lg:items-start">
            <div className="rounded-[14px] border border-[#d8deef] bg-[#f5f7ff] px-5 py-5 shadow-[0_10px_24px_rgba(107,126,188,0.12)] sm:px-6 sm:py-6">
              <h3 className="text-[1.05rem] font-semibold tracking-tight text-slate-900">What we collect</h3>
              <ul className="mt-5 space-y-3 text-[0.8rem] leading-6 text-slate-600">
                {[
                  "Email address",
                  "Gender (optional)",
                  "Date of birth",
                  "Wearable activity data (steps, active minutes, sleep duration, sleep consistency, activity sessions)",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#356cf4]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 max-w-[320px] text-[0.67rem] leading-5 text-slate-400">
                We do not collect heart rate, SpO₂, stress scores, VO₂ max, blood pressure, ECG data, or any other clinical or physiological information. All data is processed in accordance with GDPR.
              </p>
            </div>

            <div className="pt-1">
              <h3 className="text-[1.03rem] font-semibold tracking-tight text-slate-900">By the numbers</h3>

              <div className="mt-5 space-y-0">
                <div className="flex items-center justify-between border-b border-slate-300/80 py-4 text-[0.78rem] text-slate-700">
                  <span>Behavioural habit metrics</span>
                  <span className="text-[1.45rem] font-semibold leading-none text-[#1459d6]">6</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-300/80 py-4 text-[0.78rem] text-slate-700">
                  <span>Unique badges to earn</span>
                  <span className="text-[1.45rem] font-semibold leading-none text-[#1459d6]">30+</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-300/80 py-4 text-[0.78rem] text-slate-700">
                  <span>Clinical data collected</span>
                  <span className="text-[1.45rem] font-semibold leading-none text-emerald-700">0</span>
                </div>
              </div>

              <div className="mt-6 rounded-[10px] border border-[#cfd9ef] bg-[#edf3ff] px-5 py-4 shadow-[0_10px_18px_rgba(107,126,188,0.1)]">
                <p className="text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-[#0d5bbf]">Contact</p>
                <p className="mt-2 max-w-[280px] text-[0.78rem] leading-6 text-slate-600">
                  Got a question, feedback, or just want to say hello? We’d love to hear from you.
                </p>
                <a href="mailto:contact@fizzzlab.com" className="mt-3 inline-block text-[0.82rem] font-semibold text-[#1459d6]">
                  contact@fizzzlab.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </SectionWrap>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.28em] text-[#356cf4]">Get started</p>
          <h2 className="mt-4 text-[2.05rem] font-semibold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.35rem]">
            Consistency starts with
            <span className="block bg-gradient-to-r from-[#1c79ef] via-[#2fa8d6] to-[#4ed58a] bg-clip-text text-transparent">
              one connection.
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-[640px] text-[0.98rem] leading-7 text-slate-600 sm:text-[1.04rem] sm:leading-8">
            Connect your Fitbit or Withings and receive your first automated consistency report next Monday. Free during MVP, no credit card required.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center rounded-[10px] bg-[#4b82f7] px-6 py-3 text-[0.92rem] font-semibold text-white shadow-[0_10px_22px_rgba(75,130,247,0.32)] transition-transform hover:translate-y-[-1px]"
            >
              Create Free Account →
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center rounded-[10px] border border-slate-200 bg-white px-6 py-3 text-[0.92rem] font-medium text-slate-700 shadow-[0_1px_0_rgba(255,255,255,0.8)]"
            >
              Sign In
            </Link>
          </div>
          <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[0.68rem] text-emerald-500 sm:text-[0.72rem]">
            <span>✓ No credit card</span>
            <span>✓ GDPR compliant</span>
            <span>✓ Cancel anytime</span>
            <span>✓ Data encrypted at rest</span>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-300/70 bg-[#f3f5fd]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 py-4 sm:gap-0 sm:py-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <Image src="/branding/logo_full.png" alt="Fizzz" width={82} height={34} className="h-8 w-auto object-contain" />
            </div>

            <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.72rem] text-slate-700 sm:justify-end sm:gap-x-5 sm:text-[0.78rem] lg:gap-x-6">
              <Link href="/sign-in" className="hover:text-slate-950">
                Sign In
              </Link>
              <Link href="/sign-up" className="hover:text-slate-950">
                Sign Up
              </Link>
              <a href="#" className="hover:text-slate-950">
                Features
              </a>
              <a href="#" className="hover:text-slate-950">
                How It Works
              </a>
            </nav>
          </div>

          <div className="flex flex-col gap-2 border-t border-slate-300/70 py-2 text-[0.62rem] text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-[0.68rem]">
            <p>Behavioural data only. No clinical analysis. Not a medical device.</p>
            <p>© 2025 Fizzz · GDPR compliant · Encrypted at rest</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function SectionWrap({ eyebrow, title, subtitle, children, id }: { eyebrow: string; title: string; subtitle: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#356cf4]">{eyebrow}</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">{title}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">{subtitle}</p>
      </div>
      <div className="mt-10">{children}</div>
    </section>
  );
}

function FeatureCard({ title, text, iconSrc, compact }: { title: string; text: string; iconSrc: string; compact?: boolean }) {
  return (
    <div className={`rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm ${compact ? "min-h-[160px]" : "min-h-[190px]"}`}>
      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-[#edf3ff] shadow-inner">
        <Image src={iconSrc} alt={title} width={20} height={20} className="block h-4 w-4 object-contain" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
    </div>
  );
}

function StepCard({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <div className="relative min-h-[220px] overflow-hidden rounded-[16px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-[6px] border border-slate-300 bg-[#edf3ff] text-xs font-semibold text-[#356cf4] shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
        {number}
      </div>
      <h3 className="mt-8 text-[0.98rem] font-semibold text-slate-900">{title}</h3>
      <p className="mt-3 max-w-[230px] pb-8 text-[0.8rem] leading-5 text-slate-600">{text}</p>
      <p className="absolute bottom-4 left-5 text-[0.68rem] font-semibold leading-none text-[#356cf4]">
        {number === "01" ? "• Takes under 2 minutes" : number === "02" ? "• Fitbit & Withings supported" : "• Delivered every Monday, 6am UTC"}
      </p>
      <span className="pointer-events-none absolute bottom-[-18px] right-3 text-[5.5rem] font-semibold leading-none text-slate-100">
        {number}
      </span>
    </div>
  );
}

function Metric({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`mb-3 h-1.5 rounded-full bg-gradient-to-r ${accent}`} />
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function MockStat({ title, value, detail }: { title: string; value: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-[#f8fbff] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
      <p className="mt-2 text-sm text-emerald-600">{detail}</p>
    </div>
  );
}

function Stat({ number, label, className, content }: { number: string; label: string; className?: string; content: string }) {
  return (
    <div>
      <p className={`text-3xl font-semibold text-[#356cf4] ${className ?? ""}`.trim()}>{number}</p>
      <p className="mt-2 text-md font-bold">{label}</p>
      <p className="mt-2 text-sm text-slate-600">{content}</p>
    </div>
  );
}

function RowStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
      <span>{label}</span>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  );
}

function MiniCard({ label, value, detail, detailClassName = "text-slate-500" }: { label: string; value: string; detail?: string; detailClassName?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-[#356cf4]">{value}</p>
      {detail ? <p className={`mt-1 text-xs font-medium ${detailClassName}`}>{detail}</p> : null}
    </div>
  );
}
