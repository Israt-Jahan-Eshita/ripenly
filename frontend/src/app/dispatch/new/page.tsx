"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDispatchData } from "../DispatchContext";

export default function NewDispatchPage() {
  const router = useRouter();
  const { 
    files, setFiles, 
    produceType, setProduceType, 
    quantity, setQuantity, 
    sourceLocation, setSourceLocation 
  } = useDispatchData();
  
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startVoiceDictation = () => {
    if (!('webkitSpeechRecognition' in window)) {
      setError("Voice input is not supported in this browser.");
      return;
    }
    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';
    recognitionRef.current.onstart = () => { setIsListening(true); setError(""); };
    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      const match = transcript.match(/(\d+)\s*(kilos?|kg|pounds?|lbs?)?\s*(of\s*)?(.+)/i);
      if (match) { setQuantity(match[1]); setProduceType(match[4].trim()); }
      else { setProduceType(transcript); }
      setIsListening(false);
    };
    recognitionRef.current.onerror = () => setIsListening(false);
    recognitionRef.current.onend = () => setIsListening(false);
    recognitionRef.current.start();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files));
    }
  };

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const MAX = 1024;
          if (width > height && width > MAX) { height *= MAX / width; width = MAX; }
          else if (height > MAX) { width *= MAX / height; height = MAX; }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            if (blob) resolve(new File([blob], file.name, { type: "image/jpeg" }));
            else resolve(file);
          }, "image/jpeg", 0.7);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const processFiles = async (selectedFiles: File[]) => {
    setError("");
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    let validFiles = selectedFiles.filter(f => allowedTypes.includes(f.type) && f.size <= 5 * 1024 * 1024);
    
    if (validFiles.length < selectedFiles.length) {
      setError("Some files were rejected (must be JPEG/PNG/WEBP under 5MB).");
    }

    if (files.length + validFiles.length > 5) {
      setError("Maximum 5 images allowed. Truncating selection.");
      validFiles = validFiles.slice(0, 5 - files.length);
    }

    if (validFiles.length > 0) {
      const compressedFiles = await Promise.all(validFiles.map(compressImage));
      setFiles([...files, ...compressedFiles]);
      compressedFiles.forEach(f => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setPreviews(prev => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(f);
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (files.length === 0 || !produceType || !quantity || !sourceLocation) { setError("All fields and at least one image are required."); return; }
    if (isNaN(Number(quantity)) || Number(quantity) <= 0) { setError("Quantity must be a positive number."); return; }
    router.push("/dispatch/processing");
  };

  const steps = [
    { num: "1", label: "Produce", filled: !!produceType },
    { num: "2", label: "Quantity", filled: !!quantity },
    { num: "3", label: "Location", filled: !!sourceLocation },
    { num: "4", label: "Inspect", filled: files.length > 0 },
  ];

  return (
    <div className="min-h-screen p-6 sm:p-10 mesh-bg">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 animate-fade-in-up" style={{ opacity: 0 }}>
          <h1 className="text-3xl sm:text-4xl font-display text-text-primary mb-2 tracking-tight">Start a Produce Dispatch</h1>
          <p className="text-text-secondary">Provide field logistics and visual assessment</p>
        </div>

        {/* Progress indicator */}
        <div className="flex gap-2 mb-8 animate-fade-in-up" style={{ opacity: 0, animationDelay: '0.1s' }}>
          {steps.map((step, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <div className={`w-full h-1.5 rounded-full transition-all duration-500 ${
                step.filled ? 'bg-action shadow-sm shadow-action/30' : 'bg-glass-strong'
              }`}></div>
              <span className={`text-[10px] font-mono transition-colors uppercase ${step.filled ? 'text-action' : 'text-text-muted'}`}>
                {step.num}. {step.label}
              </span>
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-urgent/10 border border-urgent/20 text-urgent text-sm font-medium text-center backdrop-blur-sm animate-scale-in">
            {error}
          </div>
        )}

        <div className="glass p-6 sm:p-8 animate-fade-in-up" style={{ opacity: 0, animationDelay: '0.15s' }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Produce */}
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                  <span className="w-5 h-5 rounded-md bg-action/15 flex items-center justify-center text-action font-mono text-[10px]">1</span>
                  Produce
                </label>
                <div className="neu-inset">
                  <input 
                    type="text" value={produceType} onChange={e => setProduceType(e.target.value)}
                    placeholder="e.g. Tomato"
                    className="w-full bg-transparent p-3.5 text-text-primary text-sm focus:outline-none placeholder-text-muted"
                  />
                </div>
              </div>
              
              {/* Quantity */}
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                  <span className="w-5 h-5 rounded-md bg-action/15 flex items-center justify-center text-action font-mono text-[10px]">2</span>
                  Quantity (kg)
                </label>
                <div className="neu-inset">
                  <input 
                    type="number" value={quantity} onChange={e => setQuantity(e.target.value)}
                    placeholder="200" min="1"
                    className="w-full bg-transparent p-3.5 text-text-primary font-mono text-sm focus:outline-none placeholder-text-muted"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                <span className="w-5 h-5 rounded-md bg-action/15 flex items-center justify-center text-action font-mono text-[10px]">3</span>
                Location
              </label>
              <div className="neu-inset">
                <input 
                  type="text" value={sourceLocation} onChange={e => setSourceLocation(e.target.value)}
                  placeholder="e.g. Rajshahi"
                  className="w-full bg-transparent p-3.5 text-text-primary text-sm focus:outline-none placeholder-text-muted"
                />
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-2 text-xs font-medium text-text-secondary uppercase tracking-wider">
                  <span className="w-5 h-5 rounded-md bg-action/15 flex items-center justify-center text-action font-mono text-[10px]">4</span>
                  Inspect
                </label>
                <button 
                  type="button" onClick={startVoiceDictation}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isListening 
                      ? 'bg-urgent/15 border border-urgent/30 text-urgent animate-pulse' 
                      : 'glass border-border text-text-secondary hover:text-action hover:border-action/30'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                  {isListening ? 'Listening…' : 'Voice Input'}
                </button>
              </div>
              
              <label 
                className={`relative flex flex-col items-center justify-center w-full min-h-52 rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden p-4 ${
                  dragActive 
                    ? 'border-2 border-action bg-action/5' 
                    : previews.length > 0 
                      ? 'border border-border' 
                      : 'neu-inset border-dashed border-2 border-border hover:border-action/40'
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
              >
                {previews.length > 0 ? (
                  <div className="w-full h-full flex flex-col gap-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full">
                      {previews.map((p, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-border">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {previews.length < 5 && (
                        <div className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-action/40 flex items-center justify-center text-text-muted transition-colors">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded-lg bg-action/10 text-action text-xs font-medium backdrop-blur-sm">
                        {previews.length} of 5 photos selected
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-text-muted">
                    <div className="w-12 h-12 rounded-xl bg-glass-strong flex items-center justify-center mb-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <p className="text-sm font-medium text-text-secondary">Select up to 5 photos from different cartons</p>
                    <p className="text-xs mt-1">Improves sample representation & reduces fraud</p>
                  </div>
                )}
                <input type="file" multiple className="hidden" accept="image/jpeg, image/png, image/webp" onChange={handleFileChange} />
              </label>
            </div>

            <div className="pt-2">
              <button type="submit" className="btn-glow w-full py-4 text-base tracking-wide flex items-center justify-center gap-2 font-medium">
                Analyze Dispatch
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}
