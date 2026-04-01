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
    return NextResponse.redirect(`${APP_URL}/connect?error=huawei_denied`);
  }

  let userId: string;
  try {
    userId = JSON.parse(Buffer.from(state, 'base64url').toString()).userId;
  } catch {
    return NextResponse.redirect(`${APP_URL}/connect?error=invalid_state`);
  }

  const clientId     = process.env.HUAWEI_CLIENT_ID!;
  const clientSecret = process.env.HUAWEI_CLIENT_SECRET!;
  const redirectUri  = `${APP_URL}/api/oauth/huawei/callback`;

  // Exchange authorization code for tokens
  const tokenRes = await fetch('https://oauth-login.cloud.huawei.com/oauth2/v3/token', {
    method:  'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type:    'authorization_code',
      client_id:     clientId,
      client_secret: clientSecret,
      code,
      redirect_uri:  redirectUri,
    }),
  });

  if (!tokenRes.ok) {
    console.error('Huawei token exchange failed:', await tokenRes.text());
    return NextResponse.redirect(`${APP_URL}/connect?error=huawei_token_failed`);
  }

  const tokens = await tokenRes.json();

  if (!tokens.access_token) {
    console.error('Huawei token empty:', tokens);
    return NextResponse.redirect(`${APP_URL}/connect?error=huawei_token_empty`);
  }

  const encryptedAccess  = encrypt(tokens.access_token);
  const encryptedRefresh = encrypt(tokens.refresh_token);
  const expiresAt        = new Date(Date.now() + tokens.expires_in * 1000).toISOString();

  const response = NextResponse.redirect(`${APP_URL}/connect?success=huawei`);

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
        provider:          'huawei',
        status:            'connected',
        access_token_enc:  encryptedAccess,
        refresh_token_enc: encryptedRefresh,
        token_expires_at:  expiresAt,
        provider_user_id:  tokens.union_id ?? tokens.open_id ?? null,
        scopes:            tokens.scope ?? null,
        last_sync_at:      null,
      },
      { onConflict: 'user_id,provider' }
    );

  if (dbError) {
    console.error('Supabase upsert error:', dbError.message);
    return NextResponse.redirect(`${APP_URL}/connect?error=db_error`);
  }

  return response;
}
