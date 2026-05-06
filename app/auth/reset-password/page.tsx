'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import Spinner from '@/components/ui/Spinner';
import { Eye, EyeOff, Check } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const toast  = useToast();

  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [ready, setReady] = useState(false);

  const rules = [
    { label: 'At least 8 characters',     test: (p: string) => p.length >= 8 },
    { label: 'Contains a number',         test: (p: string) => /\d/.test(p) },
    { label: 'Contains uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  ];

  useEffect(() => {
    let cancelled = false;

    async function prepareRecoverySession() {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');
        const tokenHash = url.searchParams.get('token_hash');
        const type = url.searchParams.get('type');
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        let errorMessage: string | null = null;

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) errorMessage = error.message;
        } else if (tokenHash && type === 'recovery') {
          const { error } = await supabase.auth.verifyOtp({
            type: 'recovery',
            token_hash: tokenHash,
          });
          if (error) errorMessage = error.message;
        } else if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) errorMessage = error.message;
        }

        if (errorMessage) {
          if (!cancelled) {
            toast.error('Reset link invalid', errorMessage);
            setReady(false);
          }
          return;
        }

        const { data } = await supabase.auth.getSession();
        if (!cancelled) {
          const hasSession = !!data.session;
          setReady(hasSession);
          if (!hasSession) {
            toast.error('Reset link invalid', 'Auth session missing. Please request a new reset email.');
          } else {
            window.history.replaceState({}, document.title, '/auth/reset-password');
          }
        }
      } catch {
        if (!cancelled) {
          toast.error('Reset link invalid', 'Please request a new password reset email.');
          setReady(false);
        }
      } finally {
        if (!cancelled) setInitializing(false);
      }
    }

    prepareRecoverySession();

    return () => {
      cancelled = true;
    };
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready) {
      toast.error('Reset link invalid', 'Please request a new password reset email.');
      return;
    }
    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      toast.error('Password too short', 'Minimum 8 characters required.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setLoading(false);
      toast.error('Reset failed', error.message);
    } else {
      toast.success('Password reset', 'Your new password has been set. Please sign in.');
      await supabase.auth.signOut();
      router.replace('/auth/signin');
      router.refresh();
      window.location.assign('/auth/signin');
    }
  };

  if (initializing) {
    return (
      <div className="page-bg min-h-screen flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="glass-card p-8 rounded-2xl border border-[rgba(35,62,92,0.5)] text-center">
            <div className="flex justify-center mb-4">
              <Spinner size="lg" />
            </div>
            <h1 className="text-xl font-semibold text-slate-100 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Preparing secure reset
            </h1>
            <p className="text-sm text-slate-500">
              Validating your reset link and starting a secure password reset session.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-bg min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#EB721B] to-[#C89664] flex items-center justify-center">
            <div className="w-3.5 h-3.5 rounded-sm bg-white/90" />
          </div>
          <span className="font-bold text-slate-100 text-base tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            PulseTrack
          </span>
        </div>

        <div className="glass-card p-8 rounded-2xl border border-[rgba(35,62,92,0.5)]">
          <div className="mb-7">
            <h1 className="text-xl font-semibold text-slate-100" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Set new password
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Choose a strong password for your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">New Password</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  className="input-field pr-10"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
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
              {password.length > 0 && (
                <div className="mt-2.5 space-y-1.5">
                  {rules.map((r) => {
                    const passed = r.test(password);
                    return (
                      <div key={r.label} className="flex items-center gap-2">
                        <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors ${passed ? 'bg-emerald-500/20 border border-emerald-500/40' : 'bg-slate-800 border border-slate-700'}`}>
                          {passed && <Check size={8} className="text-emerald-400" strokeWidth={3} />}
                        </div>
                        <span className={`text-xs transition-colors ${passed ? 'text-emerald-400' : 'text-slate-600'}`}
                          style={{ fontFamily: "'Inter', sans-serif" }}>
                          {r.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <label className="label">Confirm Password</label>
              <input
                type={showPwd ? 'text' : 'password'}
                className={`input-field ${confirm.length > 0 && confirm !== password ? 'border-red-500/40' : ''}`}
                placeholder="Repeat your password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
                required
              />
              {confirm.length > 0 && confirm !== password && (
                <p className="text-xs text-red-400 mt-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Passwords do not match
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !ready}
              className="btn-primary w-full py-2.5 mt-1"
            >
              {loading ? <Spinner size="sm" /> : 'Set New Password'}
            </button>
          </form>

          {!ready && (
            <p className="text-xs text-amber-400 mt-4" style={{ fontFamily: "'Inter', sans-serif" }}>
              This reset link is no longer valid. Request a new password reset email from sign in.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
