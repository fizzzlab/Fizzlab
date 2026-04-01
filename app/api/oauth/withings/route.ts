import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');

  if (!userId) {
    return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });
  }

  const clientId    = process.env.WITHINGS_CLIENT_ID!;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/withings/callback`;
  const scope       = 'user.info,user.metrics,user.activity';
  const state       = Buffer.from(JSON.stringify({ userId })).toString('base64');

  const url = new URL('https://account.withings.com/oauth2_user/authorize2');
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id',     clientId);
  url.searchParams.set('redirect_uri',  redirectUri);
  url.searchParams.set('scope',         scope);
  url.searchParams.set('state',         state);

  return NextResponse.redirect(url.toString());
}
