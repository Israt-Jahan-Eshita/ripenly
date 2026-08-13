import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 sm:p-8 mesh-bg relative overflow-hidden">

      {/* Ambient floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-action/5 blur-3xl animate-float pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-fresh/4 blur-3xl animate-float pointer-events-none" style={{ animationDelay: '3s' }}></div>

      <div className="relative z-10 glass p-10 sm:p-14 max-w-xl w-full text-center animate-scale-in">
        
        {/* Gradient logo mark */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-action to-action-deep flex items-center justify-center shadow-xl shadow-action/25 animate-pulse-glow">
          <span className="font-display font-bold text-4xl text-canvas leading-none">R</span>
        </div>

        <h1 className="font-display text-5xl sm:text-6xl text-text-primary mb-3 tracking-tight">Ripenly</h1>
        <p className="font-sans text-base sm:text-lg text-text-secondary mb-4 leading-relaxed max-w-md mx-auto">
          AI-powered decision engine for perishable produce routing.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {["Gemini Vision", "ERV Scoring", "Smart Routing"].map((tag) => (
            <span key={tag} className="text-xs font-medium px-3 py-1.5 rounded-full bg-glass-strong border border-border text-text-secondary">
              {tag}
            </span>
          ))}
        </div>
        
        {/* Primary CTA */}
        <Link 
          href="/dispatch/new"
          className="btn-glow w-full block py-4 text-lg font-semibold tracking-wide text-center"
        >
          Start New Dispatch
        </Link>

        {/* Secondary link */}
        <Link
          href="/sign-in"
          className="inline-block mt-4 text-sm text-text-muted hover:text-action transition-colors"
        >
          Sign in as Agent →
        </Link>

        {/* Status indicator */}
        <div className="mt-10 pt-6 border-t border-border flex items-center justify-center gap-6 text-xs font-mono text-text-muted">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-action animate-pulse"></span>
            Gemini 2.5 Flash
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-fresh"></span>
            3 Markets Live
          </div>
        </div>

      </div>
    </main>
  );
}
