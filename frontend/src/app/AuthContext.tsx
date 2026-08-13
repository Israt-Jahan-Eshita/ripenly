"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: string;
  name: string;
  location: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (name: string, location: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Basic local storage persistence for hackathon mock
    const savedUser = localStorage.getItem("ripenly_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (name: string, location: string) => {
    const newUser = { id: "1", name, location, role: "AGENT" };
    setUser(newUser);
    localStorage.setItem("ripenly_user", JSON.stringify(newUser));
    router.push("/dispatch/new");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ripenly_user");
    router.push("/sign-in");
  };

  // Protect routes
  useEffect(() => {
    if (!user && pathname !== "/" && pathname !== "/sign-in") {
      // Small timeout to prevent flashing during initial load
      const timer = setTimeout(() => {
        if (!localStorage.getItem("ripenly_user")) {
          router.push("/sign-in");
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [user, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
