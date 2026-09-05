import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ScrollProgress } from "@/components/scroll-progress";

export const metadata: Metadata = {
  title: "Ashwatthama — The Immortal AI Companion",
  description:
    "A private AI companion that lives on your computer. Thinks. Works. Remembers. Completely private.",
  keywords: [
    "AI companion",
    "local AI",
    "private AI",
    "desktop assistant",
    "offline AI",
    "voice assistant",
    "privacy-first",
  ],
  authors: [{ name: "Animesh Dhiman", url: "https://www.ashwatthama.dev" }],
  creator: "Animesh Dhiman",
  publisher: "Ashwatthama",
  robots: "index, follow",
  openGraph: {
    title: "Ashwatthama — The Immortal AI Companion",
    description:
      "Not a chatbot. An AI companion that lives on your machine. 100% private.",
    type: "website",
    url: "https://www.ashwatthama.dev",
    siteName: "Ashwatthama",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ashwatthama — The Immortal AI Companion",
    description:
      "Not a chatbot. An AI companion that lives on your machine. 100% private.",
    creator: "@animesh8787",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#140e09",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="grain">
        <ScrollProgress />
        {/* Global atmosphere layers */}
        <div className="ambient-top" aria-hidden="true" />
        <div className="ambient-bottom" aria-hidden="true" />
        <div className="scan" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
