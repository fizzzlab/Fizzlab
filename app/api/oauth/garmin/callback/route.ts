import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createHash } from 'crypto';
import { encrypt, decrypt } from '@/lib/encrypt';
import { getAccessToken } from '@/lib/garmin-oauth';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const oauthToken    = searchParams.get('oauth_token');
  const oauthVerifier = searchParams.get('oauth_verifier');

  if (!oauthToken || !oauthVerifier) {
    return NextResponse.redirect(`${APP_URL}/connect?error=garmin_denied`);
  }

  // Retrieve state from encrypted cookie
  const stateCookie = request.cookies.get('garmin_oauth_state')?.value;
  if (!stateCookie) {
    return NextResponse.redirect(`${APP_URL}/connect?error=invalid_state`);
  }

  let userId: string;
  let tokenSecret: string;
  try {
    const parsed = JSON.parse(decrypt(stateCookie));
    userId       = parsed.userId;
    tokenSecret  = parsed.tokenSecret;
  } catch {
    return NextResponse.redirect(`${APP_URL}/connect?error=invalid_state`);
  }

  // Exchange for access token
  let accessToken: string;
  let accessTokenSecret: string;
  try {
    const result    = await getAccessToken(oauthToken, tokenSecret, oauthVerifier);
    accessToken     = result.oauth_token;
    accessTokenSecret = result.oauth_token_secret;
  } catch (err) {
    console.error('Garmin token exchange failed:', (err as Error).message);
    return NextResponse.redirect(`${APP_URL}/connect?error=garmin_token_failed`);
  }

  // Encrypt both tokens for storage
  const encryptedAccess  = encrypt(accessToken);
  const encryptedSecret  = encrypt(accessTokenSecret);

  // For Garmin, we store a SHA-256 hash of the access token as provider_user_id.
  // The webhook uses this hash to look up which user a push belongs to.
  const tokenHash = createHash('sha256').update(accessToken).digest('hex');

  // Garmin OAuth 1.0a tokens don't expire — set a far-future date
  const expiresAt = new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000).toISOString();

  const response = NextResponse.redirect(`${APP_URL}/connect?success=garmin`);

  // Clear the temporary cookie
  response.cookies.set('garmin_oauth_state', '', { maxAge: 0, path: '/' });

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
        provider:          'garmin',
        status:            'connected',
        access_token_enc:  encryptedAccess,
        refresh_token_enc: encryptedSecret,   // stores the OAuth 1.0a token secret
        token_expires_at:  expiresAt,
        provider_user_id:  tokenHash,         // SHA-256 hash for webhook lookup
        scopes:            'dailies,sleeps,activities',
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
