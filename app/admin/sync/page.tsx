'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { supabase } from '@/lib/supabase';
import Sidebar from '@/components/layout/Sidebar';
import Spinner from '@/components/ui/Spinner';
import { formatRelativeTime } from '@/lib/utils';
import { RefreshCw, CheckCircle2, XCircle, Clock, AlertTriangle, Play } from 'lucide-react';

interface SyncLog {
  id: string;
  provider: string;
  status: 'success' | 'failed' | 'retrying';
  synced_at: string;
  error_message: string | null;
  user_email: string;
}

export default function AdminSyncPage() {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const toast  = useToast();

  const [logs,          setLogs]          = useState<SyncLog[]>([]);
  const [dataLoading,   setDataLoading]   = useState(true);
  const [triggeringJob, setTriggeringJob] = useState(false);
  const [testingEmail,  setTestingEmail]  = useState<string | null>(null);
  const [statusFilter,  setStatusFilter]  = useState<'all' | 'success' | 'failed' | 'retrying'>('all');

  useEffect(() => {
    if (!loading && !user) router.push('/auth/signin');
    if (!loading && user && role && role !== 'admin') router.push('/dashboard');
  }, [user, role, loading, router]);

  const loadLogs = useCallback(async () => {
    setDataLoading(true);
    try {
      const res = await fetch('/api/admin/data?q=sync-logs&limit=100');
      if (res.ok) {
        const json = await res.json();
        setLogs(json.logs ?? []);
      }
    } catch (err) {
      console.error('Admin sync logs fetch error:', err);
    }
    setDataLoading(false);
  }, []);

  useEffect(() => {
    if (user && role === 'admin') loadLogs();
  }, [user, role, loadLogs]);

  if (loading || !user || role === null) {
    return <div className="page-bg min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  }

  const filtered = statusFilter === 'all' ? logs : logs.filter((l) => l.status === statusFilter);
  const successCount  = logs.filter((l) => l.status === 'success').length;
  const failedCount   = logs.filter((l) => l.status === 'failed').length;
  const retryingCount = logs.filter((l) => l.status === 'retrying').length;
  const successRate   = logs.length > 0 ? Math.round((successCount / logs.length) * 100) : 0;

  const handleTestEmail = async (type: string) => {
    if (!user) return;
    setTestingEmail(type);
    try {
      const res = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, type }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        toast.success('Test email sent', `${type} email delivered to ${data.sentTo}`);
      } else {
        toast.error('Email failed', data.error ?? 'Could not send test email.');
      }
    } catch {
      toast.error('Email failed', 'Network error when sending test email.');
    }
    setTestingEmail(null);
  };

  const handleTriggerJob = async () => {
    setTriggeringJob(true);
    try {
      const res = await fetch('/api/admin/trigger-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        toast.success('Batch job triggered', `Processed: ${data.processed ?? 0}, Failed: ${data.failed ?? 0}`);
        await loadLogs();
      } else {
        toast.error('Job failed', data.error ?? 'Could not trigger the weekly sync job.');
      }
    } catch {
      toast.error('Job failed', 'Network error when triggering the sync job.');
    }
    setTriggeringJob(false);
  };

  const syncStatCards = [
    { label: 'Total Sync Attempts', value: logs.length,               accent: '#256B97', iconBg: 'rgba(37,107,151,0.1)',   iconBorder: 'rgba(37,107,151,0.2)'   },
    { label: 'Successful Syncs',    value: successCount,              accent: '#10b981', iconBg: 'rgba(16,185,129,0.1)',   iconBorder: 'rgba(16,185,129,0.2)'   },
    { label: 'Failed / Retrying',   value: failedCount + retryingCount, accent: '#ef4444', iconBg: 'rgba(239,68,68,0.1)',  iconBorder: 'rgba(239,68,68,0.2)'    },
    { label: 'Success Rate',        value: `${successRate}%`,         accent: '#EB721B', iconBg: 'rgba(235,114,27,0.1)',   iconBorder: 'rgba(235,114,27,0.2)'   },
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
                Sync Health
              </h1>
              <p className="text-slate-500 text-sm mt-1">Wearable sync logs, retry status, and email delivery health.</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={loadLogs} disabled={dataLoading} className="btn-secondary text-sm px-4 py-2">
                {dataLoading ? <Spinner size="sm" /> : <><RefreshCw size={13} />Refresh</>}
              </button>
              <button onClick={handleTriggerJob} disabled={triggeringJob} className="btn-primary text-sm px-5 py-2.5">
                {triggeringJob ? <Spinner size="sm" /> : <><Play size={13} />Trigger Weekly Job</>}
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 lg:px-8 py-7 space-y-7">

          {/* ── Summary stat cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {syncStatCards.map((s) => (
              <div key={s.label} className="stat-card">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-medium text-slate-500" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.label}</p>
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.accent }} />
                </div>
                <p className="text-3xl font-bold leading-none mb-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif", color: s.accent }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* ── Sync logs table ── */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b flex-wrap gap-3" style={{ borderColor: 'rgba(200,150,100,0.08)' }}>
              <div>
                <h2 className="font-semibold text-slate-100 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Sync Logs</h2>
                <p className="text-xs text-slate-600 mt-0.5">Last 100 sync attempts</p>
              </div>
              <div className="flex items-center gap-1.5">
                {(['all', 'success', 'failed', 'retrying'] as const).map((f) => (
                  <button key={f} onClick={() => setStatusFilter(f)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all capitalize ${
                      statusFilter === f
                        ? 'bg-[rgba(235,114,27,0.12)] text-[#EB721B] border-[rgba(235,114,27,0.3)]'
                        : 'text-slate-500 border-[rgba(35,62,92,0.4)] hover:text-slate-300'
                    }`}
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{f}</button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              {dataLoading ? (
                <div className="flex items-center justify-center py-16"><Spinner size="lg" /></div>
              ) : filtered.length === 0 ? (
                <div className="py-12 text-center px-6">
                  <div className="w-10 h-10 rounded-xl bg-[rgba(35,62,92,0.4)] border border-[rgba(35,62,92,0.6)] flex items-center justify-center mx-auto mb-3">
                    <RefreshCw size={16} className="text-slate-600" />
                  </div>
                  <p className="text-sm text-slate-500">No sync logs yet.</p>
                  <p className="text-xs text-slate-600 mt-1">Logs appear after the first weekly cron run.</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="table-header text-left">User</th>
                      <th className="table-header text-left">Provider</th>
                      <th className="table-header text-left">Status</th>
                      <th className="table-header text-left">Time</th>
                      <th className="table-header text-left">Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((log) => (
                      <tr key={log.id} className="table-row">
                        <td className="table-cell text-slate-300 text-sm">{log.user_email ?? '—'}</td>
                        <td className="table-cell capitalize text-slate-400 text-sm">{log.provider}</td>
                        <td className="table-cell">
                          <div className="flex items-center gap-1.5">
                            {log.status === 'success'  && <><CheckCircle2 size={13} className="text-emerald-400" /><span className="badge-success">Success</span></>}
                            {log.status === 'failed'   && <><XCircle      size={13} className="text-red-400"    /><span className="badge-error">Failed</span></>}
                            {log.status === 'retrying' && <><RefreshCw    size={13} className="text-amber-400"  /><span className="badge-warning">Retrying</span></>}
                          </div>
                        </td>
                        <td className="table-cell text-slate-500 text-xs whitespace-nowrap">{formatRelativeTime(log.synced_at)}</td>
                        <td className="table-cell text-xs text-red-400/80 max-w-[200px] truncate">{log.error_message ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* ── Email system health ── */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(200,150,100,0.08)' }}>
              <h2 className="font-semibold text-slate-100 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Email System Health</h2>
              <p className="text-xs text-slate-600 mt-0.5">Mailgun delivery pipeline status</p>
            </div>
            <div className="p-6 space-y-2">
              {[
                { key: 'acknowledgement', label: 'Acknowledgement', note: 'Sent on every successful sync' },
                { key: 'encouragement',   label: 'Encouragement',   note: 'Sent when consistency score ≥ 70%' },
                { key: 'reauth',          label: 'Re-authentication',note: 'Sent when OAuth token refresh fails' },
              ].map((e) => (
                <div key={e.key} className="flex items-center gap-4 p-3.5 rounded-xl border" style={{ background: 'rgba(1,14,34,0.25)', borderColor: 'rgba(200,150,100,0.07)' }}>
                  <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <CheckCircle2 size={11} className="text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{e.label}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{e.note}</p>
                  </div>
                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    <span className="text-xs text-slate-500 hidden sm:inline">Mailgun · thisisdevspace.site</span>
                    <span className="badge-success">Active</span>
                    <button onClick={() => handleTestEmail(e.key)} disabled={testingEmail === e.key} className="btn-secondary text-xs px-3 py-1">
                      {testingEmail === e.key ? <Spinner size="sm" /> : 'Test'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 pb-5 flex items-center gap-2" style={{ borderTop: '1px solid rgba(35,62,92,0.2)', paddingTop: '1rem' }}>
              <Clock size={11} className="text-slate-600 flex-shrink-0" />
              <p className="text-xs text-slate-600">Detailed delivery logs available in your Mailgun dashboard at app.mailgun.com</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
