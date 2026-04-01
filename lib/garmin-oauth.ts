import { createHmac, randomBytes } from 'crypto';

// ── OAuth 1.0a signing utilities for Garmin Connect API ──

function percentEncode(str: string): string {
  return encodeURIComponent(str).replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase());
}

function generateNonce(): string {
  return randomBytes(16).toString('hex');
}

function generateTimestamp(): string {
  return Math.floor(Date.now() / 1000).toString();
}

/**
 * Build the OAuth 1.0a signature base string.
 */
function buildBaseString(
  method: string,
  url: string,
  params: Record<string, string>
): string {
  const sortedKeys = Object.keys(params).sort();
  const paramString = sortedKeys.map((k) => `${percentEncode(k)}=${percentEncode(params[k])}`).join('&');
  return `${method.toUpperCase()}&${percentEncode(url)}&${percentEncode(paramString)}`;
}

/**
 * Create HMAC-SHA1 signature.
 */
function sign(baseString: string, signingKey: string): string {
  return createHmac('sha1', signingKey).update(baseString).digest('base64');
}

/**
 * Build the OAuth Authorization header value.
 */
function buildAuthHeader(oauthParams: Record<string, string>): string {
  const parts = Object.keys(oauthParams)
    .sort()
    .map((k) => `${percentEncode(k)}="${percentEncode(oauthParams[k])}"`)
    .join(', ');
  return `OAuth ${parts}`;
}

// ── Public API ──

export interface OAuthRequestTokenResult {
  oauth_token: string;
  oauth_token_secret: string;
}

export interface OAuthAccessTokenResult {
  oauth_token: string;
  oauth_token_secret: string;
}

/**
 * Step 1: Obtain a request token from Garmin.
 */
export async function getRequestToken(callbackUrl: string): Promise<OAuthRequestTokenResult> {
  const consumerKey    = process.env.GARMIN_CONSUMER_KEY!;
  const consumerSecret = process.env.GARMIN_CONSUMER_SECRET!;
  const url            = 'https://connectapi.garmin.com/oauth-service/oauth/request_token';

  const oauthParams: Record<string, string> = {
    oauth_consumer_key:     consumerKey,
    oauth_nonce:            generateNonce(),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp:        generateTimestamp(),
    oauth_version:          '1.0',
    oauth_callback:         callbackUrl,
  };

  const baseString = buildBaseString('POST', url, oauthParams);
  const signingKey = `${percentEncode(consumerSecret)}&`; // no token secret yet
  oauthParams.oauth_signature = sign(baseString, signingKey);

  const res = await fetch(url, {
    method:  'POST',
    headers: { Authorization: buildAuthHeader(oauthParams) },
  });

  if (!res.ok) {
    throw new Error(`Garmin request token failed: ${await res.text()}`);
  }

  const body   = await res.text();
  const params = new URLSearchParams(body);

  return {
    oauth_token:        params.get('oauth_token')!,
    oauth_token_secret: params.get('oauth_token_secret')!,
  };
}

/**
 * Step 3: Exchange request token + verifier for an access token.
 */
export async function getAccessToken(
  oauthToken: string,
  oauthTokenSecret: string,
  oauthVerifier: string
): Promise<OAuthAccessTokenResult> {
  const consumerKey    = process.env.GARMIN_CONSUMER_KEY!;
  const consumerSecret = process.env.GARMIN_CONSUMER_SECRET!;
  const url            = 'https://connectapi.garmin.com/oauth-service/oauth/access_token';

  const oauthParams: Record<string, string> = {
    oauth_consumer_key:     consumerKey,
    oauth_nonce:            generateNonce(),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp:        generateTimestamp(),
    oauth_token:            oauthToken,
    oauth_verifier:         oauthVerifier,
    oauth_version:          '1.0',
  };

  const baseString = buildBaseString('POST', url, oauthParams);
  const signingKey = `${percentEncode(consumerSecret)}&${percentEncode(oauthTokenSecret)}`;
  oauthParams.oauth_signature = sign(baseString, signingKey);

  const res = await fetch(url, {
    method:  'POST',
    headers: { Authorization: buildAuthHeader(oauthParams) },
  });

  if (!res.ok) {
    throw new Error(`Garmin access token failed: ${await res.text()}`);
  }

  const body   = await res.text();
  const params = new URLSearchParams(body);

  return {
    oauth_token:        params.get('oauth_token')!,
    oauth_token_secret: params.get('oauth_token_secret')!,
  };
}
