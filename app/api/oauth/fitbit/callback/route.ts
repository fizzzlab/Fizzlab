import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { encrypt } from '@/lib/encrypt';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code  = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error || !code || !state) {
    return NextResponse.redirect(`${APP_URL}/connect?error=fitbit_denied`);
  }

  let userId: string;
  let codeVerifier: string;
  try {
    const parsed = JSON.parse(Buffer.from(state, 'base64url').toString());
    userId       = parsed.userId;
    codeVerifier = parsed.codeVerifier;
  } catch {
    return NextResponse.redirect(`${APP_URL}/connect?error=invalid_state`);
  }

  const clientId     = process.env.FITBIT_CLIENT_ID!;
  const clientSecret = process.env.FITBIT_CLIENT_SECRET!;
  const redirectUri  = `${APP_URL}/api/oauth/fitbit/callback`;

  const tokenRes = await fetch('https://api.fitbit.com/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
    },
    body: new URLSearchParams({
      grant_type:    'authorization_code',
      code,
      redirect_uri:  redirectUri,
      code_verifier: codeVerifier,
    }),
  });

  if (!tokenRes.ok) {
    console.error('Fitbit token exchange failed:', await tokenRes.text());
    return NextResponse.redirect(`${APP_URL}/connect?error=fitbit_token_failed`);
  }

  const tokens = await tokenRes.json();

  const encryptedAccess  = encrypt(tokens.access_token);
  const encryptedRefresh = encrypt(tokens.refresh_token);
  const expiresAt        = new Date(Date.now() + tokens.expires_in * 1000).toISOString();

  const response = NextResponse.redirect(`${APP_URL}/connect?success=fitbit`);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { error: dbError } = await supabase
    .from('wearable_connections')
    .upsert(
      {
        user_id:               userId,
        provider:              'fitbit',
        status:                'connected',
        access_token_enc:      encryptedAccess,
        refresh_token_enc:     encryptedRefresh,
        token_expires_at:      expiresAt,
        provider_user_id:      tokens.user_id ?? null,
        scopes:                tokens.scope ?? null,
        last_sync_at:          null,
      },
      { onConflict: 'user_id,provider' }
    );

  if (dbError) {
    console.error('Supabase upsert error:', dbError.message);
    return NextResponse.redirect(`${APP_URL}/connect?error=db_error`);
  }

  return response;
}
