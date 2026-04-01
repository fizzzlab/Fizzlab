'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import {
  LayoutDashboard,
  Zap,
  Settings,
  LogOut,
  Shield,
  Users,
  Activity,
  BarChart3,
  Trophy,
} from 'lucide-react';

const userNav = [
  { href: '/dashboard', label: 'Overview',    icon: LayoutDashboard },
  { href: '/badges',    label: 'Badges',      icon: Trophy },
  { href: '/connect',   label: 'Devices',     icon: Zap },
  { href: '/account',   label: 'Settings',    icon: Settings },
];

const adminNav = [
  { href: '/admin',              label: 'Overview',    icon: LayoutDashboard },
  { href: '/admin/users',        label: 'Users',       icon: Users },
  { href: '/admin/sync',         label: 'Sync Health', icon: Activity },
  { href: '/admin/analytics',    label: 'Analytics',   icon: BarChart3 },
  { href: '/admin/badges',       label: 'Badges',      icon: Trophy },
];

interface SidebarProps {
  variant?: 'user' | 'admin';
}

export default function Sidebar({ variant = 'user' }: SidebarProps) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const toast = useToast();
  const nav = variant === 'admin' ? adminNav : userNav;

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
  };

  return (
    <aside
      className="w-56 flex-shrink-0 hidden lg:flex flex-col sticky top-0 h-screen overflow-y-auto no-scrollbar"
      style={{
        background: 'linear-gradient(180deg, rgba(1,14,34,0.98) 0%, rgba(2,28,59,0.96) 100%)',
        borderRight: '1px solid rgba(200,150,100,0.1)',
      }}
    >
      {/* Logo */}
      <div className="p-5" style={{ borderBottom: '1px solid rgba(200,150,100,0.08)' }}>
        <Link href="/" className="flex items-center gap-2.5 select-none group">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
            style={{ background: 'linear-gradient(135deg, #021C3B, #010E22)' }}
          >
            <div className="w-3 h-3 rounded-sm" style={{ background: '#C89664' }} />
          </div>
          <span
            className="font-semibold text-sm tracking-tight transition-colors duration-200 group-hover:text-white"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#f1f5f9' }}
          >
            PulseTrack
          </span>
        </Link>
        {variant === 'admin' && (
          <div className="mt-2 flex items-center gap-1.5">
            <Shield size={11} style={{ color: '#C89664' }} />
            <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: '#C89664' }}>
              Admin Console
            </span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 flex flex-col gap-0.5">
        <p
          className="text-[10px] font-semibold tracking-[0.12em] uppercase px-2 mt-1 mb-2"
          style={{ color: 'rgba(200,150,100,0.35)', fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Navigation
        </p>
        {nav.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/dashboard' && href !== '/admin' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className="group relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: isActive ? '#C89664' : 'rgba(200,150,100,0.5)',
                background: isActive ? 'rgba(200,150,100,0.1)' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = '#C89664';
                  e.currentTarget.style.background = 'rgba(200,150,100,0.06)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'rgba(200,150,100,0.5)';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {/* Active indicator bar */}
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full transition-all duration-200"
                style={{
                  height: isActive ? '60%' : '0%',
                  background: '#C89664',
                  opacity: isActive ? 1 : 0,
                }}
              />
              <Icon
                size={16}
                className="transition-transform duration-200 group-hover:scale-110"
                style={{ color: isActive ? '#C89664' : 'rgba(200,150,100,0.45)' }}
              />
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="p-3" style={{ borderTop: '1px solid rgba(200,150,100,0.08)' }}>
        <div
          className="flex items-center gap-2.5 px-2 py-2 mb-2 rounded-lg"
          style={{ background: 'rgba(200,150,100,0.06)' }}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #256B97, #03294E)', border: '1px solid rgba(200,150,100,0.25)', color: '#C89664' }}
          >
            {user?.email?.charAt(0).toUpperCase() ?? 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium truncate" style={{ fontFamily: "'Inter', sans-serif", color: '#e2e8f0' }}>
              {user?.email}
            </p>
            <p className="text-[10px] capitalize" style={{ color: 'rgba(200,150,100,0.5)' }}>{variant === 'admin' ? 'Administrator' : 'Member'}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-2 py-2 text-sm rounded-md transition-all duration-200 group"
          style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'rgba(200,150,100,0.45)' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#fca5a5'; e.currentTarget.style.background = 'rgba(185,28,28,0.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(200,150,100,0.45)'; e.currentTarget.style.background = 'transparent'; }}
        >
          <LogOut size={14} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
