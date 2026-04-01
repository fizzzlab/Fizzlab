import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

function svc() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.replace('Bearer ', '');
  const supabase = svc();

  const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
  if (authErr || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') ?? 'my-badges';

  try {
    if (query === 'my-badges') {
      // Get user's earned badges with full badge + goal info
      const { data: userBadges } = await supabase
        .from('user_badges')
        .select(`
          id,
          awarded_at,
          week_start,
          badge_definition_id,
          badge_definitions (
            id, name, emoji, level, streak_weeks, threshold_value, description,
            goal_id,
            goals ( id, metric, name, emoji )
          )
        `)
        .eq('user_id', user.id)
        .order('awarded_at', { ascending: false });

      return NextResponse.json({ badges: userBadges ?? [] });
    }

    if (query === 'all-goals') {
      // Get all goals with their badge definitions (for progress display)
      const { data: goals } = await supabase
        .from('goals')
        .select(`
          id, metric, name, description, emoji, is_active,
          badge_definitions ( id, level, name, emoji, streak_weeks, threshold_value, description )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      return NextResponse.json({ goals: goals ?? [] });
    }

    if (query === 'progress') {
      // Get user's streaks for each goal (current consecutive weeks meeting threshold)
      const { data: reports } = await supabase
        .from('weekly_reports')
        .select('week_start, steps, active_minutes, active_days, sleep_duration, sleep_consistency, session_count')
        .eq('user_id', user.id)
        .order('week_start', { ascending: false })
        .limit(16);

      const { data: goals } = await supabase
        .from('goals')
        .select('id, metric, name, emoji, is_active')
        .eq('is_active', true);

      const { data: badgeDefs } = await supabase
        .from('badge_definitions')
        .select('id, goal_id, level, name, emoji, streak_weeks, threshold_value')
        .order('level', { ascending: true });

      const { data: userBadges } = await supabase
        .from('user_badges')
        .select('badge_definition_id')
        .eq('user_id', user.id);

      const earnedIds = new Set((userBadges ?? []).map((b: { badge_definition_id: string }) => b.badge_definition_id));

      const METRIC_FIELD_MAP: Record<string, string> = {
        steps: 'steps',
        active_days: 'active_days',
        active_minutes: 'active_minutes',
        sleep_duration: 'sleep_duration',
        sleep_consistency: 'sleep_consistency',
        sessions: 'session_count',
      };

      const progress = (goals ?? [])
        .filter((g: { metric: string }) => g.metric !== 'balanced')
        .map((goal: { id: string; metric: string; name: string; emoji: string | null }) => {
          const goalBadges = (badgeDefs ?? []).filter((b: { goal_id: string }) => b.goal_id === goal.id);
          const field = METRIC_FIELD_MAP[goal.metric];

          // Calculate current streak using level-1 threshold
          const level1 = goalBadges.find((b: { level: number }) => b.level === 1);
          let currentStreak = 0;
          if (level1 && field && reports) {
            for (const r of reports) {
              const val = (r as Record<string, unknown>)[field] as number ?? 0;
              if (val >= level1.threshold_value) currentStreak++;
              else break;
            }
          }

          // Find next unearned badge
          const nextBadge = goalBadges.find((b: { id: string }) => !earnedIds.has(b.id));
          const highestEarned = [...goalBadges].reverse().find((b: { id: string }) => earnedIds.has(b.id));

          return {
            goal_id: goal.id,
            metric: goal.metric,
            goal_name: goal.name,
            goal_emoji: goal.emoji,
            current_streak: currentStreak,
            highest_level: highestEarned ? highestEarned.level : 0,
            next_badge: nextBadge ? {
              id: nextBadge.id,
              name: nextBadge.name,
              emoji: nextBadge.emoji,
              level: nextBadge.level,
              streak_weeks: nextBadge.streak_weeks,
              threshold_value: nextBadge.threshold_value,
            } : null,
            badges: goalBadges.map((b: { id: string; level: number; name: string; emoji: string; streak_weeks: number }) => ({
              ...b,
              earned: earnedIds.has(b.id),
            })),
          };
        });

      return NextResponse.json({ progress });
    }

    return NextResponse.json({ error: 'Unknown query' }, { status: 400 });
  } catch (err) {
    console.error('Badges API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
