import { createClient } from '@supabase/supabase-js';
import { getValidToken } from '@/lib/token-refresh';
import { fetchFitbitWeeklyData } from '@/lib/fitbit-api';
import { fetchWithingsWeeklyData } from '@/lib/withings-api';
import { fetchGarminWeeklyData } from '@/lib/garmin-api';
import { fetchHuaweiWeeklyData } from '@/lib/huawei-api';
import { evaluateConsistency } from '@/lib/consistency-engine';
import { evaluateAndAwardBadges } from '@/lib/badge-engine';
import {
  sendAcknowledgementEmail,
  sendEncouragementEmail,
  sendReauthEmail,
  sendBadgeEarnedEmail,
  sendWeeklyCheckinEmail,
  sendNoDataEmail,
} from '@/lib/mailer';

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function withRetry<T>(fn: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === retries) throw err;
      await sleep(RETRY_DELAY_MS * attempt);
    }
  }
  throw new Error('Max retries exceeded');
}

export async function processSingleConnection(connectionId: string): Promise<void> {
  const supabase = getServiceClient();

  const { data: conn, error: connErr } = await supabase
    .from('wearable_connections')
    .select('*, profiles(email, full_name, email_weekly_report, email_reauth_alerts)')
    .eq('id', connectionId)
    .single();

  if (connErr || !conn) throw new Error(`Connection not found: ${connectionId}`);
  if (conn.status === 'disconnected') return;

  const profile = conn.profiles as {
    email: string;
    full_name: string | null;
    email_weekly_report: boolean;
    email_reauth_alerts: boolean;
  };

  const weekEnd = new Date();
  const weekStart = new Date(weekEnd.getTime() - 6 * 24 * 60 * 60 * 1000);

  const logBase = {
    user_id:       conn.user_id,
    connection_id: conn.id,
    provider:      conn.provider,
    sync_week_start: weekStart.toISOString().split('T')[0],
  };

  let accessToken: string;
  try {
    accessToken = await withRetry(() => getValidToken(conn));
  } catch (err) {
    await supabase.from('sync_logs').insert({
      ...logBase,
      status:        'failed',
      error_message: `Token refresh failed: ${(err as Error).message}`,
    });
    if (profile.email_reauth_alerts !== false) {
      await sendReauthEmail(profile.email, profile.full_name ?? '', conn.provider).catch(() => {});
    }
    return;
  }

  let metrics;
  try {
    metrics = await withRetry(() => {
      switch (conn.provider) {
        case 'fitbit':   return fetchFitbitWeeklyData(accessToken, weekEnd);
        case 'withings': return fetchWithingsWeeklyData(accessToken, weekEnd);
        case 'garmin':   return fetchGarminWeeklyData(conn.user_id, weekEnd);
        case 'huawei':   return fetchHuaweiWeeklyData(accessToken, weekEnd);
        default:         throw new Error(`Unknown provider: ${conn.provider}`);
      }
    });
  } catch (err) {
    const errMsg = (err as Error).message;
    const isRateLimit = errMsg.toLowerCase().includes('429') || errMsg.toLowerCase().includes('rate');
    await supabase.from('sync_logs').insert({
      ...logBase,
      status:        isRateLimit ? 'retrying' : 'failed',
      error_message: errMsg,
    });
    return;
  }

  const consistency = evaluateConsistency(metrics);

  const { error: reportErr } = await supabase.from('weekly_reports').upsert(
    {
      user_id:          conn.user_id,
      connection_id:    conn.id,
      week_start:       weekStart.toISOString().split('T')[0],
      week_end:         weekEnd.toISOString().split('T')[0],
      steps:            metrics.steps,
      active_minutes:   metrics.active_minutes,
      active_days:      metrics.active_days,
      sleep_duration:   metrics.sleep_duration,
      sleep_consistency: metrics.sleep_consistency,
      session_count:    metrics.session_count,
      session_duration: metrics.session_duration,
      consistency_score: consistency.consistency_score,
      targets_met:      consistency.targets_met,
      targets_missed:   consistency.targets_missed,
    },
    { onConflict: 'user_id,connection_id,week_start' }
  );

  if (reportErr) {
    await supabase.from('sync_logs').insert({
      ...logBase,
      status:        'failed',
      error_message: `DB write error: ${reportErr.message}`,
    });
    return;
  }

  await supabase
    .from('wearable_connections')
    .update({ last_sync_at: new Date().toISOString(), status: 'connected' })
    .eq('id', conn.id);

  await supabase.from('sync_logs').insert({
    ...logBase,
    status:           'success',
    metrics_snapshot: metrics,
  });

  // ── Badge evaluation ──
  const weekStartStr = weekStart.toISOString().split('T')[0];
  let newBadges: Awaited<ReturnType<typeof evaluateAndAwardBadges>> = [];
  try {
    newBadges = await evaluateAndAwardBadges(conn.user_id, weekStartStr);
  } catch (err) {
    console.error('Badge evaluation error:', (err as Error).message);
  }

  // ── Email triggers ──
  if (profile.email_weekly_report !== false) {
    // Acknowledgement email
    await sendAcknowledgementEmail(profile.email, profile.full_name ?? '').catch(() => {});
    await logEmailEvent(supabase, conn.user_id, 'acknowledgement', { week_start: weekStartStr });

    // Weekly check-in email: "You hit X of Y targets this week"
    const totalTargets = consistency.targets_met.length + consistency.targets_missed.length;
    await sendWeeklyCheckinEmail(
      profile.email,
      profile.full_name ?? '',
      consistency.targets_met.length,
      totalTargets,
      consistency.targets_met,
      consistency.targets_missed
    ).catch(() => {});
    await logEmailEvent(supabase, conn.user_id, 'weekly_checkin', {
      week_start: weekStartStr,
      targets_met: consistency.targets_met.length,
      targets_total: totalTargets,
    });

    // Encouragement email if consistency >= 70%
    if (consistency.encouragement_worthy) {
      await sendEncouragementEmail(
        profile.email,
        profile.full_name ?? '',
        consistency.consistency_score
      ).catch(() => {});
      await logEmailEvent(supabase, conn.user_id, 'encouragement', {
        week_start: weekStartStr,
        consistency_score: consistency.consistency_score,
      });
    }

    // Badge earned email
    if (newBadges.length > 0) {
      const badgePayload = newBadges.map(b => ({
        name: b.badge_name,
        emoji: b.badge_emoji,
        goalName: b.goal_name,
        description: `Level ${b.level} — ${b.goal_metric}`,
      }));
      await sendBadgeEarnedEmail(profile.email, profile.full_name ?? '', badgePayload).catch(() => {});
      await logEmailEvent(supabase, conn.user_id, 'badge_earned', {
        week_start: weekStartStr,
        badges: newBadges.map(b => b.badge_name),
      });
    }
  }
}

