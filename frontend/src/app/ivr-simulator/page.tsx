"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDispatchData } from "../dispatch/DispatchContext";

export default function VoiceInputPage() {
  const router = useRouter();
  const { setProduceType, setQuantity, setSourceLocation } = useDispatchData();
  
  const [callState, setCallState] = useState<"idle" | "recording" | "processing" | "success" | "error">("idle");
  const [transcript, setTranscript] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const recognitionRef = useRef<any>(null);

  const startRecording = () => {
    setErrorMsg("");
    setTranscript("");
    
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMsg("Speech recognition is not supported in this browser. Please use Chrome.");
      setCallState("error");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setCallState("recording");
    };

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const t = event.results[current][0].transcript;
      setTranscript(t);
    };

    recognition.onerror = (event: any) => {
      setErrorMsg(`Error occurred in recognition: ${event.error}`);
      setCallState("error");
    };

    recognition.onend = () => {
      // If we manually stopped or it timed out, process what we have
      if (callState === "recording") {
        processTranscript();
      }
    };

    recognition.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      processTranscript();
    }
  };

  const processTranscript = async () => {
    if (!transcript.trim()) {
      setCallState("idle");
      return;
    }
    setCallState("processing");

    try {
      const apiUrl = "https://ripenly-backend.onrender.com";
      const res = await fetch(`${apiUrl}/api/dispatch/nlp`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ transcript })
      });
      
      if (!res.ok) throw new Error("NLP processing failed");
      
      const data = await res.json();
      setProduceType(data.produceType || "");
      setQuantity(data.quantity?.toString() || "");
      setSourceLocation(data.sourceLocation || "");
      
      setCallState("success");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to process voice command.");
      setCallState("error");
    }
  };

  const goToDispatch = () => {
    router.push("/dispatch/new");
  };

  return (
    <div className="min-h-screen p-6 sm:p-10 mesh-bg flex flex-col items-center justify-center">
      
      <div className="text-center mb-8 animate-fade-in-up" style={{ opacity: 0 }}>
        <h1 className="text-3xl sm:text-4xl font-display text-text-primary mb-2 tracking-tight">Voice-Assisted Dispatch</h1>
        <p className="text-text-secondary">Speak details to automatically fill the dispatch form.</p>
      </div>

      <div className="glass p-8 rounded-[2.5rem] w-full max-w-sm border-[8px] border-black/20 shadow-2xl animate-fade-in-up relative overflow-hidden" style={{ opacity: 0, animationDelay: '0.1s' }}>
        
        {/* Screen */}
        <div className="bg-[#0f1412] rounded-2xl p-6 h-56 mb-8 flex flex-col items-center justify-center text-center border border-white/5 relative shadow-inner overflow-hidden">
          
          {callState === "idle" && (
            <div className="text-white/40 font-mono text-sm">Tap mic and say:<br/><br/><span className="text-white/70 italic">"I have 200 kilos of tomatoes in Rajshahi."</span></div>
          )}
          
          {callState === "recording" && (
            <div className="flex flex-col items-center w-full px-2">
              <div className="flex gap-1 mb-4 h-8 items-end">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-1.5 h-full bg-urgent/80 rounded-full animate-pulse origin-bottom scale-y-50" style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.5s' }}></div>
                ))}
              </div>
              <span className="text-[14px] text-white/90 italic min-h-[40px] leading-tight">
                {transcript || "Listening..."}
              </span>
            </div>
          )}

          {callState === "processing" && (
            <div className="flex flex-col items-center">
              <svg className="animate-spin h-8 w-8 text-action mb-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-sm text-white/70 font-mono">Extracting logistics via AI...</span>
            </div>
          )}

          {callState === "success" && (
            <div className="flex flex-col items-center text-fresh">
              <svg className="w-10 h-10 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              <span className="text-base font-medium">"Dispatch parsed."</span>
              <span className="text-xs text-white/50 mt-1">Data successfully extracted.</span>
            </div>
          )}
          
          {callState === "error" && (
            <div className="flex flex-col items-center text-urgent">
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
              <span className="text-sm text-center px-4">{errorMsg}</span>
              <button onClick={() => setCallState("idle")} className="mt-4 px-3 py-1 bg-white/10 rounded text-xs">Try Again</button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center px-4">
          {callState !== "recording" ? (
            <button 
              onClick={startRecording}
              disabled={callState === "processing"}
              className="w-20 h-20 rounded-full bg-action text-canvas flex items-center justify-center shadow-lg shadow-action/20 disabled:opacity-50 disabled:grayscale transition-all hover:scale-105 active:scale-95"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
            </button>
          ) : (
            <button 
              onClick={stopRecording}
              className="w-20 h-20 rounded-full bg-urgent text-canvas flex items-center justify-center shadow-lg shadow-urgent/30 animate-pulse transition-all hover:scale-105 active:scale-95"
            >
              <div className="w-6 h-6 rounded-sm bg-current"></div>
            </button>
          )}
        </div>

      </div>

      {callState === "success" && (
        <button 
          onClick={goToDispatch}
          className="mt-8 px-6 py-3 rounded-xl bg-glass border border-action/30 text-action text-sm font-medium hover:bg-action/10 transition-colors animate-fade-in flex items-center gap-2"
        >
          Review Dispatch Form
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </button>
      )}

    </div>
  );
}
