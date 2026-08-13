"use client";

import { useState } from "react";
import { useAuth } from "../AuthContext";

export default function SignInPage() {
  const { login } = useAuth();
  const [agentId, setAgentId] = useState("Demo Agent");
  const [password, setPassword] = useState("********");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      login(agentId, "Rajshahi");
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-8 mesh-bg relative overflow-hidden">
      
      {/* Ambient orb */}
      <div className="absolute top-1/3 right-1/3 w-80 h-80 rounded-full bg-action/6 blur-3xl animate-float pointer-events-none"></div>

      <div className="relative z-10 animate-fade-in-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
        {/* Logo */}
        <div className="mb-10 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-action to-action-deep flex items-center justify-center shadow-lg shadow-action/20">
            <span className="font-display font-bold text-2xl text-canvas leading-none">R</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display text-text-primary mb-2 tracking-tight">Ripenly</h1>
          <p className="text-text-secondary text-sm">Produce Agent Portal</p>
        </div>

        {/* Glass form card */}
        <div className="glass p-8 w-full max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">Agent ID</label>
              <div className="neu-inset">
                <input 
                  type="text" 
                  value={agentId} 
                  onChange={e => setAgentId(e.target.value)}
                  className="w-full bg-transparent p-3.5 text-text-primary font-mono text-sm focus:outline-none placeholder-text-muted"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">PIN / Password</label>
              <div className="neu-inset">
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-transparent p-3.5 text-text-primary font-mono text-sm focus:outline-none placeholder-text-muted"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="btn-glow w-full py-3.5 text-base disabled:opacity-50 flex justify-center items-center"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating…
                  </span>
                ) : "Sign In"}
              </button>
            </div>
            
          </form>
        </div>

        <div className="mt-6 text-center text-xs text-text-muted">
          <p>Demo environment · Sign in with any credentials</p>
        </div>
      </div>
    </div>
  );
}
