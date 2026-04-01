import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

function svc() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') ?? 'overview';
  const supabase = svc();

  try {
    if (query === 'overview') {
      const [goalsRes, badgesRes, userBadgesRes, emailEventsRes] = await Promise.all([
        supabase.from('goals').select('*').order('created_at', { ascending: true }),
        supabase.from('badge_definitions').select('*').order('goal_id').order('level', { ascending: true }),
        supabase.from('user_badges').select('id, badge_definition_id, awarded_at, user_id'),
        supabase.from('email_events')
          .select('id, email_type, sent_at, user_id')
          .order('sent_at', { ascending: false })
          .limit(50),
      ]);

      const goals = goalsRes.data ?? [];
      const badges = badgesRes.data ?? [];
      const userBadges = userBadgesRes.data ?? [];
      const emailEvents = emailEventsRes.data ?? [];

      // Stats
      const totalBadgesAwarded = userBadges.length;
      const uniqueUsersWithBadges = new Set(userBadges.map((b: { user_id: string }) => b.user_id)).size;

      // Badge distribution by goal
      const badgesByGoal = goals.map((g: { id: string; name: string; emoji: string | null; metric: string }) => {
        const goalBadgeIds = new Set(badges.filter((b: { goal_id: string }) => b.goal_id === g.id).map((b: { id: string }) => b.id));
        const awarded = userBadges.filter((ub: { badge_definition_id: string }) => goalBadgeIds.has(ub.badge_definition_id)).length;
        return { goal_id: g.id, goal_name: g.name, goal_emoji: g.emoji, metric: g.metric, awarded_count: awarded };
      });

      // Recent badge awards
      const recentAwards = userBadges
        .sort((a: { awarded_at: string }, b: { awarded_at: string }) => new Date(b.awarded_at).getTime() - new Date(a.awarded_at).getTime())
        .slice(0, 20);

      // Enrich with user emails + badge names
      const userIds = [...new Set(recentAwards.map((a: { user_id: string }) => a.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, email')
        .in('id', userIds);
      const emailMap: Record<string, string> = {};
      (profiles ?? []).forEach((p: { id: string; email: string }) => { emailMap[p.id] = p.email; });

      const badgeMap: Record<string, { name: string; emoji: string }> = {};
      badges.forEach((b: { id: string; name: string; emoji: string }) => { badgeMap[b.id] = { name: b.name, emoji: b.emoji }; });

      const enrichedAwards = recentAwards.map((a: { user_id: string; badge_definition_id: string; awarded_at: string; id: string }) => ({
        id: a.id,
        user_email: emailMap[a.user_id] ?? 'Unknown',
        badge_name: badgeMap[a.badge_definition_id]?.name ?? 'Unknown',
        badge_emoji: badgeMap[a.badge_definition_id]?.emoji ?? '',
        awarded_at: a.awarded_at,
      }));

      // Email event stats
      const emailStats: Record<string, number> = {};
      emailEvents.forEach((e: { email_type: string }) => {
        emailStats[e.email_type] = (emailStats[e.email_type] ?? 0) + 1;
      });

      return NextResponse.json({
        goals,
        badges,
        stats: {
          total_goals: goals.length,
          total_badge_levels: badges.length,
          total_badges_awarded: totalBadgesAwarded,
          unique_users_with_badges: uniqueUsersWithBadges,
          badges_by_goal: badgesByGoal,
          email_stats: emailStats,
        },
        recent_awards: enrichedAwards,
      });
    }

    if (query === 'goals') {
      const { data } = await supabase
        .from('goals')
        .select(`
          *,
          badge_definitions ( id, level, name, emoji, streak_weeks, threshold_value, description )
        `)
        .order('created_at', { ascending: true });
      return NextResponse.json({ goals: data ?? [] });
    }

    return NextResponse.json({ error: 'Unknown query' }, { status: 400 });
  } catch (err) {
    console.error('Admin badges API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const supabase = svc();

  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'update-goal') {
      const { goal_id, is_active, description } = body;
      const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (typeof is_active === 'boolean') update.is_active = is_active;
      if (typeof description === 'string') update.description = description;

      const { error } = await supabase.from('goals').update(update).eq('id', goal_id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true });
    }

    if (action === 'update-badge') {
      const { badge_id, threshold_value, streak_weeks, description } = body;
      const update: Record<string, unknown> = {};
      if (typeof threshold_value === 'number') update.threshold_value = threshold_value;
      if (typeof streak_weeks === 'number') update.streak_weeks = streak_weeks;
      if (typeof description === 'string') update.description = description;

      const { error } = await supabase.from('badge_definitions').update(update).eq('id', badge_id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    console.error('Admin badges PUT error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
