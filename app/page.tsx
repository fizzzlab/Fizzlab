import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import {
  Activity, Moon, Footprints, Timer, Zap, ShieldCheck,
  Mail, RefreshCw, Lock, BarChart2, ArrowRight, Check,
} from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Zero Manual Entry',
    description: 'Connect your wearable once. Data flows automatically from your device cloud every week — no syncing, no logging, no friction.',
    accent: '#EB721B',
    accentBg: 'rgba(235,114,27,0.08)',
    accentBorder: 'rgba(235,114,27,0.18)',
  },
  {
    icon: BarChart2,
    title: 'Behavioural Consistency',
    description: 'Weekly analysis of steps, active minutes, sleep duration and day-over-day consistency. Non-clinical, fully behavioural.',
    accent: '#C89664',
    accentBg: 'rgba(200,150,100,0.08)',
    accentBorder: 'rgba(200,150,100,0.18)',
  },
  {
    icon: Mail,
    title: 'Automated Weekly Emails',
    description: 'Receive a formatted email every Monday with your consistency summary, target status, and trend analysis. No app required.',
    accent: '#256B97',
    accentBg: 'rgba(37,107,151,0.08)',
    accentBorder: 'rgba(37,107,151,0.18)',
  },
  {
    icon: RefreshCw,
    title: 'Fitbit & Withings Native',
    description: 'Native OAuth integration with cloud-to-cloud sync. Retry logic, rate-limit handling, and token auto-refresh built in.',
    accent: '#EB721B',
    accentBg: 'rgba(235,114,27,0.08)',
    accentBorder: 'rgba(235,114,27,0.18)',
  },
  {
    icon: ShieldCheck,
    title: 'GDPR Compliant',
    description: 'Data minimisation by design. Request full deletion at any time from your account settings. Pseudonymous analytics only.',
    accent: '#256B97',
    accentBg: 'rgba(37,107,151,0.08)',
    accentBorder: 'rgba(37,107,151,0.18)',
  },
  {
    icon: Lock,
    title: 'Encrypted & Secure',
    description: 'OAuth tokens encrypted at rest. Automated refresh. Tokens never exposed in logs. Enterprise-grade security by default.',
    accent: '#C89664',
    accentBg: 'rgba(200,150,100,0.08)',
    accentBorder: 'rgba(200,150,100,0.18)',
  },
];

const steps = [
  {
    step: '01',
    title: 'Create Your Account',
    description: 'Register with your email address. Verify in one click. No credit card, no setup fees — free during MVP access.',
    detail: 'Takes under 2 minutes',
  },
  {
    step: '02',
    title: 'Connect Your Wearable',
    description: 'Authorise Fitbit or Withings via secure OAuth. PulseTrack connects directly to the device cloud — no app install needed.',
    detail: 'Fitbit & Withings supported',
  },
  {
    step: '03',
    title: 'Receive Weekly Insights',
    description: 'Every Monday, your behavioural data is processed and you receive an automated email with your consistency summary.',
    detail: 'Delivered every Monday, 6am UTC',
  },
];

const metrics = [
  { icon: Footprints, label: 'Steps / Day',      value: '8,420',  delta: '+12%',  color: '#EB721B' },
  { icon: Activity,   label: 'Active Days',       value: '5 of 7', delta: 'Target met', color: '#C89664' },
  { icon: Moon,       label: 'Sleep Duration',    value: '7.2 hrs',delta: 'Consistent', color: '#256B97' },
  { icon: Timer,      label: 'Active Minutes',    value: '214 min', delta: 'Above threshold', color: '#EB721B' },
];

