"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatchData } from "../DispatchContext";
import Link from "next/link";

export default function ResultPage() {
  const router = useRouter();
  const { result } = useDispatchData();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!result) router.push("/dispatch/new");
  }, [result, router]);

  if (!mounted || !result) return null;

  const topMarkets = result.recommendedMarkets?.length > 0 ? result.recommendedMarkets : [];
  const bestMarket = topMarkets[0];
  const isSellNow = result.decision === "SELL_NOW" || result.decision === "DISPATCH_NOW";

  // Grade color logic
  const gradeColor = result.qualityGrade === 'A' ? 'text-fresh' : result.qualityGrade === 'B' ? 'text-caution' : 'text-urgent';
  const gradeBg = result.qualityGrade === 'A' ? 'bg-fresh/15' : result.qualityGrade === 'B' ? 'bg-caution/15' : 'bg-urgent/15';

  const mFactors = result.marketFactors || {};
  const factors = [
    { label: "Demand Score", value: `${mFactors['Demand'] || 0}/100`, pct: mFactors['Demand'] || 0, color: "bg-fresh" },
    { label: "Price Score", value: `${mFactors['Price'] || 0}/100`, pct: mFactors['Price'] || 0, color: "bg-action" },
    { label: "Transport", value: `${mFactors['Transport'] || 0}/100`, pct: mFactors['Transport'] || 0, color: "bg-caution" },
    { label: "Spoilage Risk", value: `${mFactors['Spoilage Risk'] || 0}/100`, pct: mFactors['Spoilage Risk'] || 0, color: "bg-urgent" },
  ];

  return (
    <div className="min-h-screen p-6 sm:p-10 mesh-bg">
      <div className="max-w-3xl mx-auto">
        
        {/* Header - What do I have? */}
        <div className="text-center mb-8 animate-fade-in-up" style={{ opacity: 0 }}>
          <h1 className="text-xl sm:text-2xl font-medium text-text-primary mb-3">
            {result.quantity} kg {result.produceType}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            <span className="flex items-center gap-1.5 text-text-secondary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {result.sourceLocation}
            </span>
            <div className="flex items-center gap-2">
              <span className={`font-bold ${gradeColor} px-2 py-0.5 rounded-md ${gradeBg}`}>
                {result.sampleCount > 1 ? 'Composite Grade' : 'Grade'} {result.qualityGrade}
              </span>
              {result.sampleCount > 1 && (
                <span className="text-xs text-text-muted font-mono">
                  (from {result.sampleCount} samples: {result.sampleGrades})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* TOP DECISION */}
        {bestMarket && (
          <div className="mb-6 animate-fade-in-up" style={{ opacity: 0, animationDelay: '0.1s' }}>
            <div className={`relative overflow-hidden rounded-2xl p-8 sm:p-10 shadow-2xl ${isSellNow ? 'bg-gradient-to-br from-action via-action-deep to-[#166856] text-canvas shadow-action/20' : 'bg-gradient-to-br from-caution/90 via-[#8a681c] to-[#4a3b13] text-canvas shadow-caution/20'}`}>
              
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
              
              <div className="relative z-10 text-center">
                <h2 className="text-4xl sm:text-5xl font-display font-bold mb-4 tracking-tight uppercase flex items-center justify-center gap-4">
                  {isSellNow ? 'SELL NOW' : 'WAIT'}
                  <svg className="w-8 h-8 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  {bestMarket.name}
                </h2>
                
                <div className="flex flex-wrap items-center justify-center gap-6 mt-8 p-4 bg-black/20 rounded-xl backdrop-blur-sm inline-flex">
                  <div className="text-center">
                    <p className="text-white/60 text-[10px] uppercase tracking-wider mb-1">Expected Realized Value</p>
                    <p className="text-2xl font-bold font-mono">Tk {result.ervNow ? result.ervNow.toLocaleString(undefined, {maximumFractionDigits: 0}) : '---'}</p>
                  </div>
                  <div className="w-px h-8 bg-white/20"></div>
                  <div className="text-center">
                    <p className="text-white/60 text-[10px] uppercase tracking-wider mb-1">Expected Price</p>
                    <p className="text-lg font-medium font-mono">{result.expectedPriceRange || `Tk ${bestMarket.expectedPrice}/kg`}</p>
                  </div>
                  <div className="w-px h-8 bg-white/20"></div>
                  <div className="text-center">
                    <p className="text-white/60 text-[10px] uppercase tracking-wider mb-1">Estimated Window</p>
                    <p className="text-lg font-medium font-mono">~{result.spoilageWindow}h</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ERV COMPARISON & REASON */}
        {bestMarket && (
          <div className="mb-8 animate-fade-in-up" style={{ opacity: 0, animationDelay: '0.15s' }}>
            <div className="glass p-6">
              <h3 className="text-sm font-medium text-text-primary mb-4 uppercase tracking-wider text-action">Why {bestMarket.name}?</h3>
              <p className="text-text-secondary text-sm leading-relaxed mb-6">
                {result.decisionReason}
              </p>
              
              {result.ervNow && result.ervWait && (
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl border ${isSellNow ? 'border-action/30 bg-action/5' : 'border-border bg-glass-strong'}`}>
                    <p className="text-xs text-text-muted mb-1">ERV (Dispatch Today)</p>
                    <p className={`text-xl font-mono font-bold ${isSellNow ? 'text-action' : 'text-text-primary'}`}>
                      Tk {result.ervNow.toLocaleString(undefined, {maximumFractionDigits: 0})}
                    </p>
                  </div>
                  <div className={`p-4 rounded-xl border ${!isSellNow ? 'border-caution/30 bg-caution/5' : 'border-border bg-glass-strong'}`}>
                    <p className="text-xs text-text-muted mb-1">ERV (Wait 24h)</p>
                    <p className={`text-xl font-mono font-bold ${!isSellNow ? 'text-caution' : 'text-text-primary'}`}>
                      Tk {result.ervWait.toLocaleString(undefined, {maximumFractionDigits: 0})}
                    </p>
                  </div>
                </div>
              )}

              {result.forecastTrend && (
                <div className="mt-4 p-4 rounded-xl bg-glass-strong border border-border flex items-start gap-3">
                  <svg className="w-5 h-5 text-action shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wider mb-1">30-Day Predictive Trajectory</p>
                    <p className="text-sm font-medium text-text-primary">{result.forecastTrend}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* WHY — Factor Bars */}
        {bestMarket && (
          <div className="mb-8 animate-fade-in-up" style={{ opacity: 0, animationDelay: '0.2s' }}>
            <h3 className="text-sm font-medium text-text-primary mb-4 uppercase tracking-wider text-text-muted">Market Factors</h3>
            <div className="glass p-6 space-y-5">
              {factors.map((f, i) => (
                <div key={f.label} className="flex items-center gap-4">
                  <span className="w-28 text-sm font-medium text-text-secondary shrink-0">{f.label}</span>
                  <div className="flex-1 h-3 rounded-full bg-glass-strong overflow-hidden">
                    <div 
                      className={`${f.color} h-full rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${f.pct}%`, transitionDelay: `${i * 0.15}s` }}
                    ></div>
                  </div>
                  <span className="w-16 text-xs text-right font-mono text-text-primary">{f.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alternative Markets */}
        {topMarkets.length > 1 && (
          <div className="mb-8 animate-fade-in-up" style={{ opacity: 0, animationDelay: '0.3s' }}>
            <h3 className="text-sm font-medium text-text-primary mb-4 uppercase tracking-wider text-text-muted">Other Options</h3>
            <div className="flex flex-col gap-2">
              {topMarkets.slice(1).map((market: any, index: number) => (
                <div key={market.id} className="glass p-4 flex justify-between items-center hover:bg-glass-strong transition-all">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-text-muted">
                      #{index + 2}
                    </span>
                    <span className="font-medium text-text-primary text-sm">{market.name}</span>
                  </div>
                  <div className="flex gap-4 text-xs font-mono text-text-secondary">
                    <span>Tk {market.expectedPrice}/kg</span>
                    <span>~{market.transportHours}h</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Confidence & New Dispatch CTA */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border animate-fade-in-up" style={{ opacity: 0, animationDelay: '0.4s' }}>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-secondary">Decision confidence:</span>
            <span className={`text-xs font-bold px-2 py-1 rounded bg-glass-strong border border-border ${result.confidence === 'HIGH' ? 'text-fresh' : 'text-caution'}`}>
              {result.confidence || 'HIGH'}
            </span>
          </div>
          <Link href="/dispatch/new" className="text-action hover:text-action-deep text-sm transition-colors flex items-center gap-1 font-medium">
            Next Dispatch
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </Link>
        </div>

      </div>
    </div>
  );
}
