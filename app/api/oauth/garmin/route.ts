import { NextRequest, NextResponse } from 'next/server';
import { getRequestToken } from '@/lib/garmin-oauth';
import { encrypt } from '@/lib/encrypt';
import { getServerAppUrl } from '@/lib/app-url';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');

  if (!userId) {
    return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });
  }

  const callbackUrl = `${getServerAppUrl(request)}/api/oauth/garmin/callback`;

  const { oauth_token, oauth_token_secret } = await getRequestToken(callbackUrl);

  // Store token secret + userId in an encrypted httpOnly cookie
  // so the callback can retrieve them (OAuth 1.0a requires the
  // request token secret to exchange for an access token).
  const statePayload = JSON.stringify({ userId, tokenSecret: oauth_token_secret });
  const encryptedState = encrypt(statePayload);

  const authorizeUrl = new URL('https://connect.garmin.com/oauthConfirm');
  authorizeUrl.searchParams.set('oauth_token', oauth_token);

  const response = NextResponse.redirect(authorizeUrl.toString());
  response.cookies.set('garmin_oauth_state', encryptedState, {
    httpOnly: true,
    secure:   true,
    sameSite: 'lax',
    maxAge:   600, // 10 minutes
    path:     '/',
  });

  return response;
}
