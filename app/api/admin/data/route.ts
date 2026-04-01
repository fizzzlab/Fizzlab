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
  const query = searchParams.get('q');

  if (!query) return NextResponse.json({ error: 'Missing q param' }, { status: 400 });

  const supabase = svc();

  try {
    if (query === 'overview') {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString();
      const [usersRes, connectionsRes, syncRes, reportRes, recentLogsRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('wearable_connections').select('id', { count: 'exact', head: true }).eq('status', 'connected'),
        supabase.from('sync_logs').select('id', { count: 'exact', head: true }).eq('status', 'success').gte('synced_at', thirtyDaysAgo),
        supabase.from('weekly_reports').select('consistency_score').gte('created_at', thirtyDaysAgo),
        supabase.from('sync_logs')
          .select('id, provider, status, error_message, synced_at, user_id')
          .order('synced_at', { ascending: false })
          .limit(8),
      ]);

      const scores = (reportRes.data ?? []).map((r: { consistency_score: number }) => r.consistency_score).filter(Boolean);
      const avgConsistency = scores.length > 0
        ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length)
        : 0;

      // Fetch emails for sync log user_ids
      const recentLogs = recentLogsRes.data ?? [];
      const userIds = [...new Set(recentLogs.map((l: { user_id: string }) => l.user_id))];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, email')
        .in('id', userIds);

      const emailMap: Record<string, string> = {};
      (profilesData ?? []).forEach((p: { id: string; email: string }) => { emailMap[p.id] = p.email; });

      const logsWithEmail = recentLogs.map((l: { user_id: string; [key: string]: unknown }) => ({
        ...l,
        user_email: emailMap[l.user_id] ?? 'Unknown',
      }));

      return NextResponse.json({
        stats: {
          totalUsers:        usersRes.count ?? 0,
          activeConnections: connectionsRes.count ?? 0,
          syncSuccessLast30: syncRes.count ?? 0,
          avgConsistency,
        },
        recentLogs: logsWithEmail,
      });
    }

    if (query === 'users') {
      const { data } = await supabase
        .from('profiles')
        .select('id, email, is_active, created_at, role')
        .order('created_at', { ascending: false });

      const profiles = data ?? [];
      const profileIds = profiles.map((p: { id: string }) => p.id);

      const { data: connections } = await supabase
        .from('wearable_connections')
        .select('user_id, provider, status, last_sync_at')
        .in('user_id', profileIds);

      const connMap: Record<string, { provider: string; status: string; last_sync_at: string | null }> = {};
      (connections ?? []).forEach((c: { user_id: string; provider: string; status: string; last_sync_at: string | null }) => {
        connMap[c.user_id] = c;
      });

      const rows = profiles.map((p: { id: string; email: string; is_active: boolean; created_at: string; role: string }) => {
        const conn = connMap[p.id];
        return {
          id:                p.id,
          email:             p.email,
          created_at:        p.created_at,
          role:              p.role ?? 'user',
          provider:          conn?.provider ?? 'none',
          connection_status: conn?.status ?? 'disconnected',
          last_sync:         conn?.last_sync_at ?? null,
          status:            p.is_active === false ? 'disabled' : 'active',
        };
      });

      return NextResponse.json({ users: rows });
    }

    if (query === 'sync-logs') {
      const limit = parseInt(searchParams.get('limit') ?? '100', 10);
      const { data: logs } = await supabase
        .from('sync_logs')
        .select('id, provider, status, synced_at, error_message, user_id')
        .order('synced_at', { ascending: false })
        .limit(limit);

      const userIds = [...new Set((logs ?? []).map((l: { user_id: string }) => l.user_id))];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, email')
        .in('id', userIds);

      const emailMap: Record<string, string> = {};
      (profilesData ?? []).forEach((p: { id: string; email: string }) => { emailMap[p.id] = p.email; });

      const logsWithEmail = (logs ?? []).map((l: { user_id: string; [key: string]: unknown }) => ({
        ...l,
        user_email: emailMap[l.user_id] ?? 'Unknown',
      }));

      return NextResponse.json({ logs: logsWithEmail });
    }

    if (query === 'analytics') {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString();
      const [reportsRes, logsRes, connectionsRes] = await Promise.all([
        supabase.from('weekly_reports')
          .select('consistency_score, target_hit, steps, active_days, sleep_duration, active_minutes, week_start')
          .gte('created_at', thirtyDaysAgo)
          .order('week_start', { ascending: true }),
        supabase.from('sync_logs')
          .select('status, synced_at, provider')
          .gte('synced_at', thirtyDaysAgo),
        supabase.from('wearable_connections')
          .select('provider, status'),
      ]);

      return NextResponse.json({
        reports:     reportsRes.data ?? [],
        syncLogs:    logsRes.data ?? [],
        connections: connectionsRes.data ?? [],
      });
    }

    return NextResponse.json({ error: 'Unknown query' }, { status: 400 });

  } catch (err) {
    console.error('Admin data API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
