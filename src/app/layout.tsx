import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";

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
    images: [
      {
        url: "/og-image.png", // Ensure this exists or use a generated one
        width: 1200,
        height: 630,
        alt: "RapidForge Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RapidForge | Premium Web App Portfolio",
    description: "Explore a curated collection of high-performance web applications.",
    images: ["/og-image.png"],
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
        {children}
      </body>
    </html>
  );
}