export default function LandingPage() {
  return (
    <div className="page-bg">
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-0 px-4">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-[0.07] blur-3xl" style={{ background: 'radial-gradient(ellipse, #EB721B, transparent)' }} />
          <div className="absolute top-40 right-10 w-72 h-72 rounded-full opacity-[0.05] blur-3xl bg-[#256B97]" />
          <div className="absolute top-60 left-10 w-56 h-56 rounded-full opacity-[0.04] blur-3xl bg-[#C89664]" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border" style={{ background: 'rgba(235,114,27,0.06)', borderColor: 'rgba(235,114,27,0.2)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-[#EB721B]" style={{ animation: 'pulse 2s infinite' }} />
            <span className="text-xs font-medium tracking-wide" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#C89664' }}>
              Now live — Fitbit &amp; Withings supported
            </span>
          </div>

          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] mb-6"
            style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.035em', color: '#f1f5f9' }}
          >
            Track Behaviour.
            <br />
            <span style={{ background: 'linear-gradient(135deg, #EB721B 0%, #C89664 60%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Not Health.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-3">
            PulseTrack syncs with your wearable and automatically delivers weekly behavioural
            consistency reports — steps, sleep, active days, active minutes.
          </p>
          <p className="text-sm text-slate-600 mb-10">
            No physiological data. No clinical analysis. No dashboards to obsess over.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
            <Link href="/auth/signup" className="btn-primary text-base px-9 py-3.5 gap-2">
              Start Free — No Card Needed
              <ArrowRight size={16} />
            </Link>
            <Link href="#how-it-works" className="btn-secondary text-base px-9 py-3.5">
              See How It Works
            </Link>
          </div>

          {/* Trust row */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-16">
            {[
              'GDPR Compliant',
              'Encrypted at Rest',
              'No Physiological Data',
              'Free During MVP',
            ].map((t) => (
              <div key={t} className="flex items-center gap-1.5">
                <Check size={12} style={{ color: '#C89664' }} />
                <span className="text-xs text-slate-500" style={{ fontFamily: "'Inter', sans-serif" }}>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── App preview mockup ── */}
        <div className="relative max-w-5xl mx-auto">
          {/* Glow under card */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20 blur-2xl opacity-20 rounded-full" style={{ background: 'linear-gradient(90deg, #EB721B, #C89664)' }} />

          {/* Main dashboard preview */}
          <div className="rounded-2xl overflow-hidden border" style={{ background: 'linear-gradient(145deg, rgba(2,28,59,0.95), rgba(3,41,78,0.9))', borderColor: 'rgba(200,150,100,0.15)', boxShadow: '0 32px 80px rgba(1,14,34,0.8), 0 0 0 1px rgba(200,150,100,0.06)' }}>
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-5 py-3.5 border-b" style={{ borderColor: 'rgba(200,150,100,0.08)', background: 'rgba(1,14,34,0.4)' }}>
              <div className="w-3 h-3 rounded-full bg-red-500/40 border border-red-500/20" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/40 border border-yellow-500/20" />
              <div className="w-3 h-3 rounded-full bg-green-500/40 border border-green-500/20" />
              <div className="flex-1 mx-4">
                <div className="mx-auto max-w-xs h-5 rounded-md flex items-center justify-center border" style={{ background: 'rgba(1,14,34,0.5)', borderColor: 'rgba(35,62,92,0.5)' }}>
                  <span className="text-[10px] text-slate-600" style={{ fontFamily: "'Inter', sans-serif" }}>app.pulsetrack.io/dashboard</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] text-emerald-400" style={{ fontFamily: "'Inter', sans-serif" }}>Live</span>
              </div>
            </div>

            {/* Dashboard content */}
            <div className="flex">
              {/* Mini sidebar */}
              <div className="hidden sm:flex flex-col w-44 p-4 border-r gap-1" style={{ borderColor: 'rgba(200,150,100,0.06)', background: 'rgba(1,14,34,0.3)' }}>
                <div className="flex items-center gap-2 px-2 py-2 mb-3">
                  <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #EB721B, #C89664)' }}>
                    <div className="w-2 h-2 rounded-sm bg-white/80" />
                  </div>
                  <span className="text-xs font-semibold text-slate-200" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>PulseTrack</span>
                </div>
                {['Overview', 'Devices', 'Account'].map((item, i) => (
                  <div key={item} className="flex items-center gap-2 px-2 py-2 rounded-md text-xs border-l-2" style={{
                    background: i === 0 ? 'rgba(200,150,100,0.1)' : 'transparent',
                    borderColor: i === 0 ? '#C89664' : 'transparent',
                    color: i === 0 ? '#C89664' : 'rgba(200,150,100,0.4)',
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}>
                    <div className="w-1 h-1 rounded-full" style={{ background: i === 0 ? '#C89664' : 'rgba(200,150,100,0.3)' }} />
                    {item}
                  </div>
                ))}
              </div>

              {/* Main content */}
              <div className="flex-1 p-5">
                {/* Header row */}
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 className="text-base font-semibold text-slate-100" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Overview</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Week of 17 Feb 2025 · Auto-processed</p>
                  </div>
                  <span className="badge-success text-[10px] py-0.5 px-2">Consistent</span>
                </div>

                {/* Metric cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                  {metrics.map((m) => {
                    const Icon = m.icon;
                    return (
                      <div key={m.label} className="rounded-xl p-3 border" style={{ background: 'rgba(1,14,34,0.5)', borderColor: 'rgba(200,150,100,0.1)' }}>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[9px] uppercase tracking-wider text-slate-500" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{m.label}</p>
                          <Icon size={10} style={{ color: m.color }} />
                        </div>
                        <p className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: m.color }}>{m.value}</p>
                        <p className="text-[9px] text-slate-500 mt-0.5">{m.delta}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom row */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="rounded-xl p-3 border" style={{ background: 'rgba(1,14,34,0.4)', borderColor: 'rgba(37,107,151,0.15)' }}>
                    <p className="text-[10px] font-semibold text-slate-400 mb-2.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Connected Devices</p>
                    {['Fitbit', 'Withings'].map((d, i) => (
                      <div key={d} className="flex items-center justify-between py-1.5 border-b last:border-0" style={{ borderColor: 'rgba(35,62,92,0.3)' }}>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-md border flex items-center justify-center" style={{ background: 'rgba(35,62,92,0.5)', borderColor: 'rgba(35,62,92,0.8)' }}>
                            <Zap size={9} style={{ color: i === 0 ? '#EB721B' : '#256B97' }} />
                          </div>
                          <span className="text-[10px] text-slate-300" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{d}</span>
                        </div>
                        <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${i === 0 ? 'text-emerald-400 bg-emerald-400/10' : 'text-slate-500 bg-slate-800/50'}`}>
                          {i === 0 ? 'Connected' : 'Not linked'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl p-3 border" style={{ background: 'rgba(1,14,34,0.4)', borderColor: 'rgba(200,150,100,0.12)' }}>
                    <p className="text-[10px] font-semibold text-slate-400 mb-2.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Automation Status</p>
                    {[
                      { label: 'Weekly Processing', ok: true,  note: 'Mon 6am UTC' },
                      { label: 'Email Delivery',    ok: true,  note: 'Mailgun active' },
                      { label: 'Token Refresh',     ok: true,  note: 'Auto-managed' },
                      { label: 'Last Sync',         ok: true,  note: '2 hours ago' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between py-1" >
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1 h-1 rounded-full ${item.ok ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                          <span className="text-[9px] text-slate-400" style={{ fontFamily: "'Inter', sans-serif" }}>{item.label}</span>
                        </div>
                        <span className="text-[9px]" style={{ color: '#C89664' }}>{item.note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ──────────────────────────────────────────── */}
      <section className="py-16 px-4 mt-16 border-y" style={{ borderColor: 'rgba(200,150,100,0.08)', background: 'rgba(2,28,59,0.15)' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { value: '2',      label: 'Wearable Platforms',   sub: 'Fitbit & Withings' },
            { value: '7',      label: 'Behavioural Metrics',  sub: 'Per weekly sync'   },
            { value: '100%',   label: 'Automated Pipeline',   sub: 'Zero manual steps' },
            { value: 'GDPR',   label: 'Compliance Standard',  sub: 'Data minimisation' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#C89664' }}>{s.value}</p>
              <p className="text-sm font-medium text-slate-300" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.label}</p>
              <p className="text-xs text-slate-600 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-title justify-center flex mb-3">Process</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}>
              Three steps. Fully automated.
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              From signup to weekly insights in under 5 minutes. After that, everything runs itself.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 relative">
            {/* Connector lines */}
            <div className="hidden sm:block absolute top-10 left-1/3 right-1/3 h-px" style={{ background: 'linear-gradient(90deg, rgba(200,150,100,0.3), rgba(235,114,27,0.3))' }} />

            {steps.map((s, i) => (
              <div key={s.step} className="glass-card p-7 rounded-2xl glass-hover relative overflow-hidden group">
                {/* Step number watermark */}
                <div className="absolute bottom-4 right-5 text-6xl font-black select-none pointer-events-none" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'rgba(200,150,100,0.04)' }}>
                  {s.step}
                </div>
                {/* Icon badge */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 border" style={{
                  background: i === 0 ? 'rgba(235,114,27,0.1)' : i === 1 ? 'rgba(200,150,100,0.1)' : 'rgba(37,107,151,0.1)',
                  borderColor: i === 0 ? 'rgba(235,114,27,0.25)' : i === 1 ? 'rgba(200,150,100,0.25)' : 'rgba(37,107,151,0.25)',
                }}>
                  <span className="text-sm font-bold" style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    color: i === 0 ? '#EB721B' : i === 1 ? '#C89664' : '#256B97',
                  }}>{s.step}</span>
                </div>
                <h3 className="font-semibold text-slate-100 mb-2.5 text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">{s.description}</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full" style={{ background: i === 0 ? '#EB721B' : i === 1 ? '#C89664' : '#256B97' }} />
                  <span className="text-xs" style={{ color: i === 0 ? '#EB721B' : i === 1 ? '#C89664' : '#256B97', fontFamily: "'Inter', sans-serif" }}>{s.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────── */}
      <section id="features" className="py-24 px-4" style={{ background: 'rgba(2,28,59,0.12)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-title justify-center flex mb-3">Capabilities</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}>
              Built to run without you
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Every component designed for serverless scale, GDPR compliance, and zero operational overhead.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="rounded-2xl p-6 glass-hover border group transition-all"
                  style={{ background: 'rgba(2,28,59,0.55)', borderColor: 'rgba(200,150,100,0.1)' }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 border transition-colors group-hover:scale-105" style={{ background: f.accentBg, borderColor: f.accentBorder }}>
                    <Icon size={18} style={{ color: f.accent }} />
                  </div>
                  <h3 className="font-semibold text-slate-100 mb-2.5 text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {f.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── DATA SCOPE ─────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="section-title justify-center flex mb-3">Transparency</p>
            <h2 className="text-3xl font-bold text-slate-100 mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}>
              Exactly what we collect. Nothing more.
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto text-sm">
              Strict behavioural-only scope keeps PulseTrack outside medical device regulation — protecting you and us.
            </p>
          </div>

          <div className="glass-card rounded-2xl overflow-hidden border" style={{ borderColor: 'rgba(200,150,100,0.12)' }}>
            <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x" style={{ borderColor: 'rgba(200,150,100,0.1)' }}>
              {/* What we track */}
              <div className="p-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 rounded-full bg-[#EB721B]" />
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#EB721B' }}>
                    What we collect
                  </p>
                </div>
                <ul className="space-y-3">
                  {[
                    'Daily step count',
                    'Active minutes per day',
                    'Number of active days',
                    'Sleep duration (hours)',
                    'Sleep consistency score',
                    'Activity session count',
                    'Activity session duration',
                  ].map((m) => (
                    <li key={m} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(235,114,27,0.1)', border: '1px solid rgba(235,114,27,0.2)' }}>
                        <Check size={10} style={{ color: '#EB721B' }} />
                      </div>
                      <span className="text-sm text-slate-300" style={{ fontFamily: "'Inter', sans-serif" }}>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What we never touch */}
              <div className="p-8" style={{ background: 'rgba(1,14,34,0.2)' }}>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 rounded-full bg-slate-600" />
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-600" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Never collected
                  </p>
                </div>
                <ul className="space-y-3">
                  {[
                    'Heart Rate',
                    'HRV (Heart Rate Variability)',
                    'SpO₂ (Blood Oxygen)',
                    'Stress Score',
                    'Recovery Score',
                    'VO₂ Max',
                    'Blood Pressure',
                    'ECG / Cardiac data',
                    'Medication or symptoms',
                  ].map((m) => (
                    <li key={m} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-slate-800 border border-slate-700">
                        <div className="w-2 h-0.5 bg-slate-600 rounded" />
                      </div>
                      <span className="text-sm text-slate-600" style={{ fontFamily: "'Inter', sans-serif" }}>{m}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 pt-5 border-t" style={{ borderColor: 'rgba(35,62,92,0.3)' }}>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Behavioural scope keeps PulseTrack outside medical device regulation — no diagnosis, no clinical analysis, no liability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EMAIL PREVIEW ──────────────────────────────────────── */}
      <section className="py-24 px-4" style={{ background: 'rgba(2,28,59,0.15)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="section-title mb-3">Weekly Digest</p>
              <h2 className="text-3xl font-bold text-slate-100 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}>
                Your inbox is your dashboard.
              </h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                Every Monday morning, PulseTrack sends a structured consistency report directly to your inbox.
                No app to open. No login required. Just your data, formatted clearly.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  { text: 'Weekly metric summary with trend deltas', color: '#EB721B' },
                  { text: 'Target hit / missed status per metric',  color: '#C89664' },
                  { text: 'Consistency score for the week',         color: '#256B97' },
                  { text: 'Sent every Monday at 6am UTC',          color: '#EB721B' },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: item.color }} />
                    <span className="text-sm text-slate-400">{item.text}</span>
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup" className="btn-primary inline-flex px-7 py-3 gap-2">
                Get Your First Report
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Email mockup */}
            <div className="rounded-2xl overflow-hidden border" style={{ background: 'rgba(2,28,59,0.7)', borderColor: 'rgba(200,150,100,0.15)', boxShadow: '0 16px 48px rgba(1,14,34,0.6)' }}>
              {/* Email client chrome */}
              <div className="px-5 py-3 border-b flex items-center gap-3" style={{ borderColor: 'rgba(200,150,100,0.08)', background: 'rgba(1,14,34,0.4)' }}>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-[10px] text-slate-600">Weekly Consistency Report — PulseTrack</span>
                </div>
              </div>
              {/* Email body */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b" style={{ borderColor: 'rgba(200,150,100,0.08)' }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #EB721B, #C89664)' }}>
                    <div className="w-3.5 h-3.5 rounded-sm bg-white/80" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-200" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>PulseTrack</p>
                    <p className="text-[10px] text-slate-600">reports@pulsetrack.io</p>
                  </div>
                  <span className="ml-auto badge-success text-[9px]">Delivered</span>
                </div>
                <h4 className="text-sm font-semibold text-slate-200 mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Your weekly consistency report is ready.</h4>
                <p className="text-xs text-slate-500 mb-5">Week of 17 Feb 2025 · Fitbit sync</p>
                <div className="grid grid-cols-2 gap-2.5 mb-5">
                  {[
                    { label: 'Steps',          value: '8,420 / day', hit: true },
                    { label: 'Active Days',    value: '5 of 7',      hit: true },
                    { label: 'Sleep Duration', value: '7.2 hrs avg', hit: true },
                    { label: 'Active Minutes', value: '214 / week',  hit: false },
                  ].map((m) => (
                    <div key={m.label} className="rounded-lg p-3 border" style={{ background: 'rgba(1,14,34,0.5)', borderColor: 'rgba(200,150,100,0.08)' }}>
                      <p className="text-[9px] uppercase tracking-wider text-slate-500 mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{m.label}</p>
                      <p className="text-xs font-semibold" style={{ color: '#C89664', fontFamily: "'Space Grotesk', sans-serif" }}>{m.value}</p>
                      <p className={`text-[9px] mt-0.5 ${m.hit ? 'text-emerald-400' : 'text-slate-600'}`}>{m.hit ? 'Target met' : 'Below target'}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg p-3 border text-center" style={{ background: 'rgba(235,114,27,0.06)', borderColor: 'rgba(235,114,27,0.15)' }}>
                  <p className="text-xs text-slate-300" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Consistency Score</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: '#EB721B', fontFamily: "'Space Grotesk', sans-serif" }}>82 / 100</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Above your 4-week average</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section className="py-28 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-[0.06] blur-3xl" style={{ background: 'radial-gradient(ellipse, #EB721B, transparent)' }} />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <p className="section-title justify-center flex mb-4">Get Started</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-100 mb-5" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.025em' }}>
            Consistency starts with
            <br />
            <span style={{ background: 'linear-gradient(135deg, #EB721B 0%, #C89664 60%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              one connection.
            </span>
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
            Connect your Fitbit or Withings and receive your first automated consistency report next Monday.
            Free during MVP, no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <Link href="/auth/signup" className="btn-primary text-base px-10 py-3.5 gap-2">
              Create Free Account
              <ArrowRight size={16} />
            </Link>
            <Link href="/auth/signin" className="btn-secondary text-base px-10 py-3.5">
              Sign In
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-5">
            {['No credit card', 'GDPR compliant', 'Cancel anytime', 'Data encrypted at rest'].map((t) => (
              <div key={t} className="flex items-center gap-1.5">
                <Check size={11} style={{ color: '#C89664' }} />
                <span className="text-xs text-slate-600">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer className="border-t px-4 py-10" style={{ borderColor: 'rgba(200,150,100,0.08)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #EB721B, #C89664)' }}>
                <div className="w-3 h-3 rounded-sm bg-white/85" />
              </div>
              <span className="font-bold text-slate-300 text-sm tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>PulseTrack</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/auth/signin" className="text-xs text-slate-500 hover:text-slate-300 transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>Sign In</Link>
              <Link href="/auth/signup" className="text-xs text-slate-500 hover:text-slate-300 transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>Sign Up</Link>
              <Link href="#features" className="text-xs text-slate-500 hover:text-slate-300 transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>Features</Link>
              <Link href="#how-it-works" className="text-xs text-slate-500 hover:text-slate-300 transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>How It Works</Link>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t" style={{ borderColor: 'rgba(35,62,92,0.25)' }}>
            <p className="text-xs text-slate-700">
              Behavioural data only. No clinical analysis. Not a medical device.
            </p>
            <p className="text-xs text-slate-700">
              © 2025 PulseTrack · GDPR compliant · Encrypted at rest
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
