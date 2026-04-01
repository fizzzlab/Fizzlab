'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Menu, X, ChevronDown, LogOut, Settings, User } from 'lucide-react';

export default function Navbar() {
  const { user, role, signOut } = useAuth();
  const toast = useToast();
  const [menuOpen, setMenuOpen]     = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out', 'You have been signed out successfully.');
  };

  return (
    <header className="glass-panel sticky top-0 z-40 border-b border-[rgba(35,62,92,0.4)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 select-none">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#EB721B] to-[#C89664] flex items-center justify-center">
            <div className="w-3 h-3 rounded-sm bg-white/90" />
          </div>
          <span
            className="font-semibold text-slate-100 tracking-tight text-sm"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            PulseTrack
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {user ? (
            <>
              <Link href="/dashboard" className="nav-link">Dashboard</Link>
              <Link href="/connect"   className="nav-link">Devices</Link>
              <Link href="/account"   className="nav-link">Account</Link>
            </>
          ) : (
            <>
              <Link href="/#how-it-works" className="nav-link">How It Works</Link>
              <Link href="/#features"     className="nav-link">Features</Link>
            </>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 btn-ghost text-sm px-3 py-1.5"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#256B97] to-[#03294E] flex items-center justify-center text-xs font-semibold text-white border border-[rgba(37,107,151,0.4)]">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <span className="text-slate-300 text-sm max-w-[120px] truncate">{user.email}</span>
                <ChevronDown size={13} className="text-slate-500" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 glass-card rounded-xl overflow-hidden shadow-xl border border-[rgba(35,62,92,0.5)] py-1">
                  <Link
                    href="/account"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-slate-100 hover:bg-[rgba(35,62,92,0.4)] transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <User size={14} className="text-slate-500" />
                    Account Settings
                  </Link>
                  {role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#EB721B] hover:text-orange-300 hover:bg-[rgba(235,114,27,0.08)] transition-colors"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      <Settings size={14} className="text-[#EB721B]" />
                      Admin Console
                    </Link>
                  )}
                  <div className="my-1 h-px bg-[rgba(35,62,92,0.4)]" />
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-[rgba(185,28,28,0.1)] transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/signin" className="btn-ghost text-sm px-4 py-2">Sign In</Link>
              <Link href="/auth/signup" className="btn-primary text-sm px-4 py-2">Get Started</Link>
            </>
          )}
        </div>

        <button
          className="md:hidden btn-ghost p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden glass-panel border-t border-[rgba(35,62,92,0.4)] px-4 py-4 flex flex-col gap-1">
          {user ? (
            <>
              <Link href="/dashboard" className="nav-link" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link href="/connect"   className="nav-link" onClick={() => setMenuOpen(false)}>Devices</Link>
              <Link href="/account"   className="nav-link" onClick={() => setMenuOpen(false)}>Account</Link>
              {role === 'admin' && (
                <Link href="/admin" className="nav-link" onClick={() => setMenuOpen(false)}>Admin Console</Link>
              )}
              <div className="divider" />
              <button onClick={handleSignOut} className="btn-danger w-full mt-1">Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="btn-secondary w-full mt-1" onClick={() => setMenuOpen(false)}>Sign In</Link>
              <Link href="/auth/signup" className="btn-primary  w-full mt-2" onClick={() => setMenuOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
