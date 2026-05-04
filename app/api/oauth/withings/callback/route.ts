import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { encrypt } from '@/lib/encrypt';
import { getServerAppUrl } from '@/lib/app-url';

export async function GET(request: NextRequest) {
  const appUrl = getServerAppUrl(request);
  const { searchParams } = new URL(request.url);
  const code  = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error || !code || !state) {
    return NextResponse.redirect(`${appUrl}/connect?error=withings_denied`);
  }

  let userId: string;
  try {
    userId = JSON.parse(Buffer.from(state, 'base64').toString()).userId;
  } catch {
    return NextResponse.redirect(`${appUrl}/connect?error=invalid_state`);
  }

  const clientId     = process.env.WITHINGS_CLIENT_ID!;
  const clientSecret = process.env.WITHINGS_CLIENT_SECRET!;
  const redirectUri  = `${appUrl}/api/oauth/withings/callback`;

  const tokenRes = await fetch('https://wbsapi.withings.net/v2/oauth2', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      action:        'requesttoken',
      grant_type:    'authorization_code',
      client_id:     clientId,
      client_secret: clientSecret,
      code,
      redirect_uri:  redirectUri,
    }),
  });

  if (!tokenRes.ok) {
    console.error('Withings token exchange failed:', await tokenRes.text());
    return NextResponse.redirect(`${appUrl}/connect?error=withings_token_failed`);
  }

  const body   = await tokenRes.json();
  const tokens = body.body;

  if (!tokens?.access_token) {
    console.error('Withings token missing:', body);
    return NextResponse.redirect(`${appUrl}/connect?error=withings_token_empty`);
  }

  const encryptedAccess  = encrypt(tokens.access_token);
  const encryptedRefresh = encrypt(tokens.refresh_token);
  const expiresAt        = new Date(Date.now() + tokens.expires_in * 1000).toISOString();

  const response = NextResponse.redirect(`${appUrl}/connect?success=withings`);

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
        user_id:           userId,
        provider:          'withings',
        status:            'connected',
        access_token_enc:  encryptedAccess,
        refresh_token_enc: encryptedRefresh,
        token_expires_at:  expiresAt,
        provider_user_id:  String(tokens.userid ?? ''),
        scopes:            tokens.scope ?? null,
        last_sync_at:      null,
      },
      { onConflict: 'user_id,provider' }
    );

  if (dbError) {
    console.error('Supabase upsert error:', dbError.message);
    return NextResponse.redirect(`${appUrl}/connect?error=db_error`);
  }

  return response;
}
