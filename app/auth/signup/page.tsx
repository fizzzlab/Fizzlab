'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import { getBrowserAppUrl } from '@/lib/app-url';
import Spinner from '@/components/ui/Spinner';
import { Eye, EyeOff, Check, ArrowRight, ChevronDown } from 'lucide-react';

const pwdRules = [
  { label: '8+ chars',   test: (p: string) => p.length >= 8 },
  { label: 'Number',     test: (p: string) => /\d/.test(p) },
  { label: 'Uppercase',  test: (p: string) => /[A-Z]/.test(p) },
];

export default function SignUpPage() {
  const router = useRouter();
  const toast  = useToast();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [gender,   setGender]   = useState('');
  const [dob,      setDob]      = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [agreed,   setAgreed]   = useState(false);

  const passed = pwdRules.filter((r) => r.test(password)).length;
  const valid  = passed === 3 && confirm === password && agreed && email.length > 0 && gender.length > 0 && dob.length > 0;

  const redirectToVerify = () => {
    router.push(`/auth/verify?email=${encodeURIComponent(email)}`);
  };

  const resendVerification = async () => {
    return supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${getBrowserAppUrl()}/auth/callback`,
      },
    });
  };

  const looksLikeExistingMaskedUser = (user: User | null) => {
    const identities = user?.identities ?? [];
    return identities.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) { toast.error('Terms required', 'Please accept the terms.'); return; }
    if (password !== confirm) { toast.error('Mismatch', 'Passwords do not match.'); return; }
    if (password.length < 8) { toast.error('Weak password', 'Minimum 8 characters.'); return; }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${getBrowserAppUrl()}/auth/callback`,
        data: { gender, date_of_birth: dob },
      },
    });

    if (error) {
      const alreadyExists = /already registered|already been registered|user already exists|email.*registered/i.test(error.message);
      if (!alreadyExists) {
        setLoading(false);
        toast.error('Registration failed', error.message);
        return;
      }

      const { error: resendError } = await resendVerification();
      setLoading(false);

      if (resendError) {
        toast.error('Verification email not resent', resendError.message);
        return;
      }

      toast.success('Verification email resent', 'This email already exists but is not verified yet.');
      redirectToVerify();
      return;
    }

    if (looksLikeExistingMaskedUser(data.user)) {
      const { error: resendError } = await resendVerification();
      setLoading(false);

      if (resendError) {
        toast.error('Verification email not resent', resendError.message);
        return;
      }

      toast.success('Verification email resent', 'Use the latest email link to activate your account.');
      redirectToVerify();
      return;
    }

    setLoading(false);
    toast.success('Account created', 'Check your email to verify.');
    redirectToVerify();
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
              Get started free
            </h1>
            <p className="text-sm text-slate-500">No credit card required</p>
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

            {/* Gender + DOB row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1.5 uppercase tracking-widest" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Gender</label>
                <div className="relative">
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                    className="w-full rounded-lg px-3.5 py-2.5 text-sm text-slate-200 outline-none transition-all appearance-none cursor-pointer"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: gender ? undefined : '#334155' }}
                    onFocus={(e) => { e.target.style.borderColor = 'rgba(200,150,100,0.35)'; e.target.style.boxShadow = '0 0 0 3px rgba(200,150,100,0.07)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                  >
                    <option value="" disabled>Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1.5 uppercase tracking-widest" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Date of birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full rounded-lg px-3.5 py-2.5 text-sm text-slate-200 outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', colorScheme: 'dark' }}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(200,150,100,0.35)'; e.target.style.boxShadow = '0 0 0 3px rgba(200,150,100,0.07)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1.5 uppercase tracking-widest" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Password</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  className="w-full rounded-lg px-3.5 py-2.5 pr-10 text-sm text-slate-200 placeholder:text-slate-700 outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(200,150,100,0.35)'; e.target.style.boxShadow = '0 0 0 3px rgba(200,150,100,0.07)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors">
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="flex items-center gap-1.5 mt-2.5">
                  <div className="flex gap-[3px] flex-1">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="h-[3px] flex-1 rounded-full transition-all duration-300" style={{
                        background: passed > i
                          ? passed === 3 ? '#10b981' : passed === 2 ? '#C89664' : '#ef4444'
                          : 'rgba(255,255,255,0.06)',
                      }} />
                    ))}
                  </div>
                  <span className="text-[10px] ml-1.5 flex-shrink-0" style={{
                    color: passed === 3 ? '#10b981' : passed === 2 ? '#C89664' : '#ef4444',
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}>
                    {passed === 3 ? 'Strong' : passed === 2 ? 'Fair' : 'Weak'}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm */}
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1.5 uppercase tracking-widest" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Confirm</label>
              <input
                type={showPwd ? 'text' : 'password'}
                className="w-full rounded-lg px-3.5 py-2.5 text-sm text-slate-200 placeholder:text-slate-700 outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${confirm.length > 0 && confirm !== password ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.08)'}`,
                }}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(200,150,100,0.35)'; e.target.style.boxShadow = '0 0 0 3px rgba(200,150,100,0.07)'; }}
                onBlur={(e) => { e.target.style.borderColor = confirm !== password && confirm.length > 0 ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                placeholder="Repeat password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
                required
              />
              {confirm.length > 0 && confirm === password && (
                <div className="flex items-center gap-1 mt-1.5">
                  <Check size={11} className="text-emerald-500" strokeWidth={3} />
                  <span className="text-[10px] text-emerald-500">Match</span>
                </div>
              )}
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2.5 cursor-pointer group pt-1">
              <button
                type="button"
                onClick={() => setAgreed(!agreed)}
                className={`mt-[1px] w-4 h-4 rounded flex-shrink-0 border transition-all flex items-center justify-center ${
                  agreed ? 'bg-[#EB721B] border-[#EB721B]' : 'border-slate-700 bg-transparent group-hover:border-slate-500'
                }`}
              >
                {agreed && <Check size={10} className="text-white" strokeWidth={3} />}
              </button>
              <span className="text-[12px] text-slate-600 leading-relaxed">
                I agree to the{' '}
                <Link href="/terms" className="text-slate-500 underline underline-offset-2 hover:text-slate-300 transition-colors">terms</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-slate-500 underline underline-offset-2 hover:text-slate-300 transition-colors">privacy policy</Link>.
                {' '}No physiological data collected.
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !valid}
              className="w-full py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed group"
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
              {loading ? <Spinner size="sm" /> : <>Create account <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" /></>}
            </button>
          </form>
        </div>

        {/* Sign in */}
        <p className="text-center text-sm text-slate-600 mt-7">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-slate-400 hover:text-white transition-colors font-medium">Sign in</Link>
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
