'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import Sidebar from '@/components/layout/Sidebar';
import Spinner from '@/components/ui/Spinner';
import { Trophy, Target, Flame, Lock } from 'lucide-react';
import MetricIcon from '@/components/ui/MetricIcon';

interface BadgeDef {
  id: string;
  name: string;
  emoji: string;
  level: number;
  streak_weeks: number;
  threshold_value: number;
  description: string;
  earned: boolean;
}

interface GoalProgress {
  goal_id: string;
  metric: string;
  goal_name: string;
  goal_emoji: string | null;
  current_streak: number;
  highest_level: number;
  next_badge: {
    id: string;
    name: string;
    emoji: string;
    level: number;
    streak_weeks: number;
    threshold_value: number;
  } | null;
  badges: BadgeDef[];
}

interface EarnedBadge {
  id: string;
  awarded_at: string;
  week_start: string;
  badge_definitions: {
    id: string;
    name: string;
    emoji: string;
    level: number;
    streak_weeks: number;
    description: string;
    goals: {
      id: string;
      metric: string;
      name: string;
      emoji: string | null;
    };
  };
}

export default function BadgesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [progress, setProgress] = useState<GoalProgress[]>([]);
  const [earned, setEarned] = useState<EarnedBadge[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'progress' | 'earned'>('progress');

  const loadData = useCallback(async () => {
    if (!user) return;
    setDataLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const headers = { Authorization: `Bearer ${session.access_token}` };

    const [progressRes, badgesRes] = await Promise.all([
      fetch('/api/badges?q=progress', { headers }),
      fetch('/api/badges?q=my-badges', { headers }),
    ]);

    if (progressRes.ok) {
      const d = await progressRes.json();
      setProgress(d.progress ?? []);
    }
    if (badgesRes.ok) {
      const d = await badgesRes.json();
      setEarned(d.badges ?? []);
    }

    setDataLoading(false);
  }, [user]);

  useEffect(() => {
    if (!loading && !user) router.push('/auth/signin');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) loadData();
  }, [user, loadData]);

  if (loading || !user) {
    return <div className="page-bg min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  }

  const totalEarned = earned.length;
  const totalPossible = progress.reduce((a, g) => a + g.badges.length, 0);
  const longestStreak = progress.reduce((max, g) => Math.max(max, g.current_streak), 0);

  return (
    <div className="page-bg min-h-screen flex">
      <Sidebar variant="user" />

      <main className="flex-1 min-w-0 overflow-hidden">
        {/* Page header */}
        <div className="px-6 lg:px-8 pt-8 pb-6 border-b" style={{ borderColor: 'rgba(200,150,100,0.08)' }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-100" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}>
                Goals & Badges
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Build streaks, earn badges, stay consistent.
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 lg:px-8 py-7 space-y-7">
          {dataLoading ? (
            <div className="flex items-center justify-center py-32"><Spinner size="lg" /></div>
          ) : (
            <>
              {/* Summary stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Badges Earned', value: `${totalEarned}/${totalPossible}`, accent: '#EB721B', icon: Trophy },
                  { label: 'Active Streaks', value: progress.filter(g => g.current_streak > 0).length, accent: '#256B97', icon: Flame },
                  { label: 'Longest Streak', value: `${longestStreak}w`, accent: '#C89664', icon: Target },
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

              {/* Tab toggle */}
              <div className="flex items-center gap-1.5">
                {(['progress', 'earned'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-xs px-4 py-2 rounded-lg border transition-all capitalize ${
                      activeTab === tab
                        ? 'bg-[rgba(235,114,27,0.12)] text-[#EB721B] border-[rgba(235,114,27,0.3)]'
                        : 'text-slate-500 border-[rgba(35,62,92,0.4)] hover:text-slate-300'
                    }`}
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {tab === 'progress' ? 'Goal Progress' : `Earned (${totalEarned})`}
                  </button>
                ))}
              </div>

              {activeTab === 'progress' ? (
                <div className="space-y-5">
                  {progress.map((goal) => (
                    <div key={goal.goal_id} className="glass-card rounded-2xl overflow-hidden">
                      {/* Goal header */}
                      <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'rgba(200,150,100,0.08)' }}>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(235,114,27,0.1)', border: '1px solid rgba(235,114,27,0.2)' }}>
                            <MetricIcon emoji={goal.goal_emoji} size={16} color="#EB721B" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-100 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{goal.goal_name}</h3>
                            <p className="text-xs text-slate-600 mt-0.5">
                              Current streak: <span className="font-semibold" style={{ color: goal.current_streak > 0 ? '#EB721B' : '#64748b' }}>{goal.current_streak} week{goal.current_streak !== 1 ? 's' : ''}</span>
                              {goal.next_badge && (
                                <span className="text-slate-600 inline-flex items-center gap-1"> · Next: <MetricIcon emoji={goal.next_badge.emoji} size={11} color="#64748b" /> {goal.next_badge.name} ({goal.next_badge.streak_weeks}w)</span>
                              )}
                            </p>
                          </div>
                        </div>
                        {goal.current_streak > 0 && (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: 'rgba(235,114,27,0.1)', border: '1px solid rgba(235,114,27,0.2)' }}>
                            <Flame size={11} style={{ color: '#EB721B' }} />
                            <span className="text-xs font-bold" style={{ color: '#EB721B' }}>{goal.current_streak}w</span>
                          </div>
                        )}
                      </div>

                      {/* Badge levels */}
                      <div className="p-6">
                        <div className="flex items-center gap-3 overflow-x-auto pb-1">
                          {goal.badges.map((badge) => (
                            <div
                              key={badge.id}
                              className="flex-shrink-0 w-[120px] rounded-xl border p-3 text-center transition-all"
                              style={{
                                background: badge.earned ? 'rgba(235,114,27,0.06)' : 'rgba(1,14,34,0.25)',
                                borderColor: badge.earned ? 'rgba(235,114,27,0.25)' : 'rgba(35,62,92,0.3)',
                                opacity: badge.earned ? 1 : 0.6,
                              }}
                            >
                              <div className="flex items-center justify-center mb-1.5">
                                {badge.earned
                                  ? <MetricIcon emoji={badge.emoji} size={22} color="#EB721B" />
                                  : <Lock size={18} className="text-slate-700" />
                                }
                              </div>
                              <p className="text-xs font-semibold truncate" style={{ color: badge.earned ? '#EB721B' : '#64748b', fontFamily: "'Space Grotesk', sans-serif" }}>
                                {badge.name}
                              </p>
                              <p className="text-[10px] mt-1" style={{ color: badge.earned ? '#C89664' : '#475569' }}>
                                {badge.streak_weeks}w streak
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Progress bar toward next badge */}
                        {goal.next_badge && (
                          <div className="mt-4">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs text-slate-500 inline-flex items-center gap-1">Progress to <MetricIcon emoji={goal.next_badge.emoji} size={11} color="#94a3b8" /> {goal.next_badge.name}</span>
                              <span className="text-xs font-semibold" style={{ color: '#EB721B' }}>
                                {goal.current_streak}/{goal.next_badge.streak_weeks}w
                              </span>
                            </div>
                            <div className="progress-bar">
                              <div
                                className="progress-bar-fill"
                                style={{
                                  width: `${Math.min(100, (goal.current_streak / goal.next_badge.streak_weeks) * 100)}%`,
                                  background: 'linear-gradient(90deg, #EB721B, #C89664)',
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Earned badges list */
                <div className="glass-card rounded-2xl overflow-hidden">
                  {earned.length === 0 ? (
                    <div className="py-16 text-center px-6">
                      <div className="w-12 h-12 rounded-xl bg-[rgba(35,62,92,0.4)] border border-[rgba(35,62,92,0.6)] flex items-center justify-center mx-auto mb-3">
                        <Lock size={18} className="text-slate-600" />
                      </div>
                      <p className="text-sm text-slate-500">No badges earned yet.</p>
                      <p className="text-xs text-slate-600 mt-1">Keep your streaks going — badges are awarded automatically each week.</p>
                    </div>
                  ) : (
                    <div className="divide-y" style={{ borderColor: 'rgba(200,150,100,0.06)' }}>
                      {earned.map((b) => {
                        const bd = b.badge_definitions;
                        const goal = bd?.goals;
                        return (
                          <div key={b.id} className="flex items-center gap-4 px-6 py-4">
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(235,114,27,0.08)', border: '1px solid rgba(235,114,27,0.18)' }}>
                              <MetricIcon emoji={bd?.emoji} size={20} color="#EB721B" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-slate-100" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                {bd?.name}
                              </p>
                              <p className="text-xs text-slate-500 mt-0.5">
                                <span className="inline-flex items-center gap-1"><MetricIcon emoji={goal?.emoji} size={11} color="#64748b" /> {goal?.name}</span> · Level {bd?.level} · {bd?.streak_weeks}w streak
                              </p>
                              {bd?.description && (
                                <p className="text-xs text-slate-600 mt-0.5">{bd.description}</p>
                              )}
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-xs font-medium" style={{ color: '#C89664' }}>
                                {new Date(b.awarded_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </p>
                              <p className="text-[10px] text-slate-600 mt-0.5">Week of {b.week_start}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
