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
  Users, Activity, Mail, TrendingUp,
  CheckCircle2, AlertCircle, RefreshCw, ArrowRight,
} from 'lucide-react';

interface OverviewStats {
  totalUsers: number;
  activeConnections: number;
  syncSuccessLast30: number;
  avgConsistency: number;
}

interface SyncEvent {
  id: string;
  provider: string;
  status: string;
  error_message: string | null;
  synced_at: string;
  user_email: string;
}

export default function AdminOverviewPage() {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  const [stats,      setStats]      = useState<OverviewStats | null>(null);
  const [events,     setEvents]     = useState<SyncEvent[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [refreshing, setRefreshing]  = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/auth/signin');
    if (!loading && user && role && role !== 'admin') router.push('/dashboard');
  }, [user, role, loading, router]);

  const loadData = useCallback(async () => {
    setDataLoading(true);
    try {
      const res = await fetch('/api/admin/data?q=overview');
      if (res.ok) {
        const json = await res.json();
        setStats(json.stats);
        setEvents(json.recentLogs ?? []);
      }
    } catch (err) {
      console.error('Admin overview fetch error:', err);
    }
    setDataLoading(false);
  }, []);

  useEffect(() => {
    if (user && role === 'admin') loadData();
  }, [user, role, loadData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  if (loading || !user || role === null) {
    return <div className="page-bg min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  }

  const statCards = stats ? [
    { label: 'Total Users',        value: String(stats.totalUsers),        delta: 'registered accounts',      icon: Users,      accent: '#EB721B' },
    { label: 'Active Connections', value: String(stats.activeConnections), delta: 'wearables connected',      icon: Activity,   accent: '#256B97' },
    { label: 'Syncs (30d)',        value: String(stats.syncSuccessLast30), delta: 'successful this month',    icon: Mail,       accent: '#C89664' },
    { label: 'Avg Consistency',    value: `${stats.avgConsistency}%`,      delta: 'platform avg this month',  icon: TrendingUp, accent: '#EB721B' },
  ] : [];

  const accentConfig = [
    { accent: '#EB721B', iconBg: 'rgba(235,114,27,0.1)',   iconBorder: 'rgba(235,114,27,0.2)'   },
    { accent: '#256B97', iconBg: 'rgba(37,107,151,0.1)',   iconBorder: 'rgba(37,107,151,0.2)'   },
    { accent: '#C89664', iconBg: 'rgba(200,150,100,0.1)',  iconBorder: 'rgba(200,150,100,0.2)'  },
    { accent: '#EB721B', iconBg: 'rgba(235,114,27,0.1)',   iconBorder: 'rgba(235,114,27,0.2)'   },
  ];

  return (
    <div className="page-bg min-h-screen flex">
      <Sidebar variant="admin" />

      <main className="flex-1 min-w-0 overflow-hidden">
        {/* ── Page header ── */}
        <div className="px-6 lg:px-8 pt-8 pb-6 border-b" style={{ borderColor: 'rgba(200,150,100,0.08)' }}>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-slate-100" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}>
                System Overview
              </h1>
              <p className="text-slate-500 text-sm mt-1">Platform health, user metrics, and automation status.</p>
            </div>
            <button onClick={handleRefresh} disabled={refreshing} className="btn-secondary text-sm px-4 py-2 flex-shrink-0">
              {refreshing ? <Spinner size="sm" /> : <><RefreshCw size={13} /> Refresh</>}
            </button>
          </div>
        </div>

        <div className="px-6 lg:px-8 py-7 space-y-7">

          {dataLoading ? (
            <div className="flex items-center justify-center py-32"><Spinner size="lg" /></div>
          ) : (
            <>
              {/* ── Stat cards ── */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {statCards.map((s, i) => {
                  const Icon = s.icon;
                  const a = accentConfig[i];
                  return (
                    <div key={s.label} className="stat-card">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-xs font-medium text-slate-500" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.label}</p>
                        <div className="w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0" style={{ background: a.iconBg, borderColor: a.iconBorder }}>
                          <Icon size={14} style={{ color: a.accent }} />
                        </div>
                      </div>
                      <p className="text-3xl font-bold leading-none mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: a.accent }}>{s.value}</p>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full" style={{ background: a.accent, opacity: 0.6 }} />
                        <p className="text-xs text-slate-600">{s.delta}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── Quick nav cards ── */}
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { href: '/admin/users',     label: 'User Management',  desc: 'View users, connection status, support actions',  accent: '#EB721B' },
                  { href: '/admin/sync',      label: 'Sync Health',      desc: 'Monitor sync jobs, retry logs, email delivery',   accent: '#256B97' },
                  { href: '/admin/analytics', label: 'Analytics',        desc: 'Aggregate behaviour trends and target hit rates',  accent: '#C89664' },
                ].map((nav) => (
                  <Link key={nav.href} href={nav.href}
                    className="glass-card rounded-2xl overflow-hidden glass-hover group flex flex-col justify-between relative"
                    style={{ borderColor: `${nav.accent}18` }}
                  >
                    <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${nav.accent}60, transparent)` }} />
                    <div className="p-5">
                      <h3 className="font-semibold text-slate-100 text-sm mb-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{nav.label}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">{nav.desc}</p>
                    </div>
                    <div className="px-5 pb-4 flex items-center gap-1 text-xs font-medium" style={{ color: nav.accent, fontFamily: "'Space Grotesk', sans-serif" }}>
                      Open <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>

              {/* ── Recent sync events ── */}
              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'rgba(200,150,100,0.08)' }}>
                  <div>
                    <h2 className="font-semibold text-slate-100 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Recent Sync Events</h2>
                    <p className="text-xs text-slate-600 mt-0.5">Latest wearable sync activity</p>
                  </div>
                  <Link href="/admin/sync" className="text-xs font-medium transition-colors" style={{ color: '#256B97' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#C89664')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#256B97')}
                  >
                    View all →
                  </Link>
                </div>
                {events.length === 0 ? (
                  <div className="py-12 text-center px-6">
                    <div className="w-10 h-10 rounded-xl bg-[rgba(35,62,92,0.4)] border border-[rgba(35,62,92,0.6)] flex items-center justify-center mx-auto mb-3">
                      <Activity size={16} className="text-slate-600" />
                    </div>
                    <p className="text-sm text-slate-500">No sync events yet.</p>
                    <p className="text-xs text-slate-600 mt-1">Events will appear after the first weekly cron run.</p>
                  </div>
                ) : (
                  <div className="divide-y" style={{ borderColor: 'rgba(35,62,92,0.2)' }}>
                    {events.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 px-6 py-3.5">
                        {item.status === 'success'  && <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />}
                        {item.status === 'retrying' && <AlertCircle  size={14} className="text-amber-400 flex-shrink-0"  />}
                        {item.status === 'failed'   && <AlertCircle  size={14} className="text-red-400 flex-shrink-0"    />}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-300 truncate" style={{ fontFamily: "'Inter', sans-serif" }}>
                            <span className="text-slate-200 font-medium">{item.user_email ?? 'Unknown'}</span>
                            {' — '}{item.provider} sync{' '}
                            {item.status === 'success' ? <span className="text-emerald-400">succeeded</span> : item.status === 'failed' ? <span className="text-red-400">failed</span> : <span className="text-amber-400">retrying</span>}
                            {item.error_message ? <span className="text-slate-600"> ({item.error_message})</span> : ''}
                          </p>
                        </div>
                        <span className="text-xs text-slate-600 flex-shrink-0">{formatRelativeTime(item.synced_at)}</span>
                      </div>
                    ))}
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
