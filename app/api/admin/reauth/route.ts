import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { sendReauthEmail } from '@/lib/mailer';

function svc() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const supabase = svc();

    const { data: profile } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', userId)
      .single();

    if (!profile?.email) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { data: conn } = await supabase
      .from('wearable_connections')
      .select('provider')
      .eq('user_id', userId)
      .limit(1)
      .maybeSingle();

    const provider = conn?.provider ?? 'wearable';

    await sendReauthEmail(profile.email, profile.full_name ?? '', provider);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Admin reauth error:', err);
    return NextResponse.json({ error: 'Failed to send re-auth email' }, { status: 500 });
  }
}
