import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Apps Hub | Minimalist Portfolio",
  description: "A clean, minimalist portfolio of web applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="relative min-h-screen bg-[#fbfbfd] text-[#1d1d1f] antialiased selection:bg-[#0066cc]/30 selection:text-black">
        <Header />
        
        {/* Main content wrapper */}
        <div className="relative z-10 min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
