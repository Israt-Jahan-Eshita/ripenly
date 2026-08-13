export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden">
      {/* Ambient background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ripeness-green opacity-[0.08] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-papaya-amber opacity-[0.08] rounded-full blur-[100px] pointer-events-none" />

      {/* Frosted Glass Panel */}
      <div className="relative z-10 p-12 rounded-[24px] bg-frost-glass backdrop-blur-xl border-t border-white/15 shadow-2xl max-w-lg w-full text-center">
        <h1 className="font-display text-5xl text-pulp-white mb-4">Ripenly</h1>
        <p className="font-sans text-lg text-pulp-white/80 mb-10 leading-relaxed">
          AI Multimodal Decision Engine for Perishable Produce
        </p>
        
        {/* Placeholder Freshness Gauge */}
        <div className="w-48 h-48 mx-auto rounded-full border-[10px] border-ripeness-green shadow-inner flex flex-col items-center justify-center mb-10 relative overflow-hidden bg-night-soil/30">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
          <span className="font-mono text-3xl font-bold text-ripeness-green mb-1">Grade A</span>
          <span className="font-mono text-sm text-pulp-white/60">36h window</span>
        </div>

        {/* Primary Action Button */}
        <button className="w-full py-4 rounded-xl bg-market-teal text-night-soil font-bold text-lg hover:bg-market-teal/90 transition-colors shadow-lg">
          Get routing decision
        </button>
      </div>
    </main>
  );
}
