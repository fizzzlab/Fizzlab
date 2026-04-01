'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { supabase } from '@/lib/supabase';
import Sidebar from '@/components/layout/Sidebar';
import Modal from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';
import { formatDate } from '@/lib/utils';
import { User, Trash2, KeyRound, Bell, Lock, Mail, CalendarDays, Shield, Download, Eye, EyeOff, Check, Flame } from 'lucide-react';

export default function AccountPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const toast  = useToast();

  const [savingPwd,       setSavingPwd]       = useState(false);
  const [savingPrefs,     setSavingPrefs]     = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm,   setDeleteConfirm]   = useState('');

  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd,     setNewPwd]     = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showPwd,    setShowPwd]    = useState(false);

  const [emailPrefs, setEmailPrefs] = useState({
    acknowledgement: true,
    encouragement:   true,
    reauth:          true,
  });

  useEffect(() => {
    if (!loading && !user) router.push('/auth/signin');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('profiles')
      .select('email_weekly_report, email_reauth_alerts')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setEmailPrefs({
            acknowledgement: data.email_weekly_report ?? true,
            encouragement:   data.email_weekly_report ?? true,
            reauth:          data.email_reauth_alerts ?? true,
          });
        }
      });
  }, [user]);

  if (loading || !user) {
    return <div className="page-bg min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPwd !== confirmPwd) { toast.error('Passwords do not match'); return; }
    if (newPwd.length < 8) { toast.error('Password too short', 'Minimum 8 characters required.'); return; }
    setSavingPwd(true);
    const { error } = await supabase.auth.updateUser({ password: newPwd });
    setSavingPwd(false);
    if (error) toast.error('Update failed', error.message);
    else { toast.success('Password updated'); setCurrentPwd(''); setNewPwd(''); setConfirmPwd(''); }
  };

  const handleSavePrefs = async () => {
    if (!user) return;
    setSavingPrefs(true);
    const { error } = await supabase.from('profiles').update({ email_weekly_report: emailPrefs.acknowledgement, email_reauth_alerts: emailPrefs.reauth }).eq('id', user.id);
    setSavingPrefs(false);
    if (error) toast.error('Save failed', error.message);
    else toast.success('Preferences saved');
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') { toast.error('Confirmation required', 'Type DELETE to confirm.'); return; }
    setDeletingAccount(true);
    try {
      await supabase.from('sync_logs').delete().eq('user_id', user.id);
      await supabase.from('weekly_reports').delete().eq('user_id', user.id);
      await supabase.from('wearable_connections').delete().eq('user_id', user.id);
      await supabase.from('profiles').delete().eq('id', user.id);
      toast.success('Account deleted');
    } catch {
      toast.error('Deletion failed'); setDeletingAccount(false); return;
    }
    setDeletingAccount(false); setShowDeleteModal(false);
    await signOut(); router.push('/');
  };

  const toggleItems = [
    { key: 'acknowledgement' as const, icon: Check,  color: '#10b981', label: 'Sync confirmations', desc: 'Get notified when weekly data sync completes.' },
    { key: 'encouragement'   as const, icon: Flame,  color: '#EB721B', label: 'Consistency nudges',  desc: 'Receive encouragement when you hit targets.' },
    { key: 'reauth'          as const, icon: Shield,  color: '#256B97', label: 'Connection alerts',   desc: 'Get alerted when a wearable token expires.' },
  ];

  return (
    <div className="page-bg min-h-screen flex">
      <Sidebar variant="user" />

      <main className="flex-1 min-w-0 overflow-hidden">
        {/* Page header */}
        <div className="px-6 lg:px-8 pt-8 pb-6 border-b" style={{ borderColor: 'rgba(200,150,100,0.08)' }}>
          <h1 className="text-2xl font-bold text-slate-100" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}>
            Settings
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage your account, security, and notification preferences.</p>
        </div>

        <div className="px-6 lg:px-8 py-7">
          {/* ── Top row: Profile + Security side by side ── */}
          <div className="grid lg:grid-cols-2 gap-5 mb-5">

            {/* Profile card */}
            <div className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(145deg, rgba(2,28,59,0.75), rgba(3,41,78,0.55))', border: '1px solid rgba(200,150,100,0.1)' }}>
              <div className="px-6 py-4 border-b flex items-center gap-3" style={{ borderColor: 'rgba(200,150,100,0.08)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(235,114,27,0.1)', border: '1px solid rgba(235,114,27,0.2)' }}>
                  <User size={14} style={{ color: '#EB721B' }} />
                </div>
                <h2 className="font-semibold text-slate-100 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Profile</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0" style={{ background: 'linear-gradient(135deg, #256B97, #03294E)', border: '2px solid rgba(200,150,100,0.2)', color: '#C89664' }}>
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">{user.email}</p>
                    <p className="text-xs text-slate-600 mt-0.5">Member since {user.created_at ? formatDate(user.created_at) : '—'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl" style={{ background: 'rgba(1,14,34,0.3)', border: '1px solid rgba(200,150,100,0.06)' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <Mail size={11} className="text-slate-600" />
                      <p className="text-[10px] uppercase tracking-widest text-slate-600" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Email</p>
                    </div>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  </div>
                  <div className="p-3 rounded-xl" style={{ background: 'rgba(1,14,34,0.3)', border: '1px solid rgba(200,150,100,0.06)' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <CalendarDays size={11} className="text-slate-600" />
                      <p className="text-[10px] uppercase tracking-widest text-slate-600" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Joined</p>
                    </div>
                    <p className="text-xs text-slate-400">{user.created_at ? formatDate(user.created_at) : '—'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Security card */}
            <div className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(145deg, rgba(2,28,59,0.75), rgba(3,41,78,0.55))', border: '1px solid rgba(200,150,100,0.1)' }}>
              <div className="px-6 py-4 border-b flex items-center gap-3" style={{ borderColor: 'rgba(200,150,100,0.08)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(37,107,151,0.1)', border: '1px solid rgba(37,107,151,0.2)' }}>
                  <KeyRound size={14} style={{ color: '#256B97' }} />
                </div>
                <h2 className="font-semibold text-slate-100 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Change password</h2>
              </div>
              <form onSubmit={handlePasswordChange} className="p-6 space-y-3">
                <div>
                  <label className="block text-[10px] font-medium text-slate-500 mb-1 uppercase tracking-widest" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Current</label>
                  <div className="relative">
                    <input type={showPwd ? 'text' : 'password'} className="input-field pr-10 text-sm" placeholder="Current password" value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)} />
                    <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors">
                      {showPwd ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-medium text-slate-500 mb-1 uppercase tracking-widest" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>New</label>
                    <input type={showPwd ? 'text' : 'password'} className="input-field text-sm" placeholder="Min. 8 chars" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-slate-500 mb-1 uppercase tracking-widest" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Confirm</label>
                    <input type={showPwd ? 'text' : 'password'} className={`input-field text-sm ${confirmPwd && confirmPwd !== newPwd ? 'border-red-500/40' : ''}`} placeholder="Repeat" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} />
                  </div>
                </div>
                <div className="flex justify-end pt-1">
                  <button type="submit" disabled={savingPwd || !newPwd || !confirmPwd} className="btn-primary text-xs px-5 py-2">
                    {savingPwd ? <Spinner size="sm" /> : 'Update password'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* ── Notifications — full width ── */}
          <div className="rounded-2xl overflow-hidden mb-5" style={{ background: 'linear-gradient(145deg, rgba(2,28,59,0.75), rgba(3,41,78,0.55))', border: '1px solid rgba(200,150,100,0.1)' }}>
            <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'rgba(200,150,100,0.08)' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(200,150,100,0.1)', border: '1px solid rgba(200,150,100,0.2)' }}>
                  <Bell size={14} style={{ color: '#C89664' }} />
                </div>
                <h2 className="font-semibold text-slate-100 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Email notifications</h2>
              </div>
              <button onClick={handleSavePrefs} disabled={savingPrefs} className="btn-secondary text-xs px-4 py-1.5">
                {savingPrefs ? <Spinner size="sm" /> : 'Save changes'}
              </button>
            </div>
            <div className="grid sm:grid-cols-3 divide-x" style={{ borderColor: 'rgba(200,150,100,0.06)' }}>
              {toggleItems.map(({ key, icon: Icon, color, label, desc }) => (
                <div key={key} className="px-6 py-5 flex flex-col justify-between gap-4">
                  <div>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
                      <Icon size={16} style={{ color }} />
                    </div>
                    <p className="text-sm font-medium text-slate-200 mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{label}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{desc}</p>
                  </div>
                  <button
                    onClick={() => setEmailPrefs((p) => ({ ...p, [key]: !p[key] }))}
                    className="self-start relative rounded-full transition-colors"
                    style={{
                      height: 24, width: 44,
                      background: emailPrefs[key] ? color : 'rgba(35,62,92,0.6)',
                      border: `1px solid ${emailPrefs[key] ? color + '80' : 'rgba(35,62,92,0.8)'}`,
                    }}
                  >
                    <div className={`absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${emailPrefs[key] ? 'translate-x-[23px]' : 'translate-x-[3px]'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ── Privacy & Danger zone side by side ── */}
          <div className="grid lg:grid-cols-5 gap-5">

            {/* Privacy — wider */}
            <div className="lg:col-span-3 rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(145deg, rgba(2,28,59,0.75), rgba(3,41,78,0.55))', border: '1px solid rgba(200,150,100,0.1)' }}>
              <div className="px-6 py-4 border-b flex items-center gap-3" style={{ borderColor: 'rgba(200,150,100,0.08)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(37,107,151,0.1)', border: '1px solid rgba(37,107,151,0.2)' }}>
                  <Lock size={14} style={{ color: '#256B97' }} />
                </div>
                <h2 className="font-semibold text-slate-100 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Privacy &amp; data rights</h2>
              </div>
              <div className="p-6">
                <p className="text-sm text-slate-500 leading-relaxed mb-5">
                  Only behavioural metrics are processed in pseudonymous form. Under GDPR you can request access, rectification, or deletion of all personal data at any time. No physiological data is ever collected.
                </p>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { label: 'Data scope', value: 'Behavioural only' },
                    { label: 'Storage', value: 'AES-256 encrypted' },
                    { label: 'Compliance', value: 'GDPR ready' },
                  ].map((item) => (
                    <div key={item.label} className="p-3 rounded-xl text-center" style={{ background: 'rgba(1,14,34,0.3)', border: '1px solid rgba(200,150,100,0.06)' }}>
                      <p className="text-[10px] uppercase tracking-widest text-slate-600 mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{item.label}</p>
                      <p className="text-xs text-slate-400 font-medium">{item.value}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => toast.success('Export requested', 'You will receive your data via email within 72 hours.')}
                  className="btn-secondary text-sm px-5 py-2.5"
                >
                  <Download size={13} /> Export my data
                </button>
              </div>
            </div>

            {/* Danger zone — narrower */}
            <div className="lg:col-span-2 rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(145deg, rgba(2,28,59,0.75), rgba(3,41,78,0.55))', border: '1px solid rgba(185,28,28,0.15)' }}>
              <div className="px-6 py-4 border-b flex items-center gap-3" style={{ borderColor: 'rgba(185,28,28,0.1)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(185,28,28,0.1)', border: '1px solid rgba(185,28,28,0.2)' }}>
                  <Trash2 size={14} style={{ color: '#ef4444' }} />
                </div>
                <h2 className="font-semibold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#fca5a5' }}>Danger zone</h2>
              </div>
              <div className="p-6">
                <p className="text-sm text-slate-500 leading-relaxed mb-4">
                  Permanently delete your account, all connections, sync history, and personal data. This cannot be undone.
                </p>
                <button onClick={() => setShowDeleteModal(true)} className="btn-danger text-sm px-5 py-2.5 w-full">
                  <Trash2 size={13} /> Delete my account
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Delete modal */}
      <Modal
        open={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setDeleteConfirm(''); }}
        title="Delete your account"
        description="This is irreversible. All data will be permanently deleted within 30 days per GDPR."
      >
        <div className="mt-2">
          <label className="block text-[11px] font-medium text-slate-500 mb-1.5 uppercase tracking-widest" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Type DELETE to confirm</label>
          <input type="text" className="input-field" placeholder="DELETE" value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)} />
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={() => { setShowDeleteModal(false); setDeleteConfirm(''); }} className="btn-secondary flex-1 py-2.5">Cancel</button>
          <button onClick={handleDeleteAccount} disabled={deletingAccount || deleteConfirm !== 'DELETE'} className="btn-danger flex-1 py-2.5">
            {deletingAccount ? <Spinner size="sm" /> : 'Delete account'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
