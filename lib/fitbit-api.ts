export interface FitbitWeeklyData {
  steps:            number;
  active_minutes:   number;
  active_days:      number;
  sleep_duration:   number;
  sleep_consistency: number;
  session_count:    number;
  session_duration: number;
}

function isoDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

async function fitbitGet(path: string, accessToken: string): Promise<Response> {
  const res = await fetch(`https://api.fitbit.com${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res;
}

export async function fetchFitbitWeeklyData(
  accessToken: string,
  weekEnd: Date = new Date()
): Promise<FitbitWeeklyData> {
  const endDate   = isoDate(weekEnd);
  const startDate = isoDate(new Date(weekEnd.getTime() - 6 * 24 * 60 * 60 * 1000));

  const [stepsRes, minutesRes, sleepRes, activityRes] = await Promise.all([
    fitbitGet(`/1/user/-/activities/steps/date/${startDate}/${endDate}.json`, accessToken),
    fitbitGet(`/1/user/-/activities/minutesFairlyActive/date/${startDate}/${endDate}.json`, accessToken),
    fitbitGet(`/1.2/user/-/sleep/date/${startDate}/${endDate}.json`, accessToken),
    fitbitGet(`/1/user/-/activities/date/${endDate}.json`, accessToken),
  ]);

  if (!stepsRes.ok || !minutesRes.ok || !sleepRes.ok || !activityRes.ok) {
    const errs = await Promise.all([stepsRes, minutesRes, sleepRes, activityRes]
      .filter(r => !r.ok)
      .map(r => r.text()));
    throw new Error(`Fitbit API error: ${errs.join(' | ')}`);
  }

  const stepsData   = await stepsRes.json();
  const minutesData = await minutesRes.json();
  const sleepData   = await sleepRes.json();
  const activityData = await activityRes.json();

  const stepValues: number[]  = (stepsData['activities-steps'] ?? []).map((d: { value: string }) => parseInt(d.value, 10));
  const minuteValues: number[] = (minutesData['activities-minutesFairlyActive'] ?? []).map((d: { value: string }) => parseInt(d.value, 10));

  const totalSteps        = stepValues.reduce((a, b) => a + b, 0);
  const totalActiveMinutes = minuteValues.reduce((a, b) => a + b, 0);
  const activeDays        = stepValues.filter((s, i) => s >= 8000 || (minuteValues[i] ?? 0) >= 30).length;

  const sleepLogs: { duration: number; minutesAsleep: number; isMainSleep?: boolean }[] = sleepData.sleep ?? [];
  const mainSleeps = sleepLogs.filter(s => s.isMainSleep !== false);
  const avgSleepHrs = mainSleeps.length > 0
    ? mainSleeps.reduce((a, s) => a + s.minutesAsleep, 0) / mainSleeps.length / 60
    : 0;

  const sleepDurations = mainSleeps.map(s => s.minutesAsleep / 60);
  let sleepConsistency = 0;
  if (sleepDurations.length > 1) {
    const mean = sleepDurations.reduce((a, b) => a + b, 0) / sleepDurations.length;
    const variance = sleepDurations.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / sleepDurations.length;
    const stdDev = Math.sqrt(variance);
    sleepConsistency = Math.max(0, Math.round((1 - stdDev / Math.max(mean, 1)) * 100));
  }

  const exercises: { duration: number }[] = activityData?.activities ?? [];
  const sessionCount    = exercises.length;
  const sessionDuration = exercises.reduce((a, e) => a + (e.duration ?? 0), 0) / 60;

  return {
    steps:             totalSteps,
    active_minutes:    totalActiveMinutes,
    active_days:       activeDays,
    sleep_duration:    Math.round(avgSleepHrs * 10) / 10,
    sleep_consistency: sleepConsistency,
    session_count:     sessionCount,
    session_duration:  Math.round(sessionDuration),
  };
}
