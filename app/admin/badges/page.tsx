'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import Sidebar from '@/components/layout/Sidebar';
import Spinner from '@/components/ui/Spinner';
import { Trophy, Users, Mail, TrendingUp, ChevronDown, ChevronRight } from 'lucide-react';
import MetricIcon from '@/components/ui/MetricIcon';

interface Goal {
  id: string;
  metric: string;
  name: string;
  description: string | null;
  emoji: string | null;
  is_active: boolean;
  badge_definitions: BadgeDef[];
}

interface BadgeDef {
  id: string;
  level: number;
  name: string;
  emoji: string;
  streak_weeks: number;
  threshold_value: number;
  description: string | null;
}

interface BadgesByGoal {
  goal_id: string;
  goal_name: string;
  goal_emoji: string | null;
  metric: string;
  awarded_count: number;
}

interface RecentAward {
  id: string;
  user_email: string;
  badge_name: string;
  badge_emoji: string;
  awarded_at: string;
}

interface Stats {
  total_goals: number;
  total_badge_levels: number;
  total_badges_awarded: number;
  unique_users_with_badges: number;
  badges_by_goal: BadgesByGoal[];
  email_stats: Record<string, number>;
}

export default function AdminBadgesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const [role, setRole] = useState<string | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentAwards, setRecentAwards] = useState<RecentAward[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push('/auth/signin');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/admin/check-role?uid=${user.id}`)
      .then(r => r.json())
      .then(d => {
        setRole(d.role);
        if (d.role !== 'admin') router.push('/dashboard');
      })
      .catch(() => router.push('/dashboard'));
  }, [user, router]);

  const loadData = useCallback(async () => {
    setDataLoading(true);
    try {
      const [overviewRes, goalsRes] = await Promise.all([
        fetch('/api/admin/badges?q=overview'),
        fetch('/api/admin/badges?q=goals'),
      ]);

      if (overviewRes.ok) {
        const d = await overviewRes.json();
        setStats(d.stats);
        setRecentAwards(d.recent_awards ?? []);
      }
      if (goalsRes.ok) {
        const d = await goalsRes.json();
        setGoals(d.goals ?? []);
      }
    } catch {
      toast.error('Failed to load badge data');
    }
    setDataLoading(false);
  }, [toast]);

  useEffect(() => {
    if (role === 'admin') loadData();
  }, [role, loadData]);

  const handleToggleGoal = async (goalId: string, currentActive: boolean) => {
    const res = await fetch('/api/admin/badges', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update-goal', goal_id: goalId, is_active: !currentActive }),
    });
    if (res.ok) {
      toast.success(currentActive ? 'Goal disabled' : 'Goal enabled');
      loadData();
    } else {
      toast.error('Update failed');
    }
  };

  if (loading || !user || role === null) {
    return <div className="page-bg min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  }

  const formatRelativeTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  return (
    <div className="page-bg min-h-screen flex">
      <Sidebar variant="admin" />

      <main className="flex-1 min-w-0 overflow-hidden">
        {/* Page header */}
        <div className="px-6 lg:px-8 pt-8 pb-6 border-b" style={{ borderColor: 'rgba(200,150,100,0.08)' }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-100" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}>
                Goals & Badges
              </h1>
              <p className="text-slate-500 text-sm mt-1">Manage goal categories, badge thresholds, and track badge distribution.</p>
            </div>
          </div>
        </div>

        <div className="px-6 lg:px-8 py-7 space-y-7">
          {dataLoading ? (
            <div className="flex items-center justify-center py-32"><Spinner size="lg" /></div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                  { label: 'Goal Categories', value: stats?.total_goals ?? 0, accent: '#EB721B', icon: Trophy },
                  { label: 'Badge Levels', value: stats?.total_badge_levels ?? 0, accent: '#256B97', icon: TrendingUp },
                  { label: 'Badges Awarded', value: stats?.total_badges_awarded ?? 0, accent: '#C89664', icon: Trophy },
                  { label: 'Users with Badges', value: stats?.unique_users_with_badges ?? 0, accent: '#EB721B', icon: Users },
                ].map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className="stat-card">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-xs font-medium text-slate-500" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.label}</p>
                        <div className="w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0" style={{ background: `${s.accent}15`, borderColor: `${s.accent}30` }}>
                          <Icon size={14} style={{ color: s.accent }} />
                        </div>
                      </div>
                      <p className="text-3xl font-bold leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif", color: s.accent }}>{s.value}</p>
                    </div>
                  );
                })}
              </div>

              <div className="grid lg:grid-cols-3 gap-5">
                {/* Goals & badge definitions */}
                <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(200,150,100,0.08)' }}>
                    <h2 className="font-semibold text-slate-100 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Goal Categories</h2>
                    <p className="text-xs text-slate-600 mt-0.5">Click to expand badge levels and thresholds</p>
                  </div>
                  <div className="divide-y" style={{ borderColor: 'rgba(200,150,100,0.06)' }}>
                    {goals.map((goal) => {
                      const isExpanded = expandedGoal === goal.id;
                      const badgeCount = stats?.badges_by_goal?.find(b => b.goal_id === goal.id)?.awarded_count ?? 0;
                      return (
                        <div key={goal.id}>
                          <button
                            onClick={() => setExpandedGoal(isExpanded ? null : goal.id)}
                            className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-[rgba(200,150,100,0.03)] transition-colors"
                          >
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(235,114,27,0.1)', border: '1px solid rgba(235,114,27,0.2)' }}>
                              <MetricIcon emoji={goal.emoji} size={16} color="#EB721B" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-slate-100" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{goal.name}</p>
                                {!goal.is_active && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded border" style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)' }}>Disabled</span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5">{goal.description} · {goal.badge_definitions?.length ?? 0} badge levels · {badgeCount} awarded</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <button
                                onClick={(e) => { e.stopPropagation(); handleToggleGoal(goal.id, goal.is_active); }}
                                className={`relative flex-shrink-0 rounded-full transition-colors border ${
                                  goal.is_active ? 'bg-[#EB721B] border-[#EB721B]' : 'bg-[rgba(35,62,92,0.6)] border-[rgba(35,62,92,0.8)]'
                                }`}
                                style={{ height: '20px', width: '36px' }}
                                title={goal.is_active ? 'Disable goal' : 'Enable goal'}
                              >
                                <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow transition-transform ${goal.is_active ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
                              </button>
                              {isExpanded ? <ChevronDown size={14} className="text-slate-500" /> : <ChevronRight size={14} className="text-slate-500" />}
                            </div>
                          </button>

                          {isExpanded && goal.badge_definitions && (
                            <div className="px-6 pb-5">
                              <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'rgba(35,62,92,0.3)' }}>
                                <table className="w-full">
                                  <thead>
                                    <tr>
                                      <th className="table-header text-left">Level</th>
                                      <th className="table-header text-left">Badge</th>
                                      <th className="table-header text-left">Streak</th>
                                      <th className="table-header text-left">Threshold</th>
                                      <th className="table-header text-left">Description</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {goal.badge_definitions
                                      .sort((a: BadgeDef, b: BadgeDef) => a.level - b.level)
                                      .map((badge: BadgeDef) => (
                                        <tr key={badge.id} className="table-row">
                                          <td className="table-cell">
                                            <span className="text-xs font-bold" style={{ color: '#EB721B' }}>L{badge.level}</span>
                                          </td>
                                          <td className="table-cell">
                                            <div className="flex items-center gap-2">
                                              <MetricIcon emoji={badge.emoji} size={16} color="#C89664" />
                                              <span className="text-sm text-slate-200 font-medium">{badge.name}</span>
                                            </div>
                                          </td>
                                          <td className="table-cell text-xs text-slate-400">{badge.streak_weeks} week{badge.streak_weeks > 1 ? 's' : ''}</td>
                                          <td className="table-cell text-xs font-semibold" style={{ color: '#C89664' }}>
                                            {badge.threshold_value}
                                          </td>
                                          <td className="table-cell text-xs text-slate-500 max-w-[200px] truncate">{badge.description}</td>
                                        </tr>
                                      ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right column: recent awards + email stats */}
                <div className="space-y-5">
                  {/* Recent awards */}
                  <div className="glass-card rounded-2xl overflow-hidden">
                    <div className="px-5 py-3.5 border-b" style={{ borderColor: 'rgba(200,150,100,0.08)' }}>
                      <h3 className="font-semibold text-slate-100 text-xs" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Recent Awards</h3>
                    </div>
                    {recentAwards.length === 0 ? (
                      <div className="py-10 text-center px-5">
                        <p className="text-xs text-slate-600">No badges awarded yet.</p>
                      </div>
                    ) : (
                      <div className="divide-y" style={{ borderColor: 'rgba(200,150,100,0.05)' }}>
                        {recentAwards.slice(0, 10).map((a) => (
                          <div key={a.id} className="flex items-center gap-3 px-5 py-3">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(200,150,100,0.1)', border: '1px solid rgba(200,150,100,0.2)' }}>
                              <MetricIcon emoji={a.badge_emoji} size={13} color="#C89664" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-slate-200 font-medium truncate">{a.badge_name}</p>
                              <p className="text-[10px] text-slate-600 truncate">{a.user_email}</p>
                            </div>
                            <span className="text-[10px] text-slate-600 flex-shrink-0">{formatRelativeTime(a.awarded_at)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Email stats */}
                  <div className="glass-card rounded-2xl overflow-hidden">
                    <div className="px-5 py-3.5 border-b" style={{ borderColor: 'rgba(200,150,100,0.08)' }}>
                      <h3 className="font-semibold text-slate-100 text-xs" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Email Events (Recent)</h3>
                    </div>
                    <div className="p-5 space-y-2">
                      {Object.entries(stats?.email_stats ?? {}).length === 0 ? (
                        <p className="text-xs text-slate-600 text-center py-4">No email events logged yet.</p>
                      ) : (
                        Object.entries(stats?.email_stats ?? {}).map(([type, count]) => (
                          <div key={type} className="flex items-center justify-between p-2.5 rounded-lg border" style={{ background: 'rgba(1,14,34,0.2)', borderColor: 'rgba(200,150,100,0.06)' }}>
                            <div className="flex items-center gap-2">
                              <Mail size={11} style={{ color: '#256B97' }} />
                              <span className="text-xs text-slate-300 capitalize" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                {type.replace(/_/g, ' ')}
                              </span>
                            </div>
                            <span className="text-xs font-bold" style={{ color: '#C89664' }}>{count}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
