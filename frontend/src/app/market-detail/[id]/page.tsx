"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface MarketData {
  id: string;
  name: string;
  expectedPrice: number;
  demandScore: number;
  transportHours: number;
  transportCost: number;
  gradeCompatibility: string[];
}

export default function MarketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  
  const [market, setMarket] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarket = async () => {
      try {
        const apiUrl = "https://ripenly-backend.onrender.com";
        const res = await fetch(`${apiUrl}/api/markets/${id}`);
        if (!res.ok) throw new Error("Market not found");
        const data = await res.json();
        setMarket(data);
      } catch (err) {
        setError("This market doesn't exist in the demo dataset.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchMarket();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center mesh-bg p-8">
        <div className="w-12 h-12 rounded-full border-4 border-action/30 border-t-action animate-spin"></div>
      </div>
    );
  }

  if (error || !market) {
    return (
      <div className="min-h-screen flex items-center justify-center mesh-bg p-8">
        <div className="glass p-8 max-w-md w-full text-center animate-scale-in">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-urgent/15 flex items-center justify-center">
            <svg className="w-7 h-7 text-urgent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
          </div>
          <h1 className="text-xl font-display text-text-primary mb-2">Market Not Found</h1>
          <p className="text-text-secondary text-sm mb-6">{error}</p>
          <Link href="/history" className="btn-glow px-6 py-3 text-sm inline-block">Return to Dashboard</Link>
        </div>
      </div>
    );
  }

  // Derive display values
  const demandTrend = market.demandScore > 1.0 ? "Rising" : market.demandScore < 0.8 ? "Falling" : "Stable";
  const recommendationScore = Math.min(100, Math.floor((market.demandScore * 40) + (market.expectedPrice / 2)));
  
  // Mock price history based on base price for the sparkline
  const basePrice = market.expectedPrice;
  const priceHistory = [
    basePrice * 0.85,
    basePrice * 0.90,
    basePrice * 0.88,
    basePrice * 0.92,
    basePrice * 0.95,
    basePrice * 0.98,
    basePrice
  ];

  // SVG Sparkline logic
  const maxPrice = Math.max(...priceHistory);
  const minPrice = Math.min(...priceHistory);
  const range = maxPrice - minPrice || 1;
  const width = 260;
  const height = 60;
  const step = width / (priceHistory.length - 1);
  const points = priceHistory.map((price, index) => {
    const x = index * step;
    const y = height - ((price - minPrice) / range) * height;
    return `${x},${y}`;
  }).join(" ");

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <div className="min-h-screen p-6 sm:p-10 mesh-bg">
      <div className="max-w-3xl mx-auto">
        
        {/* Back button */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-action transition-colors mb-6 animate-fade-in"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back
        </button>

        {/* Hero Header */}
        <div className="glass p-6 sm:p-8 mb-6 animate-fade-in-up" style={{ opacity: 0 }}>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div>
              <h1 className="text-3xl font-display text-text-primary mb-3 tracking-tight">{market.name}</h1>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-fresh/10 text-fresh border border-fresh/20">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  {demandTrend}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-glass-strong text-text-secondary border border-border">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {market.transportHours}h transit
                </span>
              </div>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <span className="block text-[10px] font-mono uppercase tracking-widest text-text-muted mb-1">Expected Price</span>
              <span className="block text-3xl font-mono font-bold text-action">Tk {market.expectedPrice}</span>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Constraints & CTA */}
          <div className="glass p-6 flex flex-col justify-between animate-fade-in-up" style={{ opacity: 0, animationDelay: '0.1s' }}>
            <div>
              <h2 className="text-[10px] font-mono font-medium uppercase tracking-widest text-text-muted mb-4">Market Constraints</h2>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3 text-sm text-text-secondary">
                  <div className="w-6 h-6 rounded-lg bg-fresh/15 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-fresh" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  Accepts Grade {market.gradeCompatibility.join(", ")} produce.
                </li>
                {market.gradeCompatibility.length < 3 && (
                  <li className="flex items-start gap-3 text-sm text-text-secondary">
                    <div className="w-6 h-6 rounded-lg bg-urgent/15 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-3.5 h-3.5 text-urgent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </div>
                    Strict rejection of substandard grades.
                  </li>
                )}
                <li className="flex items-start gap-3 text-sm text-text-secondary">
                  <div className="w-6 h-6 rounded-lg bg-action/15 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-action" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z" /></svg>
                  </div>
                  Recommendation score: <strong className="text-text-primary ml-1">{recommendationScore}/100</strong>
                </li>
              </ul>
            </div>
            <button className="btn-glow w-full py-3.5 text-sm flex items-center justify-center gap-2">
              Dispatch to this market
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>

          {/* Price Trend Sparkline */}
          <div className="glass p-6 animate-fade-in-up" style={{ opacity: 0, animationDelay: '0.15s' }}>
            <h2 className="text-[10px] font-mono font-medium uppercase tracking-widest text-text-muted mb-4 flex justify-between items-center">
              7-Day Price Trend
              <span className="text-xs normal-case font-mono bg-glass-strong px-2 py-0.5 rounded border border-border text-text-secondary">
                Tk / kg
              </span>
            </h2>
            
            <div className="h-40 flex items-center justify-center py-4">
              <svg width={width} height={height} className="overflow-visible">
                {/* Area fill */}
                <defs>
                  <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="var(--color-action)" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="var(--color-action)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polygon fill="url(#areaGrad)" points={areaPoints} />
                {/* Line */}
                <polyline
                  fill="none"
                  stroke="var(--color-action)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={points}
                />
                {/* Current value dot with glow */}
                <circle 
                  cx={width} 
                  cy={height - ((priceHistory[priceHistory.length - 1] - minPrice) / range) * height} 
                  r="6" 
                  fill="var(--color-canvas)" 
                  stroke="var(--color-action)"
                  strokeWidth="2.5" 
                />
                <circle 
                  cx={width} 
                  cy={height - ((priceHistory[priceHistory.length - 1] - minPrice) / range) * height} 
                  r="12" 
                  fill="var(--color-action)" 
                  opacity="0.15"
                />
              </svg>
            </div>
            
            <div className="flex justify-between text-xs font-mono text-text-muted border-t border-border pt-3 mt-2">
              <span>7d ago</span>
              <span className="text-action font-medium">Today</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
