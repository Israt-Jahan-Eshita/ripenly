"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDispatchData } from "../DispatchContext";

export default function ProcessingPage() {
  const router = useRouter();
  const { files, produceType, quantity, sourceLocation, setResult } = useDispatchData();
  
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [activeStage, setActiveStage] = useState(0);
  const hasFetched = useRef(false);

  const stages = [
    { label: "Reading produce image", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { label: "Assessing visible quality", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "Estimating perishability", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "Ranking destination markets", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
    { label: "Calculating expected realized value", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
  ];

  useEffect(() => {
    if (files.length === 0 || hasFetched.current) {
      if (files.length === 0) setError("Missing dispatch data. Please go back and upload an image.");
      return;
    }
    hasFetched.current = true;

    const interval = setInterval(() => {
      setActiveStage(prev => (prev < stages.length - 1 ? prev + 1 : prev));
    }, 1500);

    const performAnalysis = async () => {
      try {
        const formData = new FormData();
        files.forEach(f => formData.append("files", f));
        formData.append("produceType", produceType);
        formData.append("quantity", quantity);
        formData.append("sourceLocation", sourceLocation);
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
        const response = await fetch(`${apiUrl}/api/dispatch/analyze`, { method: "POST", body: formData });
        if (!response.ok) {
          let errMsg = "Analysis failed. Please try again.";
          try {
            const errData = await response.json();
            if (errData.error) errMsg = errData.error;
          } catch { /* fallback to generic */ }
          throw new Error(errMsg);
        }
        const data = await response.json();
        setResult(data);
        clearInterval(interval);
        setIsComplete(true);
        setActiveStage(stages.length);
        setTimeout(() => { router.push(`/dispatch/result?id=${data.dispatchId}`); }, 1200);
      } catch (err: any) {
        clearInterval(interval);
        console.error(err);
        setError(err.message || "Analysis temporarily unavailable. Is the backend running?");
      }
    };
    performAnalysis();
    return () => clearInterval(interval);
  }, [files, produceType, quantity, sourceLocation, router, setResult, stages.length, retryCount]);

  const handleRetry = () => {
    setError("");
    setActiveStage(0);
    setIsComplete(false);
    hasFetched.current = false;
    setRetryCount(prev => prev + 1);
  };

  if (error) {
    const isQuota = error.toLowerCase().includes("quota") || error.toLowerCase().includes("limit") || error.toLowerCase().includes("retry");
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 mesh-bg">
        <div className="glass p-8 max-w-md w-full text-center animate-scale-in">
          <div className={`w-14 h-14 mx-auto mb-4 rounded-full ${isQuota ? "bg-caution/15" : "bg-urgent/15"} flex items-center justify-center`}>
            <svg className={`w-7 h-7 ${isQuota ? "text-caution" : "text-urgent"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
          </div>
          <h2 className="text-xl font-display mb-3 text-text-primary">
            {isQuota ? "AI Service Busy" : "Analysis Failed"}
          </h2>
          <p className="text-text-secondary text-sm mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={handleRetry} className="btn-glow px-6 py-3 text-sm">
              Retry Analysis
            </button>
            <button onClick={() => router.push("/dispatch/new")} className="px-6 py-3 text-sm text-text-secondary hover:text-text-primary rounded-xl hover:bg-glass-strong transition-colors">
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 mesh-bg relative overflow-hidden">
      
      {/* Animated background pulse */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full bg-action/5 animate-pulse-glow blur-3xl"></div>
      </div>

      <div className="relative z-10 glass w-full max-w-lg p-10 animate-scale-in">
        
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-display text-text-primary mb-2 tracking-tight">Analyzing Dispatch</h2>
          <p className="text-sm text-text-secondary">Gemini is evaluating your field inputs…</p>
        </div>

        {/* Pipeline steps */}
        <div className="flex flex-col gap-4 w-full">
          {stages.map((stage, index) => {
            const isDone = isComplete;
            const isActive = !isComplete && index === activeStage;
            const isPending = !isComplete && index > activeStage;

            return (
              <div 
                key={index} 
                className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-500 ${
                  isDone ? 'bg-fresh/8' : isActive ? 'bg-action/8 animate-pulse-glow' : isPending ? 'opacity-30' : 'bg-glass'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Status icon */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 ${
                  isDone ? 'bg-fresh/20 text-fresh' : 
                  isActive ? 'bg-action/20 text-action' : 
                  'bg-glass-strong text-text-muted'
                }`}>
                  {isDone ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  ) : isActive ? (
                    <div className="w-4 h-4 rounded-full border-2 border-action border-t-transparent animate-spin"></div>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stage.icon} /></svg>
                  )}
                </div>

                <span className={`text-sm font-medium transition-colors ${
                  isDone ? 'text-fresh' : isActive ? 'text-text-primary' : 'text-text-muted'
                }`}>
                  {stage.label}
                </span>

                {isActive && (
                  <div className="ml-auto flex gap-0.5">
                    <span className="w-1 h-1 rounded-full bg-action animate-pulse" style={{ animationDelay: '0s' }}></span>
                    <span className="w-1 h-1 rounded-full bg-action animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-1 h-1 rounded-full bg-action animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom progress bar */}
        <div className="mt-8 h-1 rounded-full bg-glass-strong overflow-hidden">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-action to-fresh transition-all duration-1000 ease-out"
            style={{ width: isComplete ? '100%' : `${((activeStage + 1) / stages.length) * 100}%` }}
          ></div>
        </div>
      
      </div>
    </div>
  );
}
