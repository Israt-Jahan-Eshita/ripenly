import React from 'react';

interface QualityAssessmentCardProps {
  produceType: string;
  qualityGrade: string;
  qualityNotes: string;
}

export function QualityAssessmentCard({ produceType, qualityGrade, qualityNotes }: QualityAssessmentCardProps) {
  let gradeColor = 'var(--color-fresh)';
  let gradeText = 'Optimal';
  let gradeBg = 'bg-fresh/15';
  let gradeTextClass = 'text-fresh';
  if (qualityGrade === 'B') {
    gradeColor = 'var(--color-caution)';
    gradeText = 'Acceptable';
    gradeBg = 'bg-caution/15';
    gradeTextClass = 'text-caution';
  } else if (qualityGrade === 'C') {
    gradeColor = 'var(--color-urgent)';
    gradeText = 'Substandard';
    gradeBg = 'bg-urgent/15';
    gradeTextClass = 'text-urgent';
  }

  let gaugeRotation = 90;
  if (qualityGrade === 'B') gaugeRotation = 0;
  if (qualityGrade === 'C') gaugeRotation = -90;

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="glass p-8">
        
        <h3 className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-8 border-b border-border pb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-action" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Quality Assessment
        </h3>

        <div className="flex flex-col items-center mb-8">
          
          {/* Skeuomorphic Freshness Gauge */}
          <div className="relative w-48 h-24 overflow-hidden mb-6">
            {/* Gauge track */}
            <div className="absolute inset-0 rounded-t-full border-[12px] border-glass-strong shadow-inner"></div>
            
            {/* Color gradient arc */}
            <div className="absolute inset-0 rounded-t-full border-[12px] border-transparent" 
                 style={{
                   background: `conic-gradient(from 180deg at 50% 100%, var(--color-urgent) 0deg, var(--color-caution) 90deg, var(--color-fresh) 180deg)`,
                   WebkitMask: `radial-gradient(100% 200% at 50% 100%, transparent 45%, black 46%)`,
                   mask: `radial-gradient(100% 200% at 50% 100%, transparent 45%, black 46%)`
                 }}>
            </div>

            {/* Needle */}
            <div 
              className="absolute bottom-0 left-1/2 w-1 h-20 -ml-[2px] origin-bottom transition-transform duration-[1000ms] ease-out"
              style={{ transform: `rotate(${gaugeRotation}deg)` }}
            >
              <div className="w-full h-full bg-text-primary rounded-t-full shadow-lg"></div>
              <div className="absolute -bottom-2 -left-2 w-5 h-5 rounded-full border-2 border-text-primary shadow-lg flex items-center justify-center" style={{ background: 'var(--color-surface-solid)' }}>
                 <div className="w-1.5 h-1.5 bg-text-primary rounded-full"></div>
              </div>
            </div>

            {/* Glow behind needle tip */}
            <div 
              className="absolute bottom-0 left-1/2 w-6 h-6 -ml-3 rounded-full blur-md transition-transform duration-[1000ms] ease-out"
              style={{ 
                transform: `rotate(${gaugeRotation}deg) translateY(-72px)`, 
                transformOrigin: 'center bottom',
                background: gradeColor,
                opacity: 0.4
              }}
            ></div>
          </div>

          <div className="text-center">
            <span className="text-5xl font-display font-bold block mb-2" style={{ color: gradeColor }}>
              Grade {qualityGrade}
            </span>
            <span className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${gradeBg} ${gradeTextClass}`}>
              {gradeText} {produceType}
            </span>
          </div>
        </div>

        {/* AI Notes */}
        <div className="neu-inset p-5">
          <h4 className="text-[10px] font-mono font-medium uppercase tracking-widest text-text-muted mb-3 flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-action" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Analysis Notes
          </h4>
          <p className="text-sm leading-relaxed text-text-secondary">
            {qualityNotes}
          </p>
        </div>

      </div>
    </div>
  );
}
