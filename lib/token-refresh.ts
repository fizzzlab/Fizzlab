import { encrypt, decrypt } from '@/lib/encrypt';
import { createClient } from '@supabase/supabase-js';

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export interface TokenSet {
  access_token:  string;
  refresh_token: string;
  expires_at:    string;
}

export async function refreshFitbitToken(
  connectionId: string,
  encryptedRefresh: string
): Promise<TokenSet> {
  const refreshToken = decrypt(encryptedRefresh);
  const clientId     = process.env.FITBIT_CLIENT_ID!;
  const clientSecret = process.env.FITBIT_CLIENT_SECRET!;

  const res = await fetch('https://api.fitbit.com/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
    },
    body: new URLSearchParams({
      grant_type:    'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    if (res.status === 401) {
      await getServiceClient()
        .from('wearable_connections')
        .update({ status: 'expired' })
        .eq('id', connectionId);
    }
    throw new Error(`Fitbit refresh failed: ${text}`);
  }

  const tokens = await res.json();
  const newSet: TokenSet = {
    access_token:  tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_at:    new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
  };

  await getServiceClient()
    .from('wearable_connections')
    .update({
      access_token_enc:  encrypt(newSet.access_token),
      refresh_token_enc: encrypt(newSet.refresh_token),
      token_expires_at:  newSet.expires_at,
      status:            'connected',
    })
    .eq('id', connectionId);

  return newSet;
}

export async function refreshWithingsToken(
  connectionId: string,
  encryptedRefresh: string
): Promise<TokenSet> {
  const refreshToken = decrypt(encryptedRefresh);
  const clientId     = process.env.WITHINGS_CLIENT_ID!;
  const clientSecret = process.env.WITHINGS_CLIENT_SECRET!;

  const res = await fetch('https://wbsapi.withings.net/v2/oauth2', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      action:        'requesttoken',
      grant_type:    'refresh_token',
      client_id:     clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) {
    await getServiceClient()
      .from('wearable_connections')
      .update({ status: 'expired' })
      .eq('id', connectionId);
    throw new Error(`Withings refresh failed: ${await res.text()}`);
  }

  const body   = await res.json();
  const tokens = body.body;

  if (!tokens?.access_token) {
    await getServiceClient()
      .from('wearable_connections')
      .update({ status: 'expired' })
      .eq('id', connectionId);
    throw new Error('Withings refresh returned no access_token');
  }

  const newSet: TokenSet = {
    access_token:  tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_at:    new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
  };

  await getServiceClient()
    .from('wearable_connections')
    .update({
      access_token_enc:  encrypt(newSet.access_token),
      refresh_token_enc: encrypt(newSet.refresh_token),
      token_expires_at:  newSet.expires_at,
      status:            'connected',
    })
    .eq('id', connectionId);

  return newSet;
}

/**
 * Garmin uses OAuth 1.0a — tokens do not expire.
 * This function simply decrypts and returns the stored access token.
 * The refresh_token_enc field stores the OAuth 1.0a token secret (needed
 * only if we ever need to make signed API requests).
 */
export async function getGarminToken(
  encryptedAccess: string
): Promise<string> {
  return decrypt(encryptedAccess);
}

export async function refreshHuaweiToken(
  connectionId: string,
  encryptedRefresh: string
): Promise<TokenSet> {
  const refreshToken = decrypt(encryptedRefresh);
  const clientId     = process.env.HUAWEI_CLIENT_ID!;
  const clientSecret = process.env.HUAWEI_CLIENT_SECRET!;

  const res = await fetch('https://oauth-login.cloud.huawei.com/oauth2/v3/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type:    'refresh_token',
      client_id:     clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    if (res.status === 401 || res.status === 403) {
      await getServiceClient()
        .from('wearable_connections')
        .update({ status: 'expired' })
        .eq('id', connectionId);
    }
    throw new Error(`Huawei refresh failed: ${text}`);
  }

  const tokens = await res.json();

  if (!tokens.access_token) {
    await getServiceClient()
      .from('wearable_connections')
      .update({ status: 'expired' })
      .eq('id', connectionId);
    throw new Error('Huawei refresh returned no access_token');
  }

  const newSet: TokenSet = {
    access_token:  tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_at:    new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
  };

  await getServiceClient()
    .from('wearable_connections')
    .update({
      access_token_enc:  encrypt(newSet.access_token),
      refresh_token_enc: encrypt(newSet.refresh_token),
      token_expires_at:  newSet.expires_at,
      status:            'connected',
    })
    .eq('id', connectionId);

  return newSet;
}

export async function getValidToken(connection: {
  id: string;
  provider: string;
  access_token_enc: string;
  refresh_token_enc: string;
  token_expires_at: string;
}): Promise<string> {
  // Garmin tokens never expire (OAuth 1.0a)
  if (connection.provider === 'garmin') {
    return getGarminToken(connection.access_token_enc);
  }

  const expiresAt = new Date(connection.token_expires_at);
  const nowPlus5  = new Date(Date.now() + 5 * 60 * 1000);

  if (expiresAt > nowPlus5) {
    return decrypt(connection.access_token_enc);
  }

  let refreshed: TokenSet;
  switch (connection.provider) {
    case 'fitbit':
      refreshed = await refreshFitbitToken(connection.id, connection.refresh_token_enc);
      break;
    case 'withings':
      refreshed = await refreshWithingsToken(connection.id, connection.refresh_token_enc);
      break;
    case 'huawei':
      refreshed = await refreshHuaweiToken(connection.id, connection.refresh_token_enc);
      break;
    default:
      throw new Error(`Unknown provider: ${connection.provider}`);
  }

  return refreshed.access_token;
}
