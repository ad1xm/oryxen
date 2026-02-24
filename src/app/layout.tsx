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
  metadataBase: new URL("https://oryxen.co.in"),
  alternates: {
    canonical: "/",
  },
  title: "Oryxen Systems Private Limited | Software Development Company in India",
  description: "Oryxen Systems Private Limited is a software development company in India specializing in custom web development, AI-driven systems, full-stack engineering, enterprise applications, and automation solutions. Based in India, serving clients globally.",
  keywords: [
    "software development company India",
    "custom web development",
    "AI-driven systems",
    "full-stack engineering",
    "enterprise applications",
    "software engineering company",
    "Oryxen Systems",
    "web applications",
    "mobile apps",
    "automation solutions",
    "digital products",
    "AI integration",
  ],
  authors: [{ name: "Oryxen Systems Private Limited" }],
  openGraph: {
    title: "Oryxen Systems Private Limited | Software Development Company in India",
    description: "Oryxen Systems is a software development company based in India, specializing in AI-driven systems, full-stack engineering, and enterprise applications. Serving clients globally.",
    type: "website",
    siteName: "Oryxen Systems Private Limited",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD Structured Data
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://oryxen.co.in/#organization",
    "name": "Oryxen",
    "url": "https://oryxen.co.in",
    "logo": "https://oryxen.co.in/logo.png",
    "image": "https://oryxen.co.in/logo.png",
    "description": "Software development company in India specializing in custom web development, AI-driven systems, full-stack engineering, and enterprise applications.",
    "foundingDate": "2025",
    "founder": {
      "@id": "https://oryxen.co.in/#founder"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN",
      "addressLocality": "India"
    },
    "areaServed": {
      "@type": "Place",
      "name": "Global"
    },
    "knowsAbout": [
      "Software Development",
      "Web Applications",
      "AI-Driven Systems",
      "Full-Stack Engineering",
      "Enterprise Applications",
      "Custom Web Development",
      "Automation Solutions"
    ],
    "sameAs": [
      "https://github.com/syncwithadi",
      "https://twitter.com/oryxenhq",
      "https://linkedin.com/in/adityabuilds"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://oryxen.co.in/#website",
    "name": "Oryxen Systems Private Limited",
    "url": "https://oryxen.co.in",
    "description": "Software Development Company in India",
    "publisher": {
      "@id": "https://oryxen.co.in/#organization"
    }
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${sora.variable} antialiased bg-[#0a0a0a] text-white`}
      >
        {children}
      </body>
    </html>
  );
}
