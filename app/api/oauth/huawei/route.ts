import { NextRequest, NextResponse } from 'next/server';
import { getServerAppUrl } from '@/lib/app-url';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');

  if (!userId) {
    return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });
  }

  const clientId    = process.env.HUAWEI_CLIENT_ID!;
  const redirectUri = `${getServerAppUrl(request)}/api/oauth/huawei/callback`;

  // Huawei Health Kit scopes — behavioural only (no heart rate / physiological)
  const scope = [
    'https://www.huawei.com/healthkit/step.read',
    'https://www.huawei.com/healthkit/sleep.read',
    'https://www.huawei.com/healthkit/activity.read',
  ].join(' ');

  const state = Buffer.from(JSON.stringify({ userId })).toString('base64url');

  const url = new URL('https://oauth-login.cloud.huawei.com/oauth2/v3/authorize');
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id',     clientId);
  url.searchParams.set('redirect_uri',  redirectUri);
  url.searchParams.set('scope',         scope);
  url.searchParams.set('state',         state);
  url.searchParams.set('access_type',   'offline'); // ensures refresh_token is returned

  return NextResponse.redirect(url.toString());
}
