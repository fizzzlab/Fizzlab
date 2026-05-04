import type { NextRequest } from 'next/server';

function stripTrailingSlash(value: string): string {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

function isLocalhostUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return ['localhost', '127.0.0.1', '0.0.0.0'].includes(url.hostname);
  } catch {
    return false;
  }
}

export function getConfiguredAppUrl(): string | null {
  const value = process.env.NEXT_PUBLIC_APP_URL?.trim();
  return value ? stripTrailingSlash(value) : null;
}

export function getBrowserAppUrl(): string {
  const configured = getConfiguredAppUrl();
  if (typeof window !== 'undefined' && window.location?.origin) {
    const origin = stripTrailingSlash(window.location.origin);
    if (!configured) return origin;
    if (isLocalhostUrl(configured) && !isLocalhostUrl(origin)) return origin;
  }

  if (configured) return configured;

  throw new Error('NEXT_PUBLIC_APP_URL is not configured and no browser origin is available.');
}

export function getServerAppUrl(request: NextRequest): string {
  const configured = getConfiguredAppUrl();
  const origin = stripTrailingSlash(request.nextUrl.origin);

  if (!configured) return origin;
  if (isLocalhostUrl(configured) && !isLocalhostUrl(origin)) return origin;

  return configured;
}

export function getRequiredAppUrl(): string {
  const configured = getConfiguredAppUrl();
  if (!configured) {
    throw new Error('NEXT_PUBLIC_APP_URL is required for this operation.');
  }
  return configured;
}
