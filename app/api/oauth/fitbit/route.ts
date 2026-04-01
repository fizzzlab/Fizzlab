import { NextRequest, NextResponse } from 'next/server';
import { randomBytes, createHash } from 'crypto';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');

  if (!userId) {
    return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });
  }

  const clientId = process.env.FITBIT_CLIENT_ID!;
  const scope     = 'activity sleep profile';

  // PKCE — required for Fitbit Server-type apps
  const codeVerifier  = randomBytes(32).toString('base64url');
  const codeChallenge = createHash('sha256').update(codeVerifier).digest('base64url');

  const state = Buffer.from(JSON.stringify({ userId, codeVerifier })).toString('base64url');

  const url = new URL('https://www.fitbit.com/oauth2/authorize');
  url.searchParams.set('response_type',         'code');
  url.searchParams.set('client_id',             clientId);
  url.searchParams.set('scope',                 scope);
  url.searchParams.set('state',                 state);
  url.searchParams.set('code_challenge',        codeChallenge);
  url.searchParams.set('code_challenge_method', 'S256');

  return NextResponse.redirect(url.toString());
}
