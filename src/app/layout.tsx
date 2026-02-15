import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Sora } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: "600",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "ORYXEN | Engineering Digital Products with Intelligence",
  description: "ORYXEN designs, builds, and scales software and AI-enhanced systems for founders and organizations. Enterprise-grade engineering solutions.",
  keywords: ["software development", "AI integration", "web applications", "mobile apps", "enterprise software", "automation"],
  authors: [{ name: "ORYXEN" }],
  openGraph: {
    title: "ORYXEN | Engineering Digital Products with Intelligence",
    description: "We design, build, and scale software and AI-enhanced systems for founders and organizations.",
    type: "website",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%2309090b'/><circle cx='50' cy='50' r='30' stroke='white' stroke-width='12' fill='none'/></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${sora.variable} antialiased bg-[#0a0a0a] text-white`}
      >
        {children}
      </body>
    </html>
  );
}
