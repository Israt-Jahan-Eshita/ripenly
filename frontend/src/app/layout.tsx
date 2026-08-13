import type { Metadata } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { DispatchProvider } from "./dispatch/DispatchContext";
import { AuthProvider } from "./AuthContext";
import { AppShell } from "@/components/AppShell";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-display" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Ripenly",
  description: "AI-powered agricultural dispatch decision engine.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${jetbrains.variable}`}>
      <body className="font-sans antialiased bg-background text-text-primary">
        <AuthProvider>
          <DispatchProvider>
            <AppShell>
              {children}
            </AppShell>
          </DispatchProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
