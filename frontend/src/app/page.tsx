import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen mesh-bg relative overflow-hidden">

      {/* Ambient floating orbs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-action/8 blur-[120px] animate-float pointer-events-none"></div>
      <div className="absolute bottom-20 right-1/5 w-[500px] h-[500px] rounded-full bg-fresh/5 blur-[140px] animate-float pointer-events-none" style={{ animationDelay: '3s' }}></div>
      <div className="absolute top-1/2 left-1/2 w-72 h-72 rounded-full bg-info/4 blur-[100px] animate-float pointer-events-none" style={{ animationDelay: '5s' }}></div>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-20">
        
        {/* Status badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-glass-strong border border-border mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-fresh animate-pulse"></span>
          <span className="text-xs font-mono text-text-muted tracking-wide">POWERED BY GEMINI 3.5 FLASH</span>
        </div>

        {/* Logo + Title */}
        <div className="flex items-center gap-4 mb-6 animate-scale-in">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-action to-action-deep flex items-center justify-center shadow-xl shadow-action/25 animate-pulse-glow">
            <span className="font-display font-bold text-3xl text-canvas leading-none">R</span>
          </div>
          <h1 className="font-display text-5xl sm:text-7xl text-text-primary tracking-tight">Ripenly</h1>
        </div>

        <p className="text-lg sm:text-xl text-text-secondary text-center max-w-2xl mb-4 animate-fade-in-up leading-relaxed">
          AI-powered decision engine that tells farmers <span className="text-action font-semibold">when, where, and how</span> to sell perishable produce — before it spoils.
        </p>

        <p className="text-sm text-text-muted text-center max-w-lg mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          Snap a photo. Get an instant quality grade. Receive the optimal market routing with explainable AI reasoning.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-20 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Link 
            href="/dispatch/new"
            className="btn-glow px-10 py-4 text-lg font-semibold tracking-wide text-center"
          >
            🚀 Start New Dispatch
          </Link>
          <Link
            href="/sign-in"
            className="glass-interactive px-10 py-4 text-lg font-medium tracking-wide text-center border border-border rounded-xl text-text-secondary hover:text-text-primary transition-colors"
          >
            Sign in as Agent →
          </Link>
        </div>

        {/* How It Works - 3 Step Flow */}
        <div className="w-full max-w-4xl animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <h2 className="text-center text-xs font-mono text-text-muted tracking-[0.2em] uppercase mb-8">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="glass glass-interactive p-6 text-center group">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-action/20 to-action/5 border border-action/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                📸
              </div>
              <h3 className="font-display text-lg text-text-primary mb-2">Snap & Upload</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Field agent photographs the produce. Voice input supported — no typing needed.
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass glass-interactive p-6 text-center group">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-fresh/20 to-fresh/5 border border-fresh/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🧠
              </div>
              <h3 className="font-display text-lg text-text-primary mb-2">AI Grades & Scores</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Gemini Vision grades quality (A/B/C). ERV engine calculates expected realized value.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass glass-interactive p-6 text-center group">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-info/20 to-info/5 border border-info/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                📊
              </div>
              <h3 className="font-display text-lg text-text-primary mb-2">Smart Decision</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                DISPATCH NOW or WAIT? AI picks the optimal market route to maximize farmer revenue.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative z-10 border-t border-border py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div className="animate-fade-in-up">
            <div className="text-3xl font-display text-action font-bold">40%</div>
            <div className="text-xs text-text-muted mt-1 font-mono">FOOD WASTE REDUCED</div>
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="text-3xl font-display text-fresh font-bold">3</div>
            <div className="text-xs text-text-muted mt-1 font-mono">MARKETS LIVE</div>
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="text-3xl font-display text-info font-bold">&lt;10s</div>
            <div className="text-xs text-text-muted mt-1 font-mono">AI GRADING TIME</div>
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="text-3xl font-display text-caution font-bold">2x</div>
            <div className="text-xs text-text-muted mt-1 font-mono">REVENUE UPLIFT</div>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="relative z-10 border-t border-border py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xs font-mono text-text-muted tracking-[0.2em] uppercase mb-8">Architecture</h2>
          <div className="glass p-8 font-mono text-sm text-text-secondary leading-loose">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap">
              <span className="px-4 py-2 rounded-lg bg-action/10 border border-action/20 text-action">📱 Next.js Frontend</span>
              <span className="text-text-muted">→</span>
              <span className="px-4 py-2 rounded-lg bg-fresh/10 border border-fresh/20 text-fresh">⚙️ Spring Boot API</span>
              <span className="text-text-muted">→</span>
              <span className="px-4 py-2 rounded-lg bg-info/10 border border-info/20 text-info">🧠 Gemini 3.5 Flash</span>
            </div>
            <div className="mt-4 flex items-center justify-center gap-3">
              <span className="px-4 py-2 rounded-lg bg-caution/10 border border-caution/20 text-caution">🗄️ PostgreSQL / Neon</span>
              <span className="text-text-muted">+</span>
              <span className="px-4 py-2 rounded-lg bg-urgent/10 border border-urgent/20 text-urgent">☁️ Render Cloud</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Pills */}
      <section className="relative z-10 border-t border-border py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-center text-xs font-mono text-text-muted tracking-[0.2em] uppercase mb-6">Tech Stack</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {["Next.js 16.3", "Spring Boot 4.1", "Gemini 3.5 Flash", "PostgreSQL / Neon", "Tailwind CSS v4", "Web Speech API", "pHash Fraud Detection"].map(t => (
              <span key={t} className="text-xs font-mono px-4 py-2 rounded-full bg-glass-strong border border-border text-text-secondary hover:border-action/30 hover:text-action transition-all cursor-default">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8 px-6 text-center">
        <p className="text-xs text-text-muted font-mono">
          Built for Google Gemini API Developer Competition 2025 · Team Ripenly
        </p>
      </footer>
    </main>
  );
}
