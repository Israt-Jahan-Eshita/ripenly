"use client";

import { useState, useEffect } from "react";

export default function FeedbackLoopPage() {
  const [recalibrating, setRecalibrating] = useState(true);
  const [accuracy, setAccuracy] = useState(87.4);

  useEffect(() => {
    // Simulate model recalibration
    const timer = setTimeout(() => {
      setRecalibrating(false);
      setAccuracy(89.2); // Accuracy goes up after recalibration
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const history = [
    { id: "DSP-092", market: "Bogura Wholesale", predicted: 14500, actual: 14200, variance: -2.0 },
    { id: "DSP-091", market: "Karwan Bazar", predicted: 32000, actual: 33500, variance: 4.6 },
    { id: "DSP-090", market: "Rajshahi Local", predicted: 8900, actual: 8850, variance: -0.5 },
  ];

  return (
    <div className="min-h-screen p-6 sm:p-10 mesh-bg">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 animate-fade-in-up" style={{ opacity: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl sm:text-4xl font-display text-text-primary tracking-tight">Closed-Loop Learning</h1>
            <span className="px-2 py-1 rounded bg-action/10 border border-action/20 text-[10px] font-mono text-action uppercase tracking-widest">
              Live
            </span>
          </div>
          <p className="text-text-secondary">AI decision engine continuously recalibrates based on real-world outcomes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Status Card */}
          <div className="glass p-8 rounded-2xl lg:col-span-2 relative overflow-hidden animate-fade-in-up" style={{ opacity: 0, animationDelay: '0.1s' }}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-action/5 blur-3xl rounded-full"></div>
            
            <h2 className="text-sm font-mono uppercase tracking-widest text-text-muted mb-8">Model Status</h2>
            
            <div className="flex flex-col sm:flex-row items-center gap-8">
              {/* Radial Progress / Status */}
              <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" className="text-glass-strong" />
                  <circle 
                    cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" 
                    className={`text-action transition-all duration-1000 ease-out ${recalibrating ? 'animate-pulse opacity-50' : ''}`}
                    strokeDasharray="283"
                    strokeDashoffset={283 - (283 * accuracy) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="text-center">
                  <span className="block text-3xl font-display font-bold text-text-primary">
                    {accuracy.toFixed(1)}%
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-text-muted">Accuracy</span>
                </div>
              </div>

              {/* Status text */}
              <div>
                <h3 className="text-xl font-display text-text-primary mb-2">
                  {recalibrating ? "Recalibrating ERV weights…" : "Model optimized for current market."}
                </h3>
                <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                  Ingesting latest transaction receipts to adjust price-drop velocity curves and transport latency assumptions.
                </p>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className={`w-2 h-2 rounded-full ${recalibrating ? 'bg-caution animate-pulse' : 'bg-action'}`}></span>
                  <span className={recalibrating ? 'text-caution' : 'text-action'}>
                    {recalibrating ? 'Processing Delta Variance' : 'Weights Updated'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="space-y-6 animate-fade-in-up" style={{ opacity: 0, animationDelay: '0.15s' }}>
            <div className="glass p-6 rounded-2xl">
              <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-1 block">Feedback Loops</span>
              <span className="text-3xl font-display font-bold text-text-primary">1,402</span>
              <span className="text-xs text-action flex items-center gap-1 mt-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                +42 today
              </span>
            </div>
            
            <div className="glass p-6 rounded-2xl">
              <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-1 block">Avg Variance</span>
              <span className="text-3xl font-display font-bold text-text-primary">±2.4%</span>
              <span className="text-xs text-text-secondary flex items-center gap-1 mt-1">
                Predicted vs Actual
              </span>
            </div>
          </div>
          
        </div>

        {/* Feedback History Table */}
        <div className="mt-8 animate-fade-in-up" style={{ opacity: 0, animationDelay: '0.2s' }}>
          <h3 className="text-sm font-medium text-text-primary mb-4 uppercase tracking-wider text-text-muted">Recent Validations</h3>
          
          <div className="glass rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-glass-strong text-text-secondary text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-medium">Dispatch ID</th>
                    <th className="px-6 py-4 font-medium">Market</th>
                    <th className="px-6 py-4 font-medium text-right">Predicted ERV</th>
                    <th className="px-6 py-4 font-medium text-right">Actual Value</th>
                    <th className="px-6 py-4 font-medium text-right">Variance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 text-text-primary">
                  {history.map((row) => (
                    <tr key={row.id} className="hover:bg-glass-strong/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs">{row.id}</td>
                      <td className="px-6 py-4">{row.market}</td>
                      <td className="px-6 py-4 text-right font-mono text-text-secondary">Tk {row.predicted.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right font-mono font-medium">Tk {row.actual.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`px-2 py-1 rounded text-xs font-mono ${
                          row.variance > 0 ? 'bg-fresh/10 text-fresh' : 'bg-urgent/10 text-urgent'
                        }`}>
                          {row.variance > 0 ? '+' : ''}{row.variance}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
