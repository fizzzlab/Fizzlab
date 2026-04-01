export interface BehaviouralMetrics {
  steps:             number;
  active_minutes:    number;
  active_days:       number;
  sleep_duration:    number;
  sleep_consistency: number;
  session_count:     number;
  session_duration:  number;
}

export interface ConsistencyResult {
  consistency_score:    number;
  targets_met:          string[];
  targets_missed:       string[];
  encouragement_worthy: boolean;
}

const THRESHOLDS = {
  steps:             35000,
  active_minutes:    150,
  active_days:       4,
  sleep_duration:    7,
  sleep_consistency: 70,
  session_count:     2,
};

export function evaluateConsistency(metrics: BehaviouralMetrics): ConsistencyResult {
  const checks: { key: keyof typeof THRESHOLDS; label: string }[] = [
    { key: 'steps',             label: 'Weekly steps (35,000+)' },
    { key: 'active_minutes',    label: 'Active minutes (150+)' },
    { key: 'active_days',       label: 'Active days (4+)' },
    { key: 'sleep_duration',    label: 'Sleep duration (7+ hrs avg)' },
    { key: 'sleep_consistency', label: 'Sleep consistency (70%+)' },
    { key: 'session_count',     label: 'Activity sessions (2+)' },
  ];

  const targets_met:    string[] = [];
  const targets_missed: string[] = [];

  for (const check of checks) {
    if (metrics[check.key] >= THRESHOLDS[check.key]) {
      targets_met.push(check.label);
    } else {
      targets_missed.push(check.label);
    }
  }

  const consistency_score    = Math.round((targets_met.length / checks.length) * 100);
  const encouragement_worthy = consistency_score >= 70;

  return {
    consistency_score,
    targets_met,
    targets_missed,
    encouragement_worthy,
  };
}
