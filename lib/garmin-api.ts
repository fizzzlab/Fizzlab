import { createClient } from '@supabase/supabase-js';

export interface GarminWeeklyData {
  steps:             number;
  active_minutes:    number;
  active_days:       number;
  sleep_duration:    number;
  sleep_consistency: number;
  session_count:     number;
  session_duration:  number;
}

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Garmin uses a push/webhook model — data arrives via /api/webhooks/garmin
 * and is stored in the garmin_push_data table. This function aggregates
 * stored push data for the last 7 days into the standard weekly metrics.
 */
export async function fetchGarminWeeklyData(
  userId: string,
  weekEnd: Date = new Date()
): Promise<GarminWeeklyData> {
  const supabase  = getServiceClient();
  const endDate   = weekEnd.toISOString().split('T')[0];
  const startDate = new Date(weekEnd.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // ── Fetch all push data for this user in the date range ──
  const [dailiesRes, sleepsRes, activitiesRes] = await Promise.all([
    supabase
      .from('garmin_push_data')
      .select('payload')
      .eq('user_id', userId)
      .eq('data_type', 'dailies')
      .gte('summary_date', startDate)
      .lte('summary_date', endDate),
    supabase
      .from('garmin_push_data')
      .select('payload')
      .eq('user_id', userId)
      .eq('data_type', 'sleeps')
      .gte('summary_date', startDate)
      .lte('summary_date', endDate),
    supabase
      .from('garmin_push_data')
      .select('payload')
      .eq('user_id', userId)
      .eq('data_type', 'activities')
      .gte('summary_date', startDate)
      .lte('summary_date', endDate),
  ]);

  const dailies:    GarminDailySummary[]    = (dailiesRes.data ?? []).map(r => r.payload as GarminDailySummary);
  const sleeps:     GarminSleepSummary[]    = (sleepsRes.data ?? []).map(r => r.payload as GarminSleepSummary);
  const activities: GarminActivitySummary[] = (activitiesRes.data ?? []).map(r => r.payload as GarminActivitySummary);

  // ── Steps ──
  const totalSteps = dailies.reduce((sum, d) => sum + (d.steps ?? 0), 0);

  // ── Active minutes ──
  const totalActiveSeconds = dailies.reduce(
    (sum, d) => sum + (d.moderateIntensityDurationInSeconds ?? 0) + (d.vigorousIntensityDurationInSeconds ?? 0),
    0
  );
  const totalActiveMinutes = Math.round(totalActiveSeconds / 60);

  // ── Active days (≥8000 steps OR ≥30 min moderate+vigorous) ──
  const activeDays = dailies.filter((d) => {
    const dayActive = ((d.moderateIntensityDurationInSeconds ?? 0) + (d.vigorousIntensityDurationInSeconds ?? 0)) / 60;
    return (d.steps ?? 0) >= 8000 || dayActive >= 30;
  }).length;

  // ── Sleep duration ──
  const sleepHours = sleeps
    .map((s) => (s.durationInSeconds ?? 0) / 3600)
    .filter((h) => h > 0);
  const avgSleepHrs = sleepHours.length > 0
    ? sleepHours.reduce((a, b) => a + b, 0) / sleepHours.length
    : 0;

  // ── Sleep consistency (std-dev ratio, same formula as Fitbit/Withings) ──
  let sleepConsistency = 0;
  if (sleepHours.length > 1) {
    const mean     = sleepHours.reduce((a, b) => a + b, 0) / sleepHours.length;
    const variance = sleepHours.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / sleepHours.length;
    const stdDev   = Math.sqrt(variance);
    sleepConsistency = Math.max(0, Math.round((1 - stdDev / Math.max(mean, 1)) * 100));
  }

  // ── Activity sessions ──
  const sessionCount    = activities.length;
  const sessionDuration = Math.round(activities.reduce((sum, a) => sum + (a.durationInSeconds ?? 0), 0) / 60);

  return {
    steps:             totalSteps,
    active_minutes:    totalActiveMinutes,
    active_days:       activeDays,
    sleep_duration:    Math.round(avgSleepHrs * 10) / 10,
    sleep_consistency: sleepConsistency,
    session_count:     sessionCount,
    session_duration:  sessionDuration,
  };
}

// ── Garmin push payload types ──

interface GarminDailySummary {
  steps?:                                number;
  activeTimeInSeconds?:                  number;
  moderateIntensityDurationInSeconds?:   number;
  vigorousIntensityDurationInSeconds?:   number;
  floorsClimbed?:                        number;
  distanceInMeters?:                     number;
  calendarDate?:                         string;
}

interface GarminSleepSummary {
  durationInSeconds?:          number;
  deepSleepDurationInSeconds?: number;
  lightSleepDurationInSeconds?: number;
  remSleepInSeconds?:          number;
  awakeDurationInSeconds?:     number;
  calendarDate?:               string;
}

interface GarminActivitySummary {
  activityType?:      string;
  durationInSeconds?: number;
  distanceInMeters?:  number;
  calendarDate?:      string;
}
