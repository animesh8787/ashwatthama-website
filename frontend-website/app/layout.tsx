import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ThemeProvider } from "@/hooks/use-theme";

// Fonts are fetched at build time and served from this site (no runtime
// request to Google). Fraunces is the display serif, Plus Jakarta Sans the
// body face, IBM Plex Mono the label face.
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-fraunces",
});
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  variable: "--font-jakarta",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  variable: "--font-plex",
});

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
  themeColor: "#0e0b08",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${jakarta.variable} ${plexMono.variable}`}
    >
      {/* suppressHydrationWarning: THEME_BOOT_SCRIPT below sets data-theme
          on this element before React hydrates, by design (avoids a flash
          of the wrong theme) — that intentional mismatch was logging a
          real-looking console warning on every load. */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
      </head>
      <body className="grain">
        <ThemeProvider>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <SmoothScroll />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
