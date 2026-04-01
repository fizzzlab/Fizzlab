import { createClient } from '@supabase/supabase-js';

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ── Types ──

interface WeeklyReport {
  week_start: string;
  steps: number | null;
  active_minutes: number | null;
  active_days: number | null;
  sleep_duration: number | null;
  sleep_consistency: number | null;
  session_count: number | null;
}

interface BadgeDefinition {
  id: string;
  goal_id: string;
  level: number;
  name: string;
  emoji: string;
  streak_weeks: number;
  threshold_value: number;
}

interface Goal {
  id: string;
  metric: string;
  name: string;
  emoji: string | null;
  is_active: boolean;
}

export interface AwardedBadge {
  badge_definition_id: string;
  badge_name: string;
  badge_emoji: string;
  goal_name: string;
  goal_metric: string;
  level: number;
  week_start: string;
}

// ── Metric extraction ──

const METRIC_FIELD_MAP: Record<string, keyof WeeklyReport> = {
  steps:             'steps',
  active_days:       'active_days',
  active_minutes:    'active_minutes',
  sleep_duration:    'sleep_duration',
  sleep_consistency: 'sleep_consistency',
  sessions:          'session_count',
};

function getMetricValue(report: WeeklyReport, metric: string): number {
  const field = METRIC_FIELD_MAP[metric];
  if (!field) return 0;
  return (report[field] as number) ?? 0;
}

// ── Streak calculation ──

