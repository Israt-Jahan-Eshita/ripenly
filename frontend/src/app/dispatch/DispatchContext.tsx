"use client";

import { createContext, useContext, useState } from "react";

interface DispatchContextType {
  files: File[];
  setFiles: (fs: File[]) => void;
  produceType: string;
  setProduceType: (s: string) => void;
  quantity: string;
  setQuantity: (s: string) => void;
  sourceLocation: string;
  setSourceLocation: (s: string) => void;
  result: any;
  setResult: (r: any) => void;
}

const DispatchContext = createContext<DispatchContextType | undefined>(undefined);

export function DispatchProvider({ children }: { children: React.ReactNode }) {
  const [files, setFiles] = useState<File[]>([]);
  const [produceType, setProduceType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [sourceLocation, setSourceLocation] = useState("");
  const [result, setResult] = useState<any>(null);

  return (
    <DispatchContext.Provider value={{
      files, setFiles,
      produceType, setProduceType,
      quantity, setQuantity,
      sourceLocation, setSourceLocation,
      result, setResult
    }}>
      {children}
    </DispatchContext.Provider>
  );
}

export function useDispatchData() {
  const context = useContext(DispatchContext);
  if (!context) throw new Error("useDispatchData must be used within DispatchProvider");
  return context;
}
