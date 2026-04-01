'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import Spinner from '@/components/ui/Spinner';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell,
} from 'recharts';

interface WeeklyPoint { week: string; steps: number; sleep: number; active: number; }
interface TargetRate  { metric: string; rate: number; color: string; }
interface DeviceDist  { label: string; count: number; pct: number; color: string; }
interface SummaryStats {
  avgStepsHit: string;
  avgSleepConsistency: string;
  avgActiveDays: string;
  overallConsistency: string;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-4 py-3 rounded-xl border border-[rgba(35,62,92,0.6)] text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
        <p className="text-slate-400 mb-2 font-medium" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{label}</p>
        {payload.map((p) => (
          <div key={p.name} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-slate-400 capitalize">{p.name}:</span>
            <span className="text-slate-200 font-medium">{p.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const GrowthTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-4 py-3 rounded-xl border border-[rgba(35,62,92,0.6)] text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
        <p className="text-slate-400 mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{label}</p>
        <p className="text-slate-200 font-semibold">{payload[0].value} syncs</p>
      </div>
    );
  }
  return null;
};

export default function AdminAnalyticsPage() {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  const [dataLoading,     setDataLoading]     = useState(true);
  const [weeklyPoints,    setWeeklyPoints]    = useState<WeeklyPoint[]>([]);
  const [targetRates,     setTargetRates]     = useState<TargetRate[]>([]);
  const [deviceDist,      setDeviceDist]      = useState<DeviceDist[]>([]);
  const [syncActivity,    setSyncActivity]    = useState<{ week: string; syncs: number }[]>([]);
  const [summaryStats,    setSummaryStats]    = useState<SummaryStats>({
    avgStepsHit: '—', avgSleepConsistency: '—', avgActiveDays: '—', overallConsistency: '—',
  });

  useEffect(() => {
    if (!loading && !user) router.push('/auth/signin');
    if (!loading && user && role && role !== 'admin') router.push('/dashboard');
  }, [user, role, loading, router]);

  const loadAnalytics = useCallback(async () => {
    setDataLoading(true);
    try {
      const res = await fetch('/api/admin/data?q=analytics');
      if (!res.ok) return;
      const { reports, syncLogs, connections } = await res.json();

      // Weekly consistency trend — group reports by week_start
      const byWeek: Record<string, { steps: number[]; sleep: number[]; active: number[] }> = {};
      for (const r of reports) {
        const key = r.week_start ? r.week_start.slice(0, 10) : 'unknown';
        if (!byWeek[key]) byWeek[key] = { steps: [], sleep: [], active: [] };
        if (r.steps        != null) byWeek[key].steps.push(r.steps >= 70000 ? 1 : 0);
        if (r.sleep_duration != null) byWeek[key].sleep.push(Number(r.sleep_duration) >= 7 ? 1 : 0);
        if (r.active_days  != null) byWeek[key].active.push(r.active_days >= 5 ? 1 : 0);
      }
      const weeks = Object.keys(byWeek).sort();
      const weekly: WeeklyPoint[] = weeks.map((w) => {
        const d = byWeek[w];
        const pct = (arr: number[]) => arr.length > 0 ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 100) : 0;
        return { week: w, steps: pct(d.steps), sleep: pct(d.sleep), active: pct(d.active) };
      });
      setWeeklyPoints(weekly);

      // Target hit rates
      if (reports.length > 0) {
        const hit = (fn: (r: { steps: number; sleep_duration: number; active_days: number; active_minutes: number; consistency_score: number }) => boolean) =>
          Math.round((reports.filter(fn).length / reports.length) * 100);
        setTargetRates([
          { metric: 'Steps',             rate: hit((r) => r.steps >= 70000),           color: '#EB721B' },
          { metric: 'Active Days',        rate: hit((r) => r.active_days >= 5),          color: '#C89664' },
          { metric: 'Sleep Duration',     rate: hit((r) => Number(r.sleep_duration) >= 7), color: '#256B97' },
          { metric: 'Active Minutes',     rate: hit((r) => r.active_minutes >= 150),     color: '#03294E' },
          { metric: 'Sleep Consistency',  rate: hit((r) => r.consistency_score >= 70),   color: '#233E5C' },
        ]);

        const avg = (fn: (r: { steps: number; sleep_duration: number; active_days: number; consistency_score: number }) => number) =>
          (reports.reduce((a: number, r: { steps: number; sleep_duration: number; active_days: number; consistency_score: number }) => a + fn(r), 0) / reports.length);
        setSummaryStats({
          avgStepsHit:         `${hit((r) => r.steps >= 70000)}%`,
          avgSleepConsistency: `${hit((r) => Number(r.sleep_duration) >= 7)}%`,
          avgActiveDays:       avg((r) => r.active_days ?? 0).toFixed(1),
          overallConsistency:  `${Math.round(avg((r) => r.consistency_score ?? 0))}%`,
        });
      } else {
        setTargetRates([
          { metric: 'Steps',            rate: 0, color: '#EB721B' },
          { metric: 'Active Days',       rate: 0, color: '#C89664' },
          { metric: 'Sleep Duration',    rate: 0, color: '#256B97' },
          { metric: 'Active Minutes',    rate: 0, color: '#03294E' },
          { metric: 'Sleep Consistency', rate: 0, color: '#233E5C' },
        ]);
      }

      // Sync activity by week (from sync_logs)
      const syncByWeek: Record<string, number> = {};
      for (const l of syncLogs) {
        const d = new Date(l.synced_at);
        const weekKey = `${d.getFullYear()}-W${String(Math.ceil(d.getDate() / 7)).padStart(2, '0')}`;
        syncByWeek[weekKey] = (syncByWeek[weekKey] ?? 0) + 1;
      }
      const syncWeeks = Object.keys(syncByWeek).sort().slice(-8);
      setSyncActivity(syncWeeks.map((w) => ({ week: w, syncs: syncByWeek[w] })));

      // Device distribution
      const total = connections.length || 1;
      const fitbitCount    = connections.filter((c: { provider: string }) => c.provider === 'fitbit').length;
      const withingsCount  = connections.filter((c: { provider: string }) => c.provider === 'withings').length;
      const garminCount    = connections.filter((c: { provider: string }) => c.provider === 'garmin').length;
      const huaweiCount    = connections.filter((c: { provider: string }) => c.provider === 'huawei').length;
      const disconnected   = connections.filter((c: { status: string }) => c.status === 'disconnected').length;
      setDeviceDist([
        { label: 'Fitbit',       count: fitbitCount,   pct: Math.round((fitbitCount  / total) * 100), color: '#EB721B' },
        { label: 'Withings',     count: withingsCount, pct: Math.round((withingsCount/ total) * 100), color: '#256B97' },
        { label: 'Garmin',       count: garminCount,   pct: Math.round((garminCount  / total) * 100), color: '#4CAF50' },
        { label: 'Huawei',       count: huaweiCount,   pct: Math.round((huaweiCount  / total) * 100), color: '#CE1B28' },
        { label: 'Disconnected', count: disconnected,  pct: Math.round((disconnected / total) * 100), color: '#233E5C' },
      ]);
    } catch (err) {
      console.error('Analytics load error:', err);
    }
    setDataLoading(false);
  }, []);

  useEffect(() => {
    if (user && role === 'admin') loadAnalytics();
  }, [user, role, loadAnalytics]);

  if (loading || !user || role === null) {
    return (
      <div className="page-bg min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const analyticsSummaryCards = [
    { label: 'Avg. Steps Target Hit',     value: summaryStats.avgStepsHit,         delta: 'of all users',   accent: '#EB721B' },
    { label: 'Avg. Sleep Target Hit',     value: summaryStats.avgSleepConsistency, delta: '≥7 hrs target',  accent: '#256B97' },
    { label: 'Avg. Active Days / Week',   value: summaryStats.avgActiveDays,       delta: 'of 7 days',      accent: '#C89664' },
    { label: 'Overall Consistency Score', value: summaryStats.overallConsistency,  delta: 'platform avg',   accent: '#EB721B' },
  ];

  return (
    <div className="page-bg min-h-screen flex">
      <Sidebar variant="admin" />

      <main className="flex-1 min-w-0 overflow-hidden">
        {/* ── Page header ── */}
        <div className="px-6 lg:px-8 pt-8 pb-6 border-b" style={{ borderColor: 'rgba(200,150,100,0.08)' }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-100" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}>
                Behavioural Analytics
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Aggregated pseudonymous trends · No individual data surfaced
              </p>
            </div>
            <div className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border" style={{ background: 'rgba(37,107,151,0.06)', borderColor: 'rgba(37,107,151,0.2)' }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#256B97' }} />
              <span className="text-xs" style={{ color: '#256B97', fontFamily: "'Space Grotesk', sans-serif" }}>Pseudonymised</span>
            </div>
          </div>
        </div>

        <div className="px-6 lg:px-8 py-7 space-y-7">

          {dataLoading ? (
            <div className="flex items-center justify-center py-32"><Spinner size="lg" /></div>
          ) : (
            <>
              {/* ── Summary stat cards ── */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {analyticsSummaryCards.map((s) => (
                  <div key={s.label} className="stat-card">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs font-medium text-slate-500" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.label}</p>
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.accent }} />
                    </div>
                    <p className="text-3xl font-bold leading-none mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: s.accent }}>{s.value}</p>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full" style={{ background: s.accent, opacity: 0.5 }} />
                      <p className="text-xs text-slate-600">{s.delta}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Charts row 1 ── */}
              <div className="grid lg:grid-cols-2 gap-5">
                {/* Weekly consistency trend */}
                <div className="glass-card rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(200,150,100,0.08)' }}>
                    <h2 className="font-semibold text-slate-100 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Weekly Target Hit Rate (%)</h2>
                    <p className="text-xs text-slate-600 mt-0.5">Percentage of users hitting behavioural targets each week</p>
                  </div>
                  <div className="p-6">
                    {weeklyPoints.length === 0 ? (
                      <div className="py-12 text-center">
                        <p className="text-sm text-slate-600">No weekly report data yet.</p>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={weeklyPoints} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="stepsGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#EB721B" stopOpacity={0.25} />
                              <stop offset="100%" stopColor="#EB721B" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#256B97" stopOpacity={0.25} />
                              <stop offset="100%" stopColor="#256B97" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#C89664" stopOpacity={0.25} />
                              <stop offset="100%" stopColor="#C89664" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(35,62,92,0.3)" />
                          <XAxis dataKey="week" tick={{ fill: '#475569', fontSize: 10, fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fill: '#475569', fontSize: 10, fontFamily: 'Inter' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                          <Tooltip content={<CustomTooltip />} />
                          <Area type="monotone" dataKey="steps"  stroke="#EB721B" strokeWidth={1.5} fill="url(#stepsGrad)"  dot={false} />
                          <Area type="monotone" dataKey="sleep"  stroke="#256B97" strokeWidth={1.5} fill="url(#sleepGrad)"  dot={false} />
                          <Area type="monotone" dataKey="active" stroke="#C89664" strokeWidth={1.5} fill="url(#activeGrad)" dot={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                    <div className="flex items-center gap-4 mt-4">
                      {[{ label: 'Steps', color: '#EB721B' }, { label: 'Sleep', color: '#256B97' }, { label: 'Active', color: '#C89664' }].map((l) => (
                        <div key={l.label} className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                          <span className="text-xs text-slate-500">{l.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Target hit rates */}
                <div className="glass-card rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(200,150,100,0.08)' }}>
                    <h2 className="font-semibold text-slate-100 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Target Achievement by Metric</h2>
                    <p className="text-xs text-slate-600 mt-0.5">% of users meeting each behavioural target this month</p>
                  </div>
                  <div className="p-6 space-y-4">
                    {targetRates.map((t) => (
                      <div key={t.metric}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-slate-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{t.metric}</span>
                          <span className="text-xs font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: t.color }}>{t.rate}%</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-bar-fill" style={{ width: `${t.rate}%`, background: `linear-gradient(90deg, ${t.color}, ${t.color}80)` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Charts row 2 ── */}
              <div className="grid lg:grid-cols-2 gap-5">
                {/* Sync activity */}
                <div className="glass-card rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(200,150,100,0.08)' }}>
                    <h2 className="font-semibold text-slate-100 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Sync Activity (30d)</h2>
                    <p className="text-xs text-slate-600 mt-0.5">Total sync attempts by week in the last 30 days</p>
                  </div>
                  <div className="p-6">
                    {syncActivity.length === 0 ? (
                      <div className="py-12 text-center"><p className="text-sm text-slate-600">No sync activity yet.</p></div>
                    ) : (
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={syncActivity} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(35,62,92,0.3)" vertical={false} />
                          <XAxis dataKey="week" tick={{ fill: '#475569', fontSize: 10, fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fill: '#475569', fontSize: 10, fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                          <Tooltip content={<GrowthTooltip />} />
                          <Bar dataKey="syncs" radius={[4, 4, 0, 0]} maxBarSize={40}>
                            {syncActivity.map((_, i) => (
                              <Cell key={i} fill={i === syncActivity.length - 1 ? '#EB721B' : 'rgba(37,107,151,0.4)'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                {/* Wearable distribution */}
                <div className="glass-card rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(200,150,100,0.08)' }}>
                    <h2 className="font-semibold text-slate-100 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Wearable Distribution</h2>
                    <p className="text-xs text-slate-600 mt-0.5">Device provider breakdown across all connections</p>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {deviceDist.map((d) => (
                        <div key={d.label}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate-300 capitalize" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{d.label}</span>
                            <span className="text-xs font-semibold" style={{ color: d.color, fontFamily: "'Space Grotesk', sans-serif" }}>{d.count}</span>
                          </div>
                          <div className="progress-bar">
                            <div className="progress-bar-fill" style={{ width: `${d.pct}%`, background: d.color }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mt-5 pt-4 border-t" style={{ borderColor: 'rgba(35,62,92,0.25)' }}>
                      All four providers (Fitbit, Withings, Garmin, Huawei) are supported. Data is aggregated pseudonymously.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
