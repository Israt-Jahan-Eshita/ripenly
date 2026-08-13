"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface DispatchRecord {
  dispatchId: number;
  produceType: string;
  quantity: number;
  sourceLocation: string;
  qualityGrade: string;
  decision: string;
  expectedPriceRange: string;
  status: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<DispatchRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/dispatch");
        if (!response.ok) throw new Error("Failed to fetch history");
        const data = await response.json();
        setHistory(data);
      } catch (err) {
        setError("Could not load dispatch history. Ensure the backend is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen p-6 sm:p-10 mesh-bg">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 animate-fade-in-up" style={{ opacity: 0 }}>
          <div>
            <h1 className="text-3xl font-display text-text-primary mb-2 tracking-tight">Dispatch History</h1>
            <p className="text-text-secondary text-sm">Past AI routing decisions and actual market outcomes.</p>
          </div>
          <Link href="/dispatch/new" className="btn-glow px-5 py-2.5 text-sm whitespace-nowrap text-center flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            New Dispatch
          </Link>
        </header>

        {loading ? (
          <div className="p-16 text-center animate-pulse">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full border-4 border-action/30 border-t-action animate-spin"></div>
            <p className="text-text-muted text-sm">Loading dispatch records...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center glass border-urgent/30">
            <p className="text-urgent text-sm">{error}</p>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="sm:hidden flex flex-col gap-3">
              {history.map((record, i) => {
                let gradeColor = 'text-fresh';
                let gradeBg = 'bg-fresh/15';
                if (record.qualityGrade === 'B') { gradeColor = 'text-caution'; gradeBg = 'bg-caution/15'; }
                if (record.qualityGrade === 'C') { gradeColor = 'text-urgent'; gradeBg = 'bg-urgent/15'; }

                return (
                  <div key={record.dispatchId} className="glass p-4 animate-fade-in-up" style={{ opacity: 0, animationDelay: `${(i + 1) * 0.05}s` }}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className={`w-9 h-9 rounded-xl ${gradeBg} ${gradeColor} flex items-center justify-center font-mono font-bold text-sm`}>
                          {record.qualityGrade}
                        </span>
                        <div>
                          <p className="font-medium text-text-primary text-sm">{record.produceType}</p>
                          <p className="text-[11px] font-mono text-text-muted">{record.quantity} kg · DSP-{record.dispatchId}</p>
                        </div>
                      </div>
                      <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-action/10 text-action border border-action/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-action animate-pulse"></span>{record.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs mt-3">
                      <div className="neu-inset p-2 text-center">
                        <p className="text-text-muted text-[10px] mb-0.5">Decision</p>
                        <p className="text-text-primary font-medium truncate">{record.decision}</p>
                      </div>
                      <div className="neu-inset p-2 text-center">
                        <p className="text-text-muted text-[10px] mb-0.5">Expected Price</p>
                        <p className="text-text-primary font-mono font-medium">{record.expectedPriceRange || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block glass overflow-hidden animate-fade-in-up" style={{ opacity: 0, animationDelay: '0.1s' }}>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="p-4 text-[10px] font-mono font-medium uppercase tracking-widest text-text-muted">ID / Quality</th>
                      <th className="p-4 text-[10px] font-mono font-medium uppercase tracking-widest text-text-muted">Produce & Source</th>
                      <th className="p-4 text-[10px] font-mono font-medium uppercase tracking-widest text-text-muted">Decision</th>
                      <th className="p-4 text-[10px] font-mono font-medium uppercase tracking-widest text-text-muted">Expected Price</th>
                      <th className="p-4 text-[10px] font-mono font-medium uppercase tracking-widest text-text-muted">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {history.map((record) => {
                      let gradeColor = 'text-fresh';
                      let gradeBg = 'bg-fresh/15';
                      if (record.qualityGrade === 'B') { gradeColor = 'text-caution'; gradeBg = 'bg-caution/15'; }
                      if (record.qualityGrade === 'C') { gradeColor = 'text-urgent'; gradeBg = 'bg-urgent/15'; }

                      return (
                        <tr key={record.dispatchId} className="hover:bg-glass-strong/50 transition-colors">
                          <td className="p-4 flex items-center gap-3">
                            <span className={`w-10 h-10 rounded-xl ${gradeBg} ${gradeColor} flex items-center justify-center font-mono font-bold text-sm shrink-0`}>
                              {record.qualityGrade}
                            </span>
                            <span className="text-xs font-mono text-text-muted">DSP-{record.dispatchId}</span>
                          </td>
                          <td className="p-4">
                            <p className="font-medium text-text-primary text-sm">{record.produceType}</p>
                            <p className="text-xs font-mono text-text-muted mt-1">{record.quantity} kg · {record.sourceLocation}</p>
                          </td>
                          <td className="p-4 text-sm font-medium text-action">{record.decision}</td>
                          <td className="p-4 font-mono text-sm text-text-primary">{record.expectedPriceRange || 'N/A'}</td>
                          <td className="p-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-action/10 text-action border border-action/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-action animate-pulse"></span>
                              {record.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {history.length === 0 && (
                <div className="p-16 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-glass-strong flex items-center justify-center">
                    <svg className="w-6 h-6 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  </div>
                  <p className="text-text-muted text-sm">No dispatches recorded yet.</p>
                </div>
              )}
            </div>

            {/* Summary stats row */}
            <div className="grid grid-cols-2 gap-3 mt-6 animate-fade-in-up" style={{ opacity: 0, animationDelay: '0.15s' }}>
              <div className="glass p-4 text-center">
                <p className="text-2xl font-mono font-bold text-text-primary">{history.length}</p>
                <p className="text-[10px] font-mono uppercase tracking-wider text-text-muted mt-1">Total Dispatches</p>
              </div>
              <div className="glass p-4 text-center">
                <p className="text-2xl font-mono font-bold text-action">{history.filter(r => r.status === 'DECISION_READY').length}</p>
                <p className="text-[10px] font-mono uppercase tracking-wider text-text-muted mt-1">Active</p>
              </div>
            </div>
          </>
        )}
        
      </div>
    </div>
  );
}
