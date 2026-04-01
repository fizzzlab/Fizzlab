export interface HuaweiWeeklyData {
  steps:             number;
  active_minutes:    number;
  active_days:       number;
  sleep_duration:    number;
  sleep_consistency: number;
  session_count:     number;
  session_duration:  number;
}

const HEALTH_API = 'https://health-api.cloud.huawei.com/healthkit/v1';

async function huaweiPost(
  endpoint: string,
  body: Record<string, unknown>,
  accessToken: string
): Promise<Response> {
  return fetch(`${HEALTH_API}/${endpoint}`, {
    method:  'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify(body),
  });
}

export async function fetchHuaweiWeeklyData(
  accessToken: string,
  weekEnd: Date = new Date()
): Promise<HuaweiWeeklyData> {
  const endTime   = weekEnd.getTime();
  const startTime = endTime - 6 * 24 * 60 * 60 * 1000;

  // One day in ms — used for grouping daily aggregates
  const dayMs = 86400000;

  // ── Fetch steps, sleep, and activity in parallel ──
  const [stepsRes, sleepRes, activityRes] = await Promise.all([
    huaweiPost('sampleSet:polymerize', {
      polymerizeWith: [{ dataTypeName: 'com.huawei.continuous.steps.delta' }],
      startTime,
      endTime,
      groupByTime: { duration: dayMs },
    }, accessToken),
    huaweiPost('sampleSet:polymerize', {
      polymerizeWith: [{ dataTypeName: 'com.huawei.continuous.sleep' }],
      startTime,
      endTime,
      groupByTime: { duration: dayMs },
    }, accessToken),
    huaweiPost('activityRecord:read', {
      startTime,
      endTime,
    }, accessToken),
  ]);

  if (!stepsRes.ok) {
    const errText = await stepsRes.text();
    throw new Error(`Huawei steps API error: ${stepsRes.status} ${errText}`);
  }
  if (!sleepRes.ok) {
    const errText = await sleepRes.text();
    throw new Error(`Huawei sleep API error: ${sleepRes.status} ${errText}`);
  }

  const stepsBody    = await stepsRes.json();
  const sleepBody    = await sleepRes.json();
  const activityBody = activityRes.ok ? await activityRes.json() : { activityRecord: [] };

  // ── Steps ──
  const stepGroups: HuaweiSampleGroup[] = stepsBody.group ?? [];
  const dailySteps = stepGroups.map((g) => {
    const val = g.sampleSet?.[0]?.samplePoints?.[0]?.value?.[0]?.intValue
             ?? g.sampleSet?.[0]?.samplePoints?.[0]?.value?.[0]?.floatValue
             ?? 0;
    return val;
  });
  const totalSteps = dailySteps.reduce((a, b) => a + b, 0);

  // ── Active minutes (days with ≥8000 steps count as active) ──
  // Huawei doesn't provide "active minutes" directly in polymerize,
  // so we estimate from activity records + daily step threshold
  const activeDays = dailySteps.filter((s) => s >= 8000).length;

  // Estimate active minutes from activity records duration
  const activityRecords: HuaweiActivityRecord[] = activityBody.activityRecord ?? [];
  const totalActiveMinutes = Math.round(
    activityRecords.reduce((sum, r) => {
      const dur = ((r.endTime ?? 0) - (r.startTime ?? 0)) / 60000; // ms → min
      return sum + Math.max(dur, 0);
    }, 0)
  );

  // ── Sleep ──
  const sleepGroups: HuaweiSampleGroup[] = sleepBody.group ?? [];
  const sleepHours = sleepGroups
    .map((g) => {
      const totalMs = (g.endTime ?? 0) - (g.startTime ?? 0);
      return totalMs > 0 ? totalMs / 3600000 : 0; // ms → hours
    })
    .filter((h) => h > 0);

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

  // ── Activity sessions ──
  const sessionCount    = activityRecords.length;
  const sessionDuration = Math.round(
    activityRecords.reduce((sum, r) => {
      return sum + Math.max(((r.endTime ?? 0) - (r.startTime ?? 0)) / 60000, 0);
    }, 0)
  );

  return {
    steps:             totalSteps,
    active_minutes:    totalActiveMinutes > 0 ? totalActiveMinutes : activeDays * 30, // fallback estimate
    active_days:       activeDays,
    sleep_duration:    Math.round(avgSleepHrs * 10) / 10,
    sleep_consistency: sleepConsistency,
    session_count:     sessionCount,
    session_duration:  sessionDuration,
  };
}

// ── Huawei response types ──

interface HuaweiSampleGroup {
  startTime?:  number;
  endTime?:    number;
  sampleSet?:  {
    samplePoints?: {
      value?: { intValue?: number; floatValue?: number }[];
    }[];
  }[];
}

interface HuaweiActivityRecord {
  startTime?:    number;
  endTime?:      number;
  activityType?: string;
}
