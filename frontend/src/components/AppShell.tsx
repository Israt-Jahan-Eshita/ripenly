"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/app/AuthContext";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  // Don't show navigation on the landing or sign-in pages
  if (pathname === "/" || pathname === "/sign-in") {
    return <>{children}</>;
  }

  const navItems = [
    { name: "New Dispatch", path: "/dispatch/new", icon: "M12 4v16m8-8H4" },
    { name: "History", path: "/history", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    { name: "Voice Input", path: "/ivr-simulator", icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" },
    { name: "Business Model", path: "/business", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
    { name: "Feedback Loop", path: "/feedback-loop", icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" },
    { name: "Pitch Deck", path: "/pitch-deck", icon: "M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" },
    { name: "Admin", path: "/admin", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.573-1.066z M15 12a3 3 0 11-6 0 3 3 0 016 0z" }
  ];

  return (
    <div className="min-h-screen flex mesh-bg">
      
      {/* Desktop Sidebar */}
      <aside className="hidden sm:flex flex-col w-64 glass border-y-0 border-l-0 fixed inset-y-0 left-0 z-50">
        <div className="p-6">
          <Link href="/dispatch/new" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-action to-action-deep flex items-center justify-center shadow-lg shadow-action/20 group-hover:shadow-action/40 transition-shadow">
              <span className="font-display font-bold text-xl text-canvas leading-none">R</span>
            </div>
            <span className="font-display font-bold text-xl text-text-primary tracking-tight">Ripenly</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? "bg-action/15 text-action shadow-sm shadow-action/10" 
                    : "text-text-secondary hover:text-text-primary hover:bg-glass-strong"
                }`}
              >
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} /></svg>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {user && (
          <div className="p-4 border-t border-border mt-auto">
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-action/30 to-action-deep/30 border border-action/20 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-action">DA</span>
              </div>
              <div className="overflow-hidden">
                <span className="text-sm font-semibold text-text-primary block truncate">{user.name}</span>
                <span className="text-xs text-action block truncate">{user.location}</span>
              </div>
            </div>
            <button onClick={logout} className="mt-3 w-full py-2 text-xs font-medium text-text-muted hover:text-text-primary transition-colors flex items-center justify-center gap-2 rounded-lg hover:bg-glass-strong">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Sign out
            </button>
          </div>
        )}
      </aside>

      {/* Mobile Top Header */}
      <header className="sm:hidden fixed top-0 inset-x-0 h-16 glass border-x-0 border-t-0 z-50 flex items-center justify-between px-4">
        <Link href="/dispatch/new" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-action to-action-deep flex items-center justify-center shadow-lg shadow-action/20">
            <span className="font-display font-bold text-base text-canvas leading-none">R</span>
          </div>
          <span className="font-display font-bold text-lg text-text-primary tracking-tight">Ripenly</span>
        </Link>
        <button 
          className="p-2 rounded-lg hover:bg-glass-strong transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <svg className="w-6 h-6 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </header>

      {/* Mobile menu dropdown */}
      {mobileOpen && (
        <div className="sm:hidden fixed inset-x-0 top-16 bottom-0 glass z-40 p-4 flex flex-col animate-fade-in overflow-y-auto">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-colors ${
                    isActive ? "bg-action/15 text-action" : "text-text-secondary hover:bg-glass-strong"
                  }`}
                >
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} /></svg>
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          {user && (
            <div className="mt-auto border-t border-border pt-6 pb-6">
              <div className="flex items-center gap-3 px-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-action/30 to-action-deep/30 border border-action/20 flex items-center justify-center shrink-0">
                  <span className="text-base font-bold text-action">DA</span>
                </div>
                <div>
                  <span className="text-base font-semibold text-text-primary block">{user.name}</span>
                  <span className="text-sm text-action block">{user.location}</span>
                </div>
              </div>
              <button onClick={() => { logout(); setMobileOpen(false); }} className="mt-6 w-full py-3.5 text-sm font-medium text-text-muted hover:text-text-primary bg-glass-strong rounded-xl flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Sign out
              </button>
            </div>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col sm:ml-64 pt-16 sm:pt-0 min-h-screen">
        <main className="flex-1">
          {children}
        </main>
        
        {/* Subtle Footer */}
        <footer className="border-t border-border py-4 px-6 mt-auto">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span>Ripenly MVP · Hackathon Demo</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-action animate-pulse"></span>
              AI Engine Online
            </span>
          </div>
        </footer>
      </div>
      
    </div>
  );
}
