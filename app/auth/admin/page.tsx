'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import Spinner from '@/components/ui/Spinner';
import { Eye, EyeOff, Shield, AlertTriangle } from 'lucide-react';

export default function AdminSignInPage() {
  const router = useRouter();
  const toast  = useToast();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Missing fields', 'Email and password are required.');
      return;
    }
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user) {
      setLoading(false);
      toast.error('Access denied', error?.message ?? 'Authentication failed.');
      return;
    }

    let roleValue: string | null = null;
    try {
      const res = await fetch('/api/admin/check-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: data.user.id }),
      });
      const json = await res.json();
      roleValue = json?.role ?? null;
    } catch {
      roleValue = null;
    }

    if (roleValue !== 'admin') {
      await supabase.auth.signOut();
      setLoading(false);
      toast.error('Access denied', 'This portal is restricted to administrators.');
      return;
    }

    toast.success('Access granted', 'Welcome to the admin console.');
    router.refresh();
    router.push('/admin');
  };

  return (
    <div className="page-bg min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">

        {/* Logo + badge */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#EB721B] to-[#C89664] flex items-center justify-center shadow-lg shadow-[rgba(235,114,27,0.25)]">
              <Shield size={24} className="text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#010E22]" />
          </div>
          <div className="text-center">
            <p className="font-bold text-slate-100 text-base tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              PulseTrack
            </p>
            <p className="text-[11px] font-semibold text-[#EB721B] tracking-widest uppercase mt-0.5">
              Admin Console
            </p>
          </div>
        </div>

        <div className="glass-card p-8 rounded-2xl border border-[rgba(235,114,27,0.2)]" style={{ boxShadow: '0 0 40px rgba(235,114,27,0.06)' }}>

          {/* Warning banner */}
          <div className="flex items-start gap-2.5 mb-6 p-3.5 rounded-xl bg-[rgba(235,114,27,0.07)] border border-[rgba(235,114,27,0.18)]">
            <AlertTriangle size={14} className="text-[#EB721B] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-400 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              Restricted access. This portal is for authorised administrators only. Unauthorised access attempts are logged.
            </p>
          </div>

          <div className="mb-6">
            <h1 className="text-lg font-semibold text-slate-100" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Administrator Sign In
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Enter your admin credentials to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Admin Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  className="input-field pr-10"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mt-2 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
              style={{
                background: loading
                  ? 'rgba(235,114,27,0.3)'
                  : 'linear-gradient(135deg, #EB721B, #C89664)',
                color: 'white',
                fontFamily: "'Space Grotesk', sans-serif",
                boxShadow: loading ? 'none' : '0 4px 20px rgba(235,114,27,0.3)',
              }}
            >
              {loading ? <Spinner size="sm" /> : <><Shield size={14} /> Access Console</>}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-700 mt-6">
          Not an admin?{' '}
          <a href="/auth/signin" className="text-slate-600 hover:text-slate-400 transition-colors underline underline-offset-2">
            Go to regular sign in
          </a>
        </p>

      </div>
    </div>
  );
}
