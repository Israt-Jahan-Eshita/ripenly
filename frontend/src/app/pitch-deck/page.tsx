"use client";

import { useState } from "react";

const slides = [
  {
    id: "title",
    tag: null,
    content: (
      <div className="text-center py-8">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-action to-action-deep flex items-center justify-center shadow-xl shadow-action/25 animate-pulse-glow">
          <span className="font-display font-bold text-4xl text-canvas leading-none">R</span>
        </div>
        <h1 className="text-5xl sm:text-6xl font-display text-text-primary mb-4 tracking-tight">Ripenly</h1>
        <p className="text-lg text-text-secondary max-w-md mx-auto leading-relaxed">
          AI Multimodal Decision Engine for Perishable Produce Routing
        </p>
        <div className="flex justify-center gap-2 mt-6">
          {["Gemini 3.5 Flash", "Computer Vision", "ERV Scoring"].map(t => (
            <span key={t} className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-glass-strong border border-border text-text-muted">{t}</span>
          ))}
        </div>
      </div>
    )
  },
  {
    id: "problem",
    tag: "The Problem",
    content: (
      <div>
        <h2 className="text-3xl sm:text-4xl font-display text-text-primary mb-6 tracking-tight">
          Produce rots in transit because routing is <span className="text-urgent">blind</span>.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { stat: "40%", desc: "Post-harvest losses in Bangladesh for perishables", color: "text-urgent" },
            { stat: "12h+", desc: "Typical transit times with no quality awareness", color: "text-caution" },
            { stat: "₹0", desc: "Data used by agents for routing decisions today", color: "text-text-muted" },
          ].map(item => (
            <div key={item.stat} className="neu-inset p-5 text-center">
              <p className={`text-3xl font-mono font-bold ${item.color} mb-2`}>{item.stat}</p>
              <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-text-secondary leading-relaxed">
          Agricultural agents dispatch highly perishable goods without knowing shelf-life windows. Grade-C produce gets sent on long journeys and arrives spoiled, while premium produce is sold at undervalued local markets.
        </p>
      </div>
    )
  },
  {
    id: "solution",
    tag: "The Solution",
    content: (
      <div>
        <h2 className="text-3xl sm:text-4xl font-display text-text-primary mb-8 tracking-tight">
          Visual assessment meets <span className="text-action">intelligent routing</span>.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z", title: "AI Vision Grading", desc: "Gemini 3.5 Flash evaluates photographic evidence to assign real-time quality grades and spoilage windows." },
            { icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", title: "ERV Scoring", desc: "Expected Realized Value engine cross-references shelf life, market demand, and transit times." },
            { icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", title: "Smart Routing", desc: "Ranks all destination markets and recommends the highest-value one with explainable reasoning." },
            { icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z", title: "Voice + Photo Input", desc: "Field agents use voice dictation and camera — no typing, no literacy requirement." },
          ].map(item => (
            <div key={item.title} className="glass p-5 glow-border group hover:bg-glass-strong transition-all">
              <div className="w-10 h-10 rounded-xl bg-action/15 flex items-center justify-center mb-3 group-hover:bg-action/25 transition-colors">
                <svg className="w-5 h-5 text-action" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} /></svg>
              </div>
              <h3 className="font-medium text-text-primary text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: "how",
    tag: "How It Works",
    content: (
      <div>
        <h2 className="text-3xl font-display text-text-primary mb-6 tracking-tight">The pipeline</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          
          {/* Steps */}
          <div className="flex flex-col gap-3">
            {[
              { step: "01", label: "Agent photographs produce in the field", icon: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" },
              { step: "02", label: "Gemini Vision assesses quality grade (A/B/C)", icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
              { step: "03", label: "Decision engine estimates spoilage window", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
              { step: "04", label: "ERV engine ranks all destination markets", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z" },
              { step: "05", label: "Agent receives: SELL NOW → Market", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
            ].map((item, i) => (
              <div key={item.step} className="flex items-center gap-3 p-3 rounded-xl bg-glass hover:bg-glass-strong transition-all group">
                <div className="w-8 h-8 rounded-lg bg-action/15 flex items-center justify-center shrink-0 group-hover:bg-action/25 transition-colors">
                  <span className="font-mono text-[10px] font-bold text-action">{item.step}</span>
                </div>
                <span className="text-xs text-text-primary font-medium">{item.label}</span>
                {i === 4 && <span className="ml-auto text-xs font-mono text-action">✓</span>}
              </div>
            ))}
          </div>

          {/* Architecture Diagram */}
          <div className="glass p-5 rounded-2xl flex flex-col justify-between border border-border/50">
             <h3 className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-4">Architecture</h3>
             <div className="flex flex-col items-center gap-2 text-xs font-mono text-text-secondary w-full">
               <div className="px-4 py-2 rounded bg-glass-strong w-full text-center text-text-primary">Agent Interface</div>
               <div className="h-4 w-px bg-action/50"></div>
               <div className="px-4 py-2 rounded bg-action/10 border border-action/20 text-action w-full text-center">Next.js Frontend</div>
               <div className="h-4 w-px bg-action/50"></div>
               <div className="p-3 rounded bg-glass-strong w-full flex flex-col gap-1.5 border border-border">
                 <div className="font-bold text-text-primary text-center mb-1 border-b border-border/50 pb-1">Spring Boot Backend</div>
                 <div className="grid grid-cols-2 gap-1.5">
                   <div className="bg-canvas p-1 text-center rounded text-[9px]">Gemini Vision</div>
                   <div className="bg-canvas p-1 text-center rounded text-[9px]">Perishability</div>
                   <div className="bg-canvas p-1 text-center rounded text-[9px]">Market Ranking</div>
                   <div className="bg-canvas p-1 text-center rounded text-[9px]">ERV Engine</div>
                 </div>
               </div>
               <div className="h-4 w-px bg-action/50"></div>
               <div className="flex w-full gap-2 justify-center">
                 <div className="px-4 py-2 rounded bg-glass-strong border border-border flex-1 text-center">PostgreSQL</div>
                 <div className="px-4 py-2 rounded bg-fresh/10 border border-fresh/20 text-fresh flex-1 text-center">Decision UI</div>
               </div>
             </div>
          </div>

        </div>
      </div>
    )
  },
  {
    id: "impact",
    tag: "Impact & Validation",
    content: (
      <div>
        <h2 className="text-3xl font-display text-text-primary mb-8 tracking-tight">Pilot Targets</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="glass p-6 text-center animate-pulse-glow">
            <p className="text-5xl font-mono font-bold text-fresh mb-2">-15%</p>
            <p className="text-sm text-text-secondary">Reduction in transit spoilage by preventing Grade C on long routes</p>
          </div>
          <div className="glass p-6 text-center">
            <p className="text-5xl font-mono font-bold text-action mb-2">+10%</p>
            <p className="text-sm text-text-secondary">Revenue increase by matching high-grade produce to premium markets</p>
          </div>
        </div>
        <div className="glass p-6">
          <h3 className="text-sm font-medium text-text-primary mb-3">Tech Stack</h3>
          <div className="flex flex-wrap gap-2">
            {["Gemini 3.5 Flash", "Spring Boot 4.1", "Next.js 16.3", "PostgreSQL / Neon", "Tailwind CSS v4", "Web Speech API"].map(t => (
              <span key={t} className="text-xs font-mono px-3 py-1.5 rounded-lg bg-glass-strong border border-border text-text-secondary">{t}</span>
            ))}
          </div>
        </div>
      </div>
    )
  }
];

export default function PitchDeckPage() {
  const [current, setCurrent] = useState(0);

  return (
    <div className="min-h-screen p-6 sm:p-10 mesh-bg">
      <div className="max-w-3xl mx-auto">

        {/* Slide navigation dots */}
        <div className="flex items-center justify-center gap-2 mb-8 animate-fade-in">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? 'w-8 bg-action' : 'w-1.5 bg-glass-strong hover:bg-text-muted'
              }`}
            />
          ))}
        </div>

        {/* Active Slide */}
        <div className="glass p-8 sm:p-12 min-h-[60vh] flex flex-col justify-center animate-scale-in" key={current}>
          {slides[current].tag && (
            <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-action mb-6 px-3 py-1 rounded-full bg-action/10 border border-action/20 self-start">
              {slides[current].tag}
            </span>
          )}
          {slides[current].content}
        </div>

        {/* Navigation arrows */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setCurrent(Math.max(0, current - 1))}
            disabled={current === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-glass-strong transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Previous
          </button>

          <span className="text-xs font-mono text-text-muted">
            {current + 1} / {slides.length}
          </span>

          <button
            onClick={() => setCurrent(Math.min(slides.length - 1, current + 1))}
            disabled={current === slides.length - 1}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-glass-strong transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        <div className="text-center mt-8">
          <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider">Hackathon MVP · Demo Environment · Powered by Gemini</p>
        </div>
      </div>
    </div>
  );
}
