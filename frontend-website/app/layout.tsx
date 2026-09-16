import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ScrollProgress } from "@/components/scroll-progress";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ThemeProvider } from "@/hooks/use-theme";

// Applies the saved (or system) theme to <html> before first paint, so
// there is no flash of the wrong theme on load. Runs as a blocking inline
// script because this is a static export with no server to read cookies
// and pick a theme ahead of time.
const THEME_BOOT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("ashwatthama-theme");
    var theme = stored === "light" || stored === "dark"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();
`;

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
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
      </head>
      <body className="grain">
        <ThemeProvider>
          <SmoothScroll />
          <ScrollProgress />
          {/* Global atmosphere layers */}
          <div className="ambient-top" aria-hidden="true" />
          <div className="ambient-bottom" aria-hidden="true" />
          <div className="scan" aria-hidden="true" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
