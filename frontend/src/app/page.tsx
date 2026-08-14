import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen mesh-bg relative flex flex-col items-center justify-center p-6 overflow-hidden">
      
      {/* Subtle background ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-action/5 blur-[120px] pointer-events-none mix-blend-screen animate-float"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-fresh/5 blur-[120px] pointer-events-none mix-blend-screen animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 w-full max-w-3xl mx-auto text-center flex flex-col items-center">
        
        {/* Brand Logo */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 mb-8 rounded-3xl bg-gradient-to-br from-action to-action-deep flex items-center justify-center shadow-2xl shadow-action/20 animate-scale-in">
          <span className="font-display font-bold text-3xl sm:text-4xl text-canvas leading-none">R</span>
        </div>

        {/* Hero Headline */}
        <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl text-text-primary tracking-tight mb-6 animate-fade-in-up">
          Stop guessing.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-action to-fresh">
            Start profiting.
          </span>
        </h1>

        {/* Hero Subheadline */}
        <p className="font-sans text-lg sm:text-xl text-text-secondary leading-relaxed max-w-xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          The intelligent routing engine for agricultural supply chains. Maximize the value of your perishable produce before it spoils.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <Link 
            href="/dispatch/new"
            className="w-full sm:w-auto btn-glow px-8 py-4 text-base sm:text-lg font-semibold tracking-wide rounded-2xl flex items-center justify-center gap-2"
          >
            Start New Dispatch
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </Link>
          
          <Link
            href="/sign-in"
            className="w-full sm:w-auto glass px-8 py-4 text-base sm:text-lg font-medium text-text-secondary border border-border rounded-2xl hover:bg-glass-strong hover:text-text-primary transition-all flex items-center justify-center"
          >
            Sign in to Dashboard
          </Link>
        </div>

      </div>

      {/* Trust Indicators / Stats */}
      <div className="relative z-10 mt-24 sm:mt-32 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-12 text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <div className="glass p-6 rounded-2xl border border-border/50">
          <div className="text-3xl sm:text-4xl font-display text-action font-medium mb-2">40%</div>
          <div className="text-sm text-text-muted font-sans">Reduction in food waste</div>
        </div>
        <div className="glass p-6 rounded-2xl border border-border/50">
          <div className="text-3xl sm:text-4xl font-display text-text-primary font-medium mb-2">&lt; 10s</div>
          <div className="text-sm text-text-muted font-sans">Instant AI quality grading</div>
        </div>
        <div className="glass p-6 rounded-2xl border border-border/50">
          <div className="text-3xl sm:text-4xl font-display text-fresh font-medium mb-2">2x</div>
          <div className="text-sm text-text-muted font-sans">Average profit uplift</div>
        </div>
      </div>
      
    </main>
  );
}
