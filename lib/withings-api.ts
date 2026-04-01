export interface WithingsWeeklyData {
  steps:             number;
  active_minutes:    number;
  active_days:       number;
  sleep_duration:    number;
  sleep_consistency: number;
  session_count:     number;
  session_duration:  number;
}

function unixWeekRange(weekEnd: Date): { startdate: number; enddate: number } {
  const enddate   = Math.floor(weekEnd.getTime() / 1000);
  const startdate = enddate - 6 * 24 * 60 * 60;
  return { startdate, enddate };
}

async function withingsPost(
  action: string,
  params: Record<string, string | number>,
  accessToken: string
): Promise<Response> {
  const body = new URLSearchParams({ action, ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])) });
  return fetch('https://wbsapi.withings.net/v2/measure', {
    method:  'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type':  'application/x-www-form-urlencoded',
    },
    body,
  });
}

export async function fetchWithingsWeeklyData(
  accessToken: string,
  weekEnd: Date = new Date()
): Promise<WithingsWeeklyData> {
  const { startdate, enddate } = unixWeekRange(weekEnd);

  const [activityRes, sleepRes, workoutRes] = await Promise.all([
    fetch('https://wbsapi.withings.net/v2/measure', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type':  'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        action:    'getactivity',
        startdateymd: new Date(startdate * 1000).toISOString().split('T')[0],
        enddateymd:   new Date(enddate   * 1000).toISOString().split('T')[0],
        data_fields: 'steps,active,totalcalories',
      }),
    }),
    fetch('https://wbsapi.withings.net/v2/sleep', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type':  'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        action:    'getsummary',
        startdateymd: new Date(startdate * 1000).toISOString().split('T')[0],
        enddateymd:   new Date(enddate   * 1000).toISOString().split('T')[0],
        data_fields: 'nb_rem_episodes,sleep_score,total_sleep_time,wakeup_count',
      }),
    }),
    fetch('https://wbsapi.withings.net/v2/workouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type':  'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        action:    'getworkouts',
        startdateymd: new Date(startdate * 1000).toISOString().split('T')[0],
        enddateymd:   new Date(enddate   * 1000).toISOString().split('T')[0],
        data_fields: 'active,calories,duration',
      }),
    }),
  ]);

  if (!activityRes.ok || !sleepRes.ok) {
    throw new Error('Withings API request failed');
  }

  const activityBody = await activityRes.json();
  const sleepBody    = await sleepRes.json();
  const workoutBody  = workoutRes.ok ? await workoutRes.json() : { body: { series: [] } };

  const activities: { steps?: number; active?: number }[] = activityBody.body?.activities ?? [];
  const sleepSeries: { data?: { total_sleep_time?: number } }[] = sleepBody.body?.series ?? [];
  const workouts: { data?: { duration?: number } }[]    = workoutBody.body?.series ?? [];

  const totalSteps       = activities.reduce((a, d) => a + (d.steps ?? 0), 0);
  const totalActive      = activities.reduce((a, d) => a + (d.active ?? 0), 0);
  const activeDays       = activities.filter(d => (d.steps ?? 0) >= 8000 || ((d.active ?? 0) / 60) >= 30).length;

  const sleepHours = sleepSeries
    .map(s => (s.data?.total_sleep_time ?? 0) / 3600)
    .filter(h => h > 0);
  const avgSleepHrs = sleepHours.length > 0
    ? sleepHours.reduce((a, b) => a + b, 0) / sleepHours.length
    : 0;

  let sleepConsistency = 0;
  if (sleepHours.length > 1) {
    const mean     = sleepHours.reduce((a, b) => a + b, 0) / sleepHours.length;
    const variance = sleepHours.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / sleepHours.length;
    const stdDev   = Math.sqrt(variance);
    sleepConsistency = Math.max(0, Math.round((1 - stdDev / Math.max(mean, 1)) * 100));
  }

  const sessionCount    = workouts.length;
  const sessionDuration = workouts.reduce((a, w) => a + (w.data?.duration ?? 0), 0) / 60;

  return {
    steps:             totalSteps,
    active_minutes:    Math.round(totalActive / 60),
    active_days:       activeDays,
    sleep_duration:    Math.round(avgSleepHrs * 10) / 10,
    sleep_consistency: sleepConsistency,
    session_count:     sessionCount,
    session_duration:  Math.round(sessionDuration),
  };
}
