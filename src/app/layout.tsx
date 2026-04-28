import type { Metadata } from "next";
import "./globals.css";
import NetworkBackground from "@/components/3d/NetworkBackground";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Apps Hub | Cyber Cosmos",
  description: "A portfolio of futuristic web applications and AI tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="relative min-h-screen bg-space-black text-starlight-white selection:bg-electric-cyan/30">
        <NetworkBackground />
        <Header />
        {/* Futuristic Overlays */}
        <div className="fixed inset-0 z-20 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay" />
        <div className="fixed inset-0 z-20 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
        
        {/* Main content wrapper */}
        <div className="relative z-10 min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
