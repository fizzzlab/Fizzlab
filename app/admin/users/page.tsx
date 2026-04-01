'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { supabase } from '@/lib/supabase';
import Sidebar from '@/components/layout/Sidebar';
import Modal from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import { Search, RefreshCw, UserX, Trash2, Filter } from 'lucide-react';

interface UserRow {
  id: string;
  email: string;
  created_at: string;
  provider: 'fitbit' | 'withings' | 'garmin' | 'huawei' | 'none';
  connection_status: 'connected' | 'expired' | 'disconnected';
  last_sync: string | null;
  status: 'active' | 'disabled';
}

type ActionType = 'reauth' | 'disable' | 'delete' | null;

export default function AdminUsersPage() {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const toast  = useToast();

  const [users,        setUsers]        = useState<UserRow[]>([]);
  const [dataLoading,  setDataLoading]  = useState(true);
  const [search,       setSearch]       = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'connected' | 'expired' | 'disconnected'>('all');
  const [actionUser,   setActionUser]   = useState<UserRow | null>(null);
  const [actionType,   setActionType]   = useState<ActionType>(null);
  const [actioning,    setActioning]    = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/auth/signin');
    if (!loading && user && role && role !== 'admin') router.push('/dashboard');
  }, [user, role, loading, router]);

  const loadUsers = useCallback(async () => {
    setDataLoading(true);
    try {
      const res = await fetch('/api/admin/data?q=users');
      if (res.ok) {
        const json = await res.json();
        setUsers(json.users ?? []);
      }
    } catch (err) {
      console.error('Admin users fetch error:', err);
    }
    setDataLoading(false);
  }, []);

  useEffect(() => {
    if (user && role === 'admin') loadUsers();
  }, [user, role, loadUsers]);

  if (loading || !user || role === null) {
    return <div className="page-bg min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  }

  const filtered = users.filter((u) => {
    const matchSearch = u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filterStatus === 'all' || u.connection_status === filterStatus;
    return matchSearch && matchFilter;
  });

  const openAction = (u: UserRow, type: ActionType) => {
    setActionUser(u);
    setActionType(type);
  };

  const handleAction = async () => {
    if (!actionUser || !actionType) return;
    setActioning(true);

    if (actionType === 'reauth') {
      await fetch(`/api/admin/reauth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: actionUser.id }),
      });
      toast.success('Re-auth email sent', `Re-authentication request sent to ${actionUser.email}`);

    } else if (actionType === 'disable') {
      const newActive = actionUser.status !== 'active';
      await supabase.from('profiles').update({ is_active: newActive }).eq('id', actionUser.id);
      setUsers((prev) => prev.map((u) => u.id === actionUser.id ? { ...u, status: newActive ? 'active' : 'disabled' } : u));
      toast.success(newActive ? 'User enabled' : 'User disabled', actionUser.email);

    } else if (actionType === 'delete') {
      await supabase.from('wearable_connections').delete().eq('user_id', actionUser.id);
      await supabase.from('weekly_reports').delete().eq('user_id', actionUser.id);
      await supabase.from('sync_logs').delete().eq('user_id', actionUser.id);
      await supabase.from('profiles').delete().eq('id', actionUser.id);
      setUsers((prev) => prev.filter((u) => u.id !== actionUser.id));
      toast.success('User deleted', `${actionUser.email} and all associated data removed.`);
    }

    setActioning(false);
    setActionUser(null);
    setActionType(null);
  };

  return (
    <div className="page-bg min-h-screen flex">
      <Sidebar variant="admin" />

      <main className="flex-1 min-w-0 overflow-hidden">
        {/* ── Page header ── */}
        <div className="px-6 lg:px-8 pt-8 pb-6 border-b" style={{ borderColor: 'rgba(200,150,100,0.08)' }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-100" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}>
                User Management
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                {users.length} registered · {users.filter((u) => u.connection_status === 'connected').length} with active connections
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 lg:px-8 py-7 space-y-5">

          {/* ── Filters toolbar ── */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
              <input
                type="text"
                className="input-field pl-9 text-sm py-2"
                placeholder="Search by email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-1.5">
              <Filter size={12} className="text-slate-600" />
              {(['all', 'connected', 'expired', 'disconnected'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterStatus(f)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all capitalize ${
                    filterStatus === f
                      ? 'bg-[rgba(235,114,27,0.12)] text-[#EB721B] border-[rgba(235,114,27,0.3)]'
                      : 'text-slate-500 border-[rgba(35,62,92,0.4)] hover:text-slate-300 hover:border-[rgba(37,107,151,0.4)]'
                  }`}
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* ── Users table ── */}
          <div className="glass-card rounded-2xl overflow-hidden">
            {dataLoading ? (
              <div className="flex items-center justify-center py-16"><Spinner size="lg" /></div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="table-header text-left">User</th>
                        <th className="table-header text-left">Provider</th>
                        <th className="table-header text-left">Connection</th>
                        <th className="table-header text-left">Last Sync</th>
                        <th className="table-header text-left">Joined</th>
                        <th className="table-header text-left">Status</th>
                        <th className="table-header text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((u) => (
                        <tr key={u.id} className="table-row">
                          <td className="table-cell">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 border" style={{ background: 'linear-gradient(135deg, #256B97, #03294E)', borderColor: 'rgba(37,107,151,0.3)', color: '#fff' }}>
                                {u.email.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-sm text-slate-200 truncate max-w-[180px]" style={{ fontFamily: "'Inter', sans-serif" }}>{u.email}</span>
                            </div>
                          </td>
                          <td className="table-cell capitalize">
                            {u.provider === 'none' ? <span className="text-slate-600">—</span> : <span className="text-slate-300">{u.provider}</span>}
                          </td>
                          <td className="table-cell">
                            {u.connection_status === 'connected'    && <span className="badge-success">Connected</span>}
                            {u.connection_status === 'expired'      && <span className="badge-warning">Expired</span>}
                            {u.connection_status === 'disconnected' && <span className="badge-error">Disconnected</span>}
                          </td>
                          <td className="table-cell text-slate-500 text-xs">{u.last_sync ? formatRelativeTime(u.last_sync) : '—'}</td>
                          <td className="table-cell text-slate-500 text-xs">{formatDate(u.created_at)}</td>
                          <td className="table-cell">
                            {u.status === 'active' ? <span className="badge-success">Active</span> : <span className="badge-error">Disabled</span>}
                          </td>
                          <td className="table-cell text-right">
                            <div className="flex items-center justify-end gap-1">
                              {(u.connection_status === 'expired' || u.connection_status === 'connected') && (
                                <button onClick={() => openAction(u, 'reauth')} className="btn-ghost text-xs px-2.5 py-1.5" title="Send re-auth email">
                                  <RefreshCw size={12} />
                                </button>
                              )}
                              <button onClick={() => openAction(u, 'disable')} className="btn-ghost text-xs px-2.5 py-1.5" title={u.status === 'active' ? 'Disable user' : 'Enable user'}>
                                <UserX size={12} />
                              </button>
                              <button onClick={() => openAction(u, 'delete')} className="btn-ghost text-xs px-2.5 py-1.5 hover:text-red-400" title="Delete user">
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filtered.length === 0 && (
                  <div className="py-16 text-center">
                    <p className="text-sm text-slate-600">No users match your filter.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Action modals */}
      <Modal
        open={!!actionUser && actionType === 'reauth'}
        onClose={() => { setActionUser(null); setActionType(null); }}
        title="Send re-authentication email"
        description={`Send a re-authentication request to ${actionUser?.email}. They will receive an email with instructions to reconnect their wearable.`}
      >
        <div className="flex gap-3 mt-6">
          <button onClick={() => { setActionUser(null); setActionType(null); }} className="btn-secondary flex-1 py-2.5">Cancel</button>
          <button onClick={handleAction} disabled={actioning} className="btn-primary flex-1 py-2.5">
            {actioning ? <Spinner size="sm" /> : 'Send Email'}
          </button>
        </div>
      </Modal>

      <Modal
        open={!!actionUser && actionType === 'disable'}
        onClose={() => { setActionUser(null); setActionType(null); }}
        title={actionUser?.status === 'active' ? 'Disable user account' : 'Enable user account'}
        description={
          actionUser?.status === 'active'
            ? `Disabling ${actionUser?.email} will prevent them from signing in. Wearable sync will be paused.`
            : `Re-enabling ${actionUser?.email} will restore full access.`
        }
      >
        <div className="flex gap-3 mt-6">
          <button onClick={() => { setActionUser(null); setActionType(null); }} className="btn-secondary flex-1 py-2.5">Cancel</button>
          <button onClick={handleAction} disabled={actioning} className={actionUser?.status === 'active' ? 'btn-danger flex-1 py-2.5' : 'btn-primary flex-1 py-2.5'}>
            {actioning ? <Spinner size="sm" /> : actionUser?.status === 'active' ? 'Disable User' : 'Enable User'}
          </button>
        </div>
      </Modal>

      <Modal
        open={!!actionUser && actionType === 'delete'}
        onClose={() => { setActionUser(null); setActionType(null); }}
        title="Delete user account"
        description={`Permanently delete ${actionUser?.email} and all associated data. This satisfies GDPR deletion requests and cannot be undone.`}
      >
        <div className="flex gap-3 mt-6">
          <button onClick={() => { setActionUser(null); setActionType(null); }} className="btn-secondary flex-1 py-2.5">Cancel</button>
          <button onClick={handleAction} disabled={actioning} className="btn-danger flex-1 py-2.5">
            {actioning ? <Spinner size="sm" /> : 'Delete User'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