function calculateStreak(
  reports: WeeklyReport[],
  metric: string,
  threshold: number
): number {
  let streak = 0;
  // Reports are ordered newest-first
  for (const report of reports) {
    const value = getMetricValue(report, metric);
    if (value >= threshold) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

// ── Balanced badge evaluation ──

function countGoalsMetInWeek(report: WeeklyReport, badges: BadgeDefinition[], goals: Goal[]): number {
  // Count how many goal categories have their level-1 threshold met
  let goalsMet = 0;
  const standardGoals = goals.filter(g => g.metric !== 'balanced' && g.is_active);

  for (const goal of standardGoals) {
    const level1Badge = badges.find(b => b.goal_id === goal.id && b.level === 1);
    if (!level1Badge) continue;

    const value = getMetricValue(report, goal.metric);
    if (value >= level1Badge.threshold_value) {
      goalsMet++;
    }
  }
  return goalsMet;
}

function evaluateBalancedBadges(
  reports: WeeklyReport[],
  allBadges: BadgeDefinition[],
  goals: Goal[],
  balancedGoalId: string,
  existingBadgeIds: Set<string>
): AwardedBadge[] {
  const awarded: AwardedBadge[] = [];
  const balancedBadges = allBadges.filter(b => b.goal_id === balancedGoalId);
  const balancedGoal = goals.find(g => g.id === balancedGoalId);
  if (!balancedGoal) return awarded;

  // Balanced Week (level 1): hit any 3 goals in latest week
  const balancedWeekBadge = balancedBadges.find(b => b.level === 1);
  if (balancedWeekBadge && !existingBadgeIds.has(balancedWeekBadge.id) && reports.length > 0) {
    const goalsMet = countGoalsMetInWeek(reports[0], allBadges, goals);
    if (goalsMet >= 3) {
      awarded.push({
        badge_definition_id: balancedWeekBadge.id,
        badge_name: balancedWeekBadge.name,
        badge_emoji: balancedWeekBadge.emoji,
        goal_name: balancedGoal.name,
        goal_metric: 'balanced',
        level: 1,
        week_start: reports[0].week_start,
      });
    }
  }

  // Balanced Month (level 2): Balanced Week criteria met in 4 of the last 4 weeks
  const balancedMonthBadge = balancedBadges.find(b => b.level === 2);
  if (balancedMonthBadge && !existingBadgeIds.has(balancedMonthBadge.id) && reports.length >= 4) {
    let balancedWeeks = 0;
    for (let i = 0; i < 4; i++) {
      const goalsMet = countGoalsMetInWeek(reports[i], allBadges, goals);
      if (goalsMet >= 3) balancedWeeks++;
    }
    if (balancedWeeks >= 4) {
      awarded.push({
        badge_definition_id: balancedMonthBadge.id,
        badge_name: balancedMonthBadge.name,
        badge_emoji: balancedMonthBadge.emoji,
        goal_name: balancedGoal.name,
        goal_metric: 'balanced',
        level: 2,
        week_start: reports[0].week_start,
      });
    }
  }

  // Consistency Crown (level 3): 2 goal streaks active for 8+ weeks
  const consistencyCrownBadge = balancedBadges.find(b => b.level === 3);
  if (consistencyCrownBadge && !existingBadgeIds.has(consistencyCrownBadge.id) && reports.length >= 8) {
    const standardGoals = goals.filter(g => g.metric !== 'balanced' && g.is_active);
    let longStreaks = 0;
    for (const goal of standardGoals) {
      const level1Badge = allBadges.find(b => b.goal_id === goal.id && b.level === 1);
      if (!level1Badge) continue;
      const streak = calculateStreak(reports, goal.metric, level1Badge.threshold_value);
      if (streak >= 8) longStreaks++;
    }
    if (longStreaks >= 2) {
      awarded.push({
        badge_definition_id: consistencyCrownBadge.id,
        badge_name: consistencyCrownBadge.name,
        badge_emoji: consistencyCrownBadge.emoji,
        goal_name: balancedGoal.name,
        goal_metric: 'balanced',
        level: 3,
        week_start: reports[0].week_start,
      });
    }
  }

  return awarded;
}

// ── Main evaluation function ──

export async function evaluateAndAwardBadges(userId: string, currentWeekStart: string): Promise<AwardedBadge[]> {
  const supabase = getServiceClient();

  // Fetch all goals + badge definitions
  const [goalsRes, badgesRes, existingRes, reportsRes] = await Promise.all([
    supabase.from('goals').select('*').eq('is_active', true),
    supabase.from('badge_definitions').select('*').order('level', { ascending: true }),
    supabase.from('user_badges').select('badge_definition_id').eq('user_id', userId),
    supabase.from('weekly_reports')
      .select('week_start, steps, active_minutes, active_days, sleep_duration, sleep_consistency, session_count')
      .eq('user_id', userId)
      .order('week_start', { ascending: false })
      .limit(16),
  ]);

  const goals: Goal[] = goalsRes.data ?? [];
  const allBadges: BadgeDefinition[] = badgesRes.data ?? [];
  const existingBadgeIds = new Set<string>(
    (existingRes.data ?? []).map((b: { badge_definition_id: string }) => b.badge_definition_id)
  );
  const reports: WeeklyReport[] = reportsRes.data ?? [];

  if (reports.length === 0 || goals.length === 0) return [];

  const newlyAwarded: AwardedBadge[] = [];

  // Evaluate standard streak-based goals
  const standardGoals = goals.filter(g => g.metric !== 'balanced');
  for (const goal of standardGoals) {
    const goalBadges = allBadges
      .filter(b => b.goal_id === goal.id)
      .sort((a, b) => b.level - a.level); // highest level first

    for (const badge of goalBadges) {
      if (existingBadgeIds.has(badge.id)) continue;

      const streak = calculateStreak(reports, goal.metric, badge.threshold_value);
      if (streak >= badge.streak_weeks) {
        newlyAwarded.push({
          badge_definition_id: badge.id,
          badge_name: badge.name,
          badge_emoji: badge.emoji,
          goal_name: goal.name,
          goal_metric: goal.metric,
          level: badge.level,
          week_start: currentWeekStart,
        });
        existingBadgeIds.add(badge.id);
      }
    }
  }

  // Evaluate balanced badges
  const balancedGoal = goals.find(g => g.metric === 'balanced');
  if (balancedGoal) {
    const balancedAwarded = evaluateBalancedBadges(reports, allBadges, goals, balancedGoal.id, existingBadgeIds);
    newlyAwarded.push(...balancedAwarded);
  }

  // Persist newly awarded badges (idempotent via UNIQUE constraint)
  if (newlyAwarded.length > 0) {
    const rows = newlyAwarded.map(b => ({
      user_id: userId,
      badge_definition_id: b.badge_definition_id,
      week_start: b.week_start,
    }));

    await supabase.from('user_badges').upsert(rows, {
      onConflict: 'user_id,badge_definition_id',
      ignoreDuplicates: true,
    });
  }

  return newlyAwarded;
}

// ── Utility: get user's full badge profile ──

export async function getUserBadges(userId: string) {
  const supabase = getServiceClient();

  const { data } = await supabase
    .from('user_badges')
    .select(`
      id,
      awarded_at,
      week_start,
      badge_definitions (
        id,
        name,
        emoji,
        level,
        streak_weeks,
        threshold_value,
        description,
        goals (
          id,
          metric,
          name,
          emoji
        )
      )
    `)
    .eq('user_id', userId)
    .order('awarded_at', { ascending: false });

  return data ?? [];
}
