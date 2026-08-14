import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen mesh-bg relative overflow-hidden">
      
      {/* Subtle background ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-action/5 blur-[120px] pointer-events-none mix-blend-screen animate-float"></div>
      <div className="absolute top-[40%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-fresh/5 blur-[120px] pointer-events-none mix-blend-screen animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-info/5 blur-[120px] pointer-events-none mix-blend-screen animate-float" style={{ animationDelay: '4s' }}></div>

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-32 pb-24 flex flex-col items-center text-center">
        
        {/* Status badge */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-glass-strong border border-border mb-8 animate-fade-in-up">
          <span className="w-2 h-2 rounded-full bg-action animate-pulse"></span>
          <span className="text-xs font-mono text-text-secondary tracking-widest uppercase">Powered by Gemini 3.5 Flash</span>
        </div>

        {/* Hero Headline */}
        <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl text-text-primary tracking-tight mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          Stop guessing.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-action via-fresh to-info">
            Start profiting.
          </span>
        </h1>

        {/* Hero Subheadline */}
        <p className="font-sans text-lg sm:text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Ripenly is an AI-powered decision engine that tells farmers when, where, and how to sell perishable produce before it spoils.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <Link 
            href="/dispatch/new"
            className="w-full sm:w-auto btn-glow px-8 py-4 text-base sm:text-lg font-semibold tracking-wide rounded-xl flex items-center justify-center gap-2"
          >
            Start New Dispatch
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </Link>
          
          <Link
            href="/sign-in"
            className="w-full sm:w-auto glass px-8 py-4 text-base sm:text-lg font-medium text-text-secondary border border-border rounded-xl hover:bg-glass-strong hover:text-text-primary transition-all flex items-center justify-center"
          >
            Agent Dashboard
          </Link>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="relative z-10 border-y border-border/50 bg-background/50 backdrop-blur-md py-12">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="text-4xl font-display text-text-primary font-medium mb-1">40%</div>
            <div className="text-xs text-text-muted font-mono tracking-wide uppercase">Waste Reduction</div>
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="text-4xl font-display text-action font-medium mb-1">&lt;10s</div>
            <div className="text-xs text-text-muted font-mono tracking-wide uppercase">AI Grading Time</div>
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="text-4xl font-display text-fresh font-medium mb-1">2x</div>
            <div className="text-xs text-text-muted font-mono tracking-wide uppercase">Revenue Uplift</div>
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
            <div className="text-4xl font-display text-info font-medium mb-1">3</div>
            <div className="text-xs text-text-muted font-mono tracking-wide uppercase">Markets Live</div>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS SECTION --- */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-32">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-display text-text-primary mb-4">Intelligent routing in three steps</h2>
          <p className="text-text-secondary max-w-xl mx-auto">Our Expected Realized Value (ERV) engine handles the complex market calculations automatically.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="glass glass-interactive p-8 rounded-2xl border border-border group hover:border-action/30 transition-all">
            <div className="w-12 h-12 mb-6 rounded-xl bg-action/10 flex items-center justify-center text-action group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </div>
            <h3 className="font-display text-xl text-text-primary mb-3">1. Snap & Upload</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Field agent photographs the produce. Voice input (IVR) is supported for logistics—no manual typing needed.
            </p>
          </div>

          {/* Step 2 */}
          <div className="glass glass-interactive p-8 rounded-2xl border border-border group hover:border-fresh/30 transition-all">
            <div className="w-12 h-12 mb-6 rounded-xl bg-fresh/10 flex items-center justify-center text-fresh group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <h3 className="font-display text-xl text-text-primary mb-3">2. AI Quality Grade</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Gemini Vision instantly analyzes physical traits and assigns a quality grade (A/B/C) to determine shelf life.
            </p>
          </div>

          {/* Step 3 */}
          <div className="glass glass-interactive p-8 rounded-2xl border border-border group hover:border-info/30 transition-all">
            <div className="w-12 h-12 mb-6 rounded-xl bg-info/10 flex items-center justify-center text-info group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            </div>
            <h3 className="font-display text-xl text-text-primary mb-3">3. Smart Routing</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              The ERV engine calculates whether you should DISPATCH NOW to a specific market, or WAIT for better prices.
            </p>
          </div>
        </div>
      </section>

      {/* --- TECHNICAL ARCHITECTURE --- */}
      <section className="relative z-10 border-t border-border/50 bg-background/30 py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-display text-text-primary mb-12">Built for scale and speed</h2>
          
          <div className="glass p-8 sm:p-12 rounded-3xl border border-border">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 flex-wrap">
              <div className="px-6 py-3 rounded-xl bg-glass-strong border border-border text-text-secondary font-mono text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-action"></span> Next.js 16
              </div>
              <span className="text-text-muted hidden sm:block">→</span>
              <div className="px-6 py-3 rounded-xl bg-glass-strong border border-border text-text-secondary font-mono text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-fresh"></span> Spring Boot 4.1
              </div>
              <span className="text-text-muted hidden sm:block">→</span>
              <div className="px-6 py-3 rounded-xl bg-glass-strong border border-border text-text-secondary font-mono text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-info"></span> Gemini 3.5 Flash
              </div>
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 flex-wrap">
              <div className="px-6 py-3 rounded-xl bg-glass-strong border border-border text-text-secondary font-mono text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-caution"></span> PostgreSQL (Neon)
              </div>
              <span className="text-text-muted hidden sm:block">+</span>
              <div className="px-6 py-3 rounded-xl bg-glass-strong border border-border text-text-secondary font-mono text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-urgent"></span> Render Cloud
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="relative z-10 border-t border-border/50 py-8 px-6 text-center">
        <p className="text-sm text-text-muted font-sans">
          Built for the <span className="text-text-secondary font-medium">Google Gemini API Developer Competition 2025</span> by Team Ripenly.
        </p>
      </footer>
      
    </main>
  );
}
