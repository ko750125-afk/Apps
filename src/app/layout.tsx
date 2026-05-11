import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import PageTransition from "@/components/layout/PageTransition";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: '%s | RapidForge',
    default: 'RapidForge | Premium Web App Portfolio',
  },
  description: "Explore a curated collection of high-performance web applications, productivity tools, and digital experiences by RapidForge.",
  keywords: ["web development", "portfolio", "next.js", "react", "apps", "productivity tools"],
  authors: [{ name: "RapidForge" }],
  creator: "RapidForge",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rapidforge.io", // Update with actual URL if known
    siteName: "RapidForge Portfolio",
    title: "RapidForge | Premium Web App Portfolio",
    description: "Explore a curated collection of high-performance web applications and digital experiences.",
  },
  twitter: {
    card: "summary_large_image",
    title: "RapidForge | Premium Web App Portfolio",
    description: "Explore a curated collection of high-performance web applications.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white text-[#1d1d1f] antialiased`} suppressHydrationWarning>
        <Header />
        <PageTransition>
          {children}
        </PageTransition>
      </body>
    </html>
  );
}

