'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import Spinner from '@/components/ui/Spinner';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const toast  = useToast();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);

  const valid = email.length > 0 && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Missing fields', 'Please enter your email and password.'); return; }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) toast.error('Sign in failed', error.message);
    else { toast.success('Welcome back'); router.push('/dashboard'); }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden" style={{ background: '#060D18' }}>

      {/* ── Ambient background ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-30%] left-[50%] -translate-x-1/2 w-[900px] h-[600px] opacity-[0.12]" style={{ background: 'radial-gradient(ellipse, #EB721B, transparent 70%)' }} />
        <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] opacity-[0.06]" style={{ background: 'radial-gradient(ellipse, #256B97, transparent 70%)' }} />
        <div className="absolute top-[50%] right-[10%] w-[400px] h-[400px] opacity-[0.04]" style={{ background: 'radial-gradient(ellipse, #C89664, transparent 70%)' }} />
      </div>

      {/* ── Logo ── */}
      <div className="relative z-10 flex items-center gap-2.5 mb-10">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #EB721B, #C89664)', boxShadow: '0 0 30px rgba(235,114,27,0.25)' }}>
          <div className="w-3.5 h-3.5 rounded-[4px] bg-white/90" />
        </div>
        <span className="font-bold text-white text-lg tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>PulseTrack</span>
      </div>

      {/* ── Card ── */}
      <div className="relative z-10 w-full max-w-[420px]">
        <div className="rounded-2xl p-8 sm:p-10" style={{
          background: 'linear-gradient(160deg, rgba(10,20,38,0.95) 0%, rgba(6,13,24,0.98) 100%)',
          border: '1px solid rgba(200,150,100,0.1)',
          boxShadow: '0 25px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03) inset',
        }}>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}>
              Welcome back
            </h1>
            <p className="text-sm text-slate-500">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1.5 uppercase tracking-widest" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Email</label>
              <input
                type="email"
                className="w-full rounded-lg px-3.5 py-2.5 text-sm text-slate-200 placeholder:text-slate-700 outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(200,150,100,0.35)'; e.target.style.boxShadow = '0 0 0 3px rgba(200,150,100,0.07)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-medium text-slate-500 uppercase tracking-widest" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Password</label>
                <Link href="/auth/forgot-password" className="text-[11px] text-slate-600 hover:text-slate-400 transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  className="w-full rounded-lg px-3.5 py-2.5 pr-10 text-sm text-slate-200 placeholder:text-slate-700 outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(200,150,100,0.35)'; e.target.style.boxShadow = '0 0 0 3px rgba(200,150,100,0.07)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors">
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !valid}
              className="w-full py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed group mt-2"
              style={{
                background: valid ? 'linear-gradient(135deg, #EB721B 0%, #d4620f 100%)' : 'rgba(235,114,27,0.15)',
                color: valid ? '#fff' : 'rgba(235,114,27,0.5)',
                border: valid ? '1px solid rgba(235,114,27,0.5)' : '1px solid rgba(235,114,27,0.1)',
                fontFamily: "'Space Grotesk', sans-serif",
                boxShadow: valid ? '0 4px 24px rgba(235,114,27,0.25)' : 'none',
              }}
              onMouseEnter={(e) => { if (valid) e.currentTarget.style.boxShadow = '0 6px 32px rgba(235,114,27,0.35)'; }}
              onMouseLeave={(e) => { if (valid) e.currentTarget.style.boxShadow = '0 4px 24px rgba(235,114,27,0.25)'; }}
            >
              {loading ? <Spinner size="sm" /> : <>Sign in <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" /></>}
            </button>
          </form>
        </div>

        {/* Sign up */}
        <p className="text-center text-sm text-slate-600 mt-7">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-slate-400 hover:text-white transition-colors font-medium">Create one free</Link>
        </p>
      </div>

      {/* ── Footer ── */}
      <div className="relative z-10 mt-10 flex items-center gap-4 text-[10px] text-slate-700 uppercase tracking-wider" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        <span>Encrypted</span>
        <span className="w-1 h-1 rounded-full bg-slate-800" />
        <span>GDPR compliant</span>
        <span className="w-1 h-1 rounded-full bg-slate-800" />
        <span>Behavioural data only</span>
      </div>
    </div>
  );
}
