'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import { getBrowserAppUrl } from '@/lib/app-url';
import Spinner from '@/components/ui/Spinner';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const toast = useToast();
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toast.error('Email required'); return; }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${getBrowserAppUrl()}/auth/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast.error('Request failed', error.message);
    } else {
      setSent(true);
      toast.success('Reset email sent', 'Check your inbox for reset instructions.');
    }
  };

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
          {sent ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-2xl bg-[rgba(37,107,151,0.15)] border border-[rgba(37,107,151,0.25)] flex items-center justify-center mx-auto mb-4">
                <div className="w-5 h-5 rounded border-2 border-[#256B97] border-t-transparent animate-spin" />
              </div>
              <h2 className="text-lg font-semibold text-slate-100 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Check your inbox
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                A password reset link has been sent to <span className="text-slate-300 font-medium">{email}</span>.
                The link expires in 1 hour.
              </p>
              <Link href="/auth/signin" className="btn-secondary text-sm px-6 py-2">
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-7">
                <h1 className="text-xl font-semibold text-slate-100" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Reset your password
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Enter your email and we&apos;ll send a secure reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="label">Email Address</label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-2.5"
                >
                  {loading ? <Spinner size="sm" /> : 'Send Reset Link'}
                </button>
              </form>

              <div className="divider" />

              <Link
                href="/auth/signin"
                className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <ArrowLeft size={14} />
                Back to Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
