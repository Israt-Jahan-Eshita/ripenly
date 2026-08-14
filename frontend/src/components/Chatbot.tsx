"use client";

import { useState, useEffect, useRef } from "react";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", sender: "bot", text: "Hello! I am the Ripenly Assistant. Ask me about your AI routing decisions!" }
  ]);
  const [input, setInput] = useState("");
  const [context, setContext] = useState("General website inquiry.");
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    const handleOpenChat = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.context) {
        setContext(customEvent.detail.context);
        setIsOpen(true);
        setMessages([
          { id: Date.now().toString(), sender: "bot", text: `I see you are looking at ${customEvent.detail.produceInfo}. What would you like to know about this routing decision?` }
        ]);
      }
    };
    
    window.addEventListener("open-chatbot", handleOpenChat);
    return () => window.removeEventListener("open-chatbot", handleOpenChat);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: "user", text: userMsg }]);
    setIsTyping(true);
    
    try {
      const apiUrl = "https://ripenly-backend.onrender.com";
      const res = await fetch(`${apiUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context, message: userMsg })
      });
      
      if (res.ok || res.status === 503) {
        const data = await res.json();
        setMessages(prev => [...prev, { id: Date.now().toString(), sender: "bot", text: data.reply || "I couldn't process that. Please try again." }]);
      } else {
        setMessages(prev => [...prev, { id: Date.now().toString(), sender: "bot", text: "I'm temporarily busy. Please try again in a moment." }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: "bot", text: "Connection error." }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 w-80 z-50 flex flex-col rounded-2xl glass shadow-2xl border border-border overflow-hidden animate-in slide-in-from-bottom-5">
      {/* Header */}
      <div className="bg-glass-strong p-4 flex justify-between items-center border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-fresh animate-pulse"></div>
          <span className="text-sm font-semibold text-text-primary">Ripenly Assistant</span>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-text-muted hover:text-text-primary transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto min-h-[250px] max-h-[350px] flex flex-col gap-3">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
              msg.sender === 'user' 
                ? 'bg-action text-[#0B1210] rounded-tr-sm' 
                : 'bg-glass-strong border border-border text-text-secondary rounded-tl-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-glass-strong border border-border p-3 rounded-2xl rounded-tl-sm text-sm text-text-muted flex gap-1 items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce" style={{animationDelay: "0.2s"}}></span>
              <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce" style={{animationDelay: "0.4s"}}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border bg-glass">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
        >
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this decision..."
            className="flex-1 bg-background rounded-lg px-3 py-2 text-sm border border-border text-text-primary focus:outline-none focus:border-action"
          />
          <button 
            type="submit"
            disabled={isTyping || !input.trim()}
            className="btn-glow p-2 rounded-lg disabled:opacity-50 flex items-center justify-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </form>
      </div>
    </div>
  );
}
