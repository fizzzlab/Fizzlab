'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import Sidebar from '@/components/layout/Sidebar';
import Spinner from '@/components/ui/Spinner';
import { formatRelativeTime } from '@/lib/utils';
import {
  Activity, Moon, Footprints, Timer,
  Zap, RefreshCw, AlertTriangle, CheckCircle2,
  Trophy, Flame, ArrowRight,
} from 'lucide-react';
import MetricIcon from '@/components/ui/MetricIcon';

interface Connection {
  id: string;
  provider: string;
  status: 'connected' | 'expired' | 'disconnected';
  last_sync_at: string | null;
  token_expires_at: string | null;
}

interface WeeklyReport {
  steps: number | null;
  active_days: number | null;
  sleep_duration: number | null;
  active_minutes: number | null;
  consistency_score: number | null;
  target_hit: boolean | null;
  week_start: string | null;
  email_sent_at: string | null;
}

interface SyncLog {
  id: string;
  provider: string;
  status: string;
  synced_at: string;
  error_message: string | null;
}

interface RecentBadge {
  id: string;
  awarded_at: string;
  badge_definitions: {
    name: string;
    emoji: string;
    level: number;
    goals: { name: string; emoji: string | null };
  };
}

interface GoalStreak {
  goal_name: string;
  goal_emoji: string | null;
  current_streak: number;
  highest_level: number;
  next_badge: { name: string; emoji: string; streak_weeks: number } | null;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [connections,  setConnections]  = useState<Connection[]>([]);
  const [report,       setReport]       = useState<WeeklyReport | null>(null);
  const [syncLogs,     setSyncLogs]     = useState<SyncLog[]>([]);
  const [recentBadges, setRecentBadges] = useState<RecentBadge[]>([]);
  const [streaks,      setStreaks]      = useState<GoalStreak[]>([]);
  const [dataLoading,  setDataLoading]  = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push('/auth/signin');
  }, [user, loading, router]);

  const loadData = useCallback(async () => {
    if (!user) return;
    setDataLoading(true);

    const { data: { session } } = await supabase.auth.getSession();

    const [connRes, reportRes, logsRes] = await Promise.all([
      supabase
        .from('wearable_connections')
        .select('id, provider, status, last_sync_at, token_expires_at')
        .eq('user_id', user.id),
      supabase
        .from('weekly_reports')
        .select('steps, active_days, sleep_duration, active_minutes, consistency_score, target_hit, week_start, email_sent_at')
        .eq('user_id', user.id)
        .order('week_start', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from('sync_logs')
        .select('id, provider, status, synced_at, error_message')
        .eq('user_id', user.id)
        .order('synced_at', { ascending: false })
        .limit(5),
    ]);

    setConnections((connRes.data as Connection[]) ?? []);
    setReport((reportRes.data as WeeklyReport) ?? null);
    setSyncLogs((logsRes.data as SyncLog[]) ?? []);

    // Fetch badge data
    if (session) {
      const headers = { Authorization: `Bearer ${session.access_token}` };
      const [badgesRes, progressRes] = await Promise.all([
        fetch('/api/badges?q=my-badges', { headers }).then(r => r.ok ? r.json() : { badges: [] }).catch(() => ({ badges: [] })),
        fetch('/api/badges?q=progress', { headers }).then(r => r.ok ? r.json() : { progress: [] }).catch(() => ({ progress: [] })),
      ]);
      setRecentBadges((badgesRes.badges ?? []).slice(0, 5));
      setStreaks(progressRes.progress ?? []);
    }

    setDataLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) loadData();
  }, [user, loadData]);

  if (loading || !user) {
    return <div className="page-bg min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  }

  const connected = connections.find((c) => c.status === 'connected');
  const hasAnyConnection = connections.length > 0;

  const metricCards = [
    {
      label: 'Steps Last Week',
      value: report?.steps != null ? report.steps.toLocaleString() : '—',
      delta: report?.steps != null ? (report.steps >= 70000 ? 'Target met' : 'Below target') : 'No data yet',
      positive: report?.steps != null && report.steps >= 70000,
      icon: Footprints,
    },
    {
      label: 'Active Days / Week',
      value: report?.active_days != null ? `${report.active_days} of 7` : '—',
      delta: report?.active_days != null ? (report.active_days >= 5 ? 'Target met' : 'Below target') : 'No data yet',
      positive: report?.active_days != null && report.active_days >= 5,
      icon: Activity,
    },
    {
      label: 'Sleep Duration',
      value: report?.sleep_duration != null ? `${Number(report.sleep_duration).toFixed(1)} hrs` : '—',
      delta: report?.sleep_duration != null ? (Number(report.sleep_duration) >= 7 ? 'On target' : 'Below target') : 'No data yet',
      positive: report?.sleep_duration != null && Number(report.sleep_duration) >= 7,
      icon: Moon,
    },
    {
      label: 'Active Minutes',
      value: report?.active_minutes != null ? `${report.active_minutes} min` : '—',
      delta: report?.active_minutes != null ? (report.active_minutes >= 150 ? 'Target met' : 'Below target') : 'No data yet',
      positive: report?.active_minutes != null && report.active_minutes >= 150,
      icon: Timer,
    },
  ];

  const tokenExpired = connected
    ? connected.token_expires_at != null && new Date(connected.token_expires_at) < new Date()
    : false;

  const accentConfig = [
    { cardCls: 'stat-card stat-card-orange', iconBg: 'rgba(235,114,27,0.1)',   iconBorder: 'rgba(235,114,27,0.2)',   iconColor: '#EB721B', valColor: '#EB721B' },
    { cardCls: 'stat-card stat-card-tan',    iconBg: 'rgba(200,150,100,0.1)',  iconBorder: 'rgba(200,150,100,0.2)', iconColor: '#C89664', valColor: '#C89664' },
    { cardCls: 'stat-card stat-card-blue',   iconBg: 'rgba(37,107,151,0.1)',   iconBorder: 'rgba(37,107,151,0.2)',  iconColor: '#256B97', valColor: '#7dd3fc' },
    { cardCls: 'stat-card stat-card-orange', iconBg: 'rgba(235,114,27,0.1)',   iconBorder: 'rgba(235,114,27,0.2)',  iconColor: '#EB721B', valColor: '#EB721B' },
  ];

  return (
    <div className="page-bg min-h-screen flex">
      <Sidebar variant="user" />

      <main className="flex-1 min-w-0 overflow-hidden">
        {/* ── Page header ── */}
        <div className="px-6 lg:px-8 pt-8 pb-6 border-b" style={{ borderColor: 'rgba(200,150,100,0.08)' }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-100" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}>
                Overview
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Behavioural consistency at a glance
                {connected?.last_sync_at && (
                  <> · Last sync <span className="text-[#C89664]">{formatRelativeTime(connected.last_sync_at)}</span></>
                )}
              </p>
            </div>
            {report?.week_start && (
              <div className="flex-shrink-0 text-right">
                <p className="text-[10px] uppercase tracking-widest text-slate-600" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Week of</p>
                <p className="text-xs font-medium text-slate-400 mt-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {new Date(report.week_start).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 lg:px-8 py-7 space-y-7">

          {/* ── Banners ── */}
          {!hasAnyConnection && !dataLoading && (
            <div className="rounded-xl px-4 py-3.5 border flex items-center gap-3" style={{ background: 'rgba(245,158,11,0.05)', borderColor: 'rgba(245,158,11,0.2)' }}>
              <AlertTriangle size={15} className="text-amber-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-slate-200" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>No wearable connected — </span>
                <span className="text-sm text-slate-500">Connect your Fitbit, Withings, Garmin, or Huawei device to start automated weekly syncing.</span>
              </div>
              <Link href="/connect" className="btn-primary text-xs px-4 py-1.5 flex-shrink-0">Connect Device</Link>
            </div>
          )}

          {tokenExpired && (
            <div className="rounded-xl px-4 py-3.5 border flex items-center gap-3" style={{ background: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.2)' }}>
              <AlertTriangle size={15} className="text-red-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-slate-200" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Connection expired — </span>
                <span className="text-sm text-slate-500">Your {connected?.provider} token has expired. Reconnect to resume syncing.</span>
              </div>
              <Link href="/connect" className="btn-primary text-xs px-4 py-1.5 flex-shrink-0">Reconnect</Link>
            </div>
          )}

          {dataLoading ? (
            <div className="flex items-center justify-center py-32"><Spinner size="lg" /></div>
          ) : (
            <>
              {/* ── Stat cards ── */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {metricCards.map((m, i) => {
                  const Icon = m.icon;
                  const a = accentConfig[i];
                  return (
                    <div key={m.label} className={a.cardCls}>
                      {/* Card header */}
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-xs font-medium text-slate-500 leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{m.label}</p>
                        <div className="w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0" style={{ background: a.iconBg, borderColor: a.iconBorder }}>
                          <Icon size={14} style={{ color: a.iconColor }} />
                        </div>
                      </div>
                      {/* Value */}
                      <p className="text-3xl font-bold leading-none mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: a.valColor }}>{m.value}</p>
                      {/* Delta */}
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1 h-1 rounded-full ${m.positive ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                        <p className={`text-xs font-medium ${m.positive ? 'text-emerald-400' : 'text-slate-600'}`}>{m.delta}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── Badges summary ── */}
              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'rgba(200,150,100,0.08)' }}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg border flex items-center justify-center" style={{ background: 'rgba(235,114,27,0.1)', borderColor: 'rgba(235,114,27,0.2)' }}>
                      <Trophy size={13} style={{ color: '#EB721B' }} />
                    </div>
                    <div>
                      <h2 className="font-semibold text-slate-100 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Badge Progress</h2>
                      <p className="text-xs text-slate-600 mt-0.5">{recentBadges.length} earned · {streaks.filter(s => s.current_streak > 0).length} active streaks</p>
                    </div>
                  </div>
                  <Link href="/badges" className="text-xs font-medium flex items-center gap-1 transition-colors" style={{ color: '#256B97' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#C89664')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#256B97')}
                  >
                    View all <ArrowRight size={11} />
                  </Link>
                </div>
                <div className="p-5">
                  {streaks.length === 0 ? (
                    <div className="py-6 text-center">
                      <p className="text-sm text-slate-500">Connect a wearable and sync data to start earning badges.</p>
                    </div>
                  ) : (
                    <div className="flex gap-3 overflow-x-auto pb-1">
                      {streaks.map((s) => (
                        <div key={s.goal_name} className="flex-shrink-0 w-[140px] rounded-xl border p-3.5" style={{ background: s.current_streak > 0 ? 'rgba(235,114,27,0.04)' : 'rgba(1,14,34,0.25)', borderColor: s.current_streak > 0 ? 'rgba(235,114,27,0.15)' : 'rgba(35,62,92,0.3)' }}>
                          <div className="flex items-center justify-between mb-2">
                            <MetricIcon emoji={s.goal_emoji} size={18} color={s.current_streak > 0 ? '#EB721B' : '#475569'} />
                            {s.current_streak > 0 && (
                              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(235,114,27,0.1)' }}>
                                <Flame size={9} style={{ color: '#EB721B' }} />
                                <span className="text-[10px] font-bold" style={{ color: '#EB721B' }}>{s.current_streak}w</span>
                              </div>
                            )}
                          </div>
                          <p className="text-xs font-semibold text-slate-200 truncate" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.goal_name}</p>
                          <p className="text-[10px] text-slate-600 mt-1 truncate">
                            {s.next_badge ? <span className="inline-flex items-center gap-1">Next: <MetricIcon emoji={s.next_badge.emoji} size={10} color="#475569" /> {s.next_badge.name}</span> : 'All badges earned'}
                          </p>
                          {s.next_badge && (
                            <div className="mt-2 progress-bar" style={{ height: '3px' }}>
                              <div className="progress-bar-fill" style={{ width: `${Math.min(100, (s.current_streak / s.next_badge.streak_weeks) * 100)}%`, background: '#EB721B' }} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* ── Devices + Automation ── */}
              <div className="grid lg:grid-cols-5 gap-5">

                {/* Connected Devices — wider */}
                <div className="lg:col-span-3 glass-card rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'rgba(200,150,100,0.08)' }}>
                    <div>
                      <h2 className="font-semibold text-slate-100 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Connected Devices</h2>
                      <p className="text-xs text-slate-600 mt-0.5">Wearable OAuth connections</p>
                    </div>
                    <Link href="/connect" className="text-xs font-medium transition-colors" style={{ color: '#256B97' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#C89664')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#256B97')}
                    >
                      Manage →
                    </Link>
                  </div>
                  <div className="p-5">
                    {connections.length === 0 ? (
                      <div className="py-8 text-center">
                        <div className="w-10 h-10 rounded-xl bg-[rgba(35,62,92,0.4)] border border-[rgba(35,62,92,0.6)] flex items-center justify-center mx-auto mb-3">
                          <Zap size={16} className="text-slate-600" />
                        </div>
                        <p className="text-sm text-slate-500 mb-2">No devices connected yet</p>
                        <Link href="/connect" className="text-xs font-medium" style={{ color: '#EB721B' }}>Connect a device →</Link>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {connections.map((c) => (
                          <div key={c.id} className="flex items-center justify-between p-3.5 rounded-xl border" style={{ background: 'rgba(1,14,34,0.3)', borderColor: c.status === 'connected' ? 'rgba(200,150,100,0.12)' : 'rgba(35,62,92,0.4)' }}>
                            <div className="flex items-center gap-3.5">
                              <div className="w-9 h-9 rounded-xl flex items-center justify-center border flex-shrink-0" style={{ background: 'rgba(35,62,92,0.5)', borderColor: 'rgba(35,62,92,0.7)' }}>
                                <Zap size={14} style={{ color: c.status === 'connected' ? '#EB721B' : '#334155' }} />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-200 capitalize" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{c.provider}</p>
                                <p className="text-xs text-slate-600 mt-0.5">
                                  {c.last_sync_at ? `Last sync ${formatRelativeTime(c.last_sync_at)}` : 'Not synced yet'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {c.status === 'connected'    && <span className="badge-success">Active</span>}
                              {c.status === 'expired'      && <span className="badge-warning">Expired</span>}
                              {c.status === 'disconnected' && (
                                <Link href="/connect" className="text-xs font-medium" style={{ color: '#EB721B' }}>Connect</Link>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Automation Status — narrower */}
                <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'rgba(200,150,100,0.08)' }}>
                    <div>
                      <h2 className="font-semibold text-slate-100 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Automation</h2>
                      <p className="text-xs text-slate-600 mt-0.5">Pipeline status</p>
                    </div>
                    <span className="badge-success"><RefreshCw size={9} />Active</span>
                  </div>
                  <div className="p-5 space-y-3.5">
                    {[
                      { label: 'Weekly Processing',  value: 'Mon 6am UTC',                                                                    ok: true  },
                      { label: 'Email Delivery',     value: 'Mailgun active',                                                                  ok: true  },
                      { label: 'Token Refresh',      value: connected ? 'Auto-managed' : 'No device',                                         ok: !!connected },
                      { label: 'Last Sync',          value: connected?.last_sync_at ? formatRelativeTime(connected.last_sync_at) : 'Never',    ok: !!connected?.last_sync_at },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <CheckCircle2 size={13} style={{ color: item.ok ? '#C89664' : '#334155', flexShrink: 0 }} />
                          <span className="text-sm text-slate-400 truncate" style={{ fontFamily: "'Inter', sans-serif" }}>{item.label}</span>
                        </div>
                        <span className="text-xs flex-shrink-0" style={{ color: item.ok ? '#256B97' : '#475569', fontFamily: "'Inter', sans-serif" }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Recent sync activity ── */}
              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'rgba(200,150,100,0.08)' }}>
                  <div>
                    <h2 className="font-semibold text-slate-100 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Recent Sync Activity</h2>
                    <p className="text-xs text-slate-600 mt-0.5">Latest processing runs</p>
                  </div>
                </div>

                {syncLogs.length === 0 ? (
                  <div className="py-12 text-center px-6">
                    <div className="w-10 h-10 rounded-xl bg-[rgba(35,62,92,0.4)] border border-[rgba(35,62,92,0.6)] flex items-center justify-center mx-auto mb-3">
                      <RefreshCw size={16} className="text-slate-600" />
                    </div>
                    <p className="text-sm text-slate-500">No sync activity yet.</p>
                    <p className="text-xs text-slate-600 mt-1">This will populate after your first weekly processing run.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="table-header text-left w-1/5">Provider</th>
                          <th className="table-header text-left w-1/5">Status</th>
                          <th className="table-header text-left w-1/5">Time</th>
                          <th className="table-header text-left">Note</th>
                        </tr>
                      </thead>
                      <tbody>
                        {syncLogs.map((log) => (
                          <tr key={log.id} className="table-row">
                            <td className="table-cell">
                              <span className="font-medium text-slate-300 capitalize" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{log.provider}</span>
                            </td>
                            <td className="table-cell">
                              {log.status === 'success'  && <span className="badge-success">Success</span>}
                              {log.status === 'failed'   && <span className="badge-error">Failed</span>}
                              {log.status === 'retrying' && <span className="badge-warning">Retrying</span>}
                            </td>
                            <td className="table-cell text-slate-500 text-xs whitespace-nowrap">{formatRelativeTime(log.synced_at)}</td>
                            <td className="table-cell text-xs text-slate-500 max-w-xs truncate">
                              {log.error_message ?? (log.status === 'success' ? 'Sync completed, report generated' : '—')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
