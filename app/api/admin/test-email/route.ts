import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import {
  sendAcknowledgementEmail,
  sendEncouragementEmail,
  sendReauthEmail,
} from '@/lib/mailer';

function svc() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  const { userId, type } = await request.json();

  if (!userId || !type) {
    return NextResponse.json({ error: 'Missing userId or type' }, { status: 400 });
  }

  const supabase = svc();

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, email, full_name')
    .eq('id', userId)
    .single();

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const to       = profile.email;
  const userName = profile.full_name ?? '';

  try {
    if (type === 'acknowledgement') {
      await sendAcknowledgementEmail(to, userName);
    } else if (type === 'encouragement') {
      await sendEncouragementEmail(to, userName, 85);
    } else if (type === 'reauth') {
      await sendReauthEmail(to, userName, 'Fitbit');
    } else {
      return NextResponse.json({ error: 'Unknown email type' }, { status: 400 });
    }
    return NextResponse.json({ ok: true, sentTo: to, type });
  } catch (err) {
    console.error('Test email error:', err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
