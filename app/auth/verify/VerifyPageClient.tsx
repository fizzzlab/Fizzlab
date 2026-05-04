'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import { getBrowserAppUrl } from '@/lib/app-url';
import Spinner from '@/components/ui/Spinner';

export default function VerifyPageClient({ email }: { email: string }) {
  const router = useRouter();
  const toast = useToast();
  const [resending, setResending] = useState(false);

  const handleResend = async () => {
    if (!email) {
      toast.error('Email missing', 'Go back to sign up and enter your email again.');
      return;
    }

    setResending(true);
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${getBrowserAppUrl()}/auth/callback`,
      },
    });
    setResending(false);

    if (error) {
      toast.error('Resend failed', error.message);
      return;
    }

    toast.success('Verification email resent', 'Please use the newest email link.');
  };

  return (
    <div className="page-bg min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#EB721B] to-[#C89664] flex items-center justify-center">
            <div className="w-3.5 h-3.5 rounded-sm bg-white/90" />
          </div>
          <span className="font-bold text-slate-100 text-base tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            PulseTrack
          </span>
        </div>

        <div className="glass-card p-10 rounded-2xl border border-[rgba(35,62,92,0.5)]">
          <div className="w-14 h-14 rounded-2xl bg-[rgba(37,107,151,0.12)] border border-[rgba(37,107,151,0.2)] flex items-center justify-center mx-auto mb-6">
            <div className="w-6 h-6 rounded-full border-2 border-[#256B97] border-t-transparent animate-spin" />
          </div>

          <h1 className="text-xl font-semibold text-slate-100 mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Verify your email
          </h1>

          <p className="text-sm text-slate-400 leading-relaxed mb-8">
            We&apos;ve sent a verification link to your inbox. Click the link in the email to
            activate your account. The link expires in 24 hours.
          </p>

          {email && (
            <p className="text-xs text-slate-500 mb-6">
              Verification email for <span className="text-slate-300">{email}</span>
            </p>
          )}

          <div className="glass rounded-xl p-4 mb-6 text-left border border-[rgba(35,62,92,0.4)]">
            <p className="section-title mb-2">What happens next?</p>
            <ul className="space-y-2">
              {[
                'Click the link in your verification email',
                'You will be redirected back to sign in',
                'Connect your wearable via OAuth',
                'Weekly processing begins automatically',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-slate-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <span className="flex-shrink-0 w-4 h-4 rounded-full bg-[rgba(235,114,27,0.12)] border border-[rgba(235,114,27,0.2)] flex items-center justify-center text-[10px] font-semibold text-[#EB721B] mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <button onClick={handleResend} disabled={resending || !email} className="btn-primary text-sm px-6 py-2.5 w-full justify-center">
              {resending ? <Spinner size="sm" /> : 'Resend verification email'}
            </button>

            <button onClick={() => router.push('/auth/signup')} className="btn-secondary text-sm px-6 py-2.5 w-full justify-center">
              Use a different email
            </button>

            <Link href="/auth/signin" className="btn-secondary text-sm px-6 py-2.5 w-full justify-center">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