// ── Email event logger ──
async function logEmailEvent(
  supabase: ReturnType<typeof getServiceClient>,
  userId: string,
  emailType: string,
  metadata: Record<string, unknown>
) {
  try {
    await supabase.from('email_events').insert({
      user_id: userId,
      email_type: emailType,
      metadata,
    });
  } catch {
    // silent — email event logging is non-critical
  }
}

export async function processAllConnections(): Promise<{ processed: number; failed: number }> {
  const supabase = getServiceClient();

  const { data: connections, error } = await supabase
    .from('wearable_connections')
    .select('id, user_id, provider, last_sync_at, profiles(email, full_name, email_reauth_alerts)')
    .in('status', ['connected', 'expired']);

  if (error || !connections) {
    throw new Error(`Failed to fetch connections: ${error?.message}`);
  }

  let processed = 0;
  let failed    = 0;

  for (const conn of connections) {
    // ── No-data detection: if last_sync_at > 7 days ago, send no-data email ──
    if (conn.last_sync_at) {
      const lastSync = new Date(conn.last_sync_at);
      const daysSince = (Date.now() - lastSync.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince >= 7) {
        const profileArr = conn.profiles as unknown as { email: string; full_name: string | null; email_reauth_alerts: boolean }[] | null;
        const profile = profileArr?.[0] ?? null;
        if (profile && profile.email_reauth_alerts !== false) {
          await sendNoDataEmail(profile.email, profile.full_name ?? '', conn.provider).catch(() => {});
          await logEmailEvent(supabase, conn.user_id, 'no_data', { provider: conn.provider, days_since: Math.round(daysSince) });
        }
      }
    }

    try {
      await processSingleConnection(conn.id);
      processed++;
    } catch {
      failed++;
    }
    await sleep(500);
  }

  return { processed, failed };
}
