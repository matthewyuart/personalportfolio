import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// real Futura, self-hosted — no render-blocking external font
const futura = localFont({
  src: [
    { path: "./fonts/futura-light.ttf", weight: "300", style: "normal" },
    { path: "./fonts/futura-book.ttf", weight: "400", style: "normal" },
    { path: "./fonts/futura-medium.ttf", weight: "500", style: "normal" },
  ],
  variable: "--font-futura",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://matthewyu.dev"),
  title: "Matthew Yu",
  description: "tech, art, design, film — Stanford '29",
  openGraph: {
    title: "Matthew Yu",
    description: "tech, art, design, film",
    url: "https://matthewyu.dev",
    // sketchbook riffle + page-through, recorded from the live hero;
    // platforms that play og:video (iMessage, Discord, Telegram, FB)
    // get the flip, everyone else falls back to the Stanford-spread still
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
    videos: [
      {
        url: "https://matthewyu.dev/og-sketchbook.mp4",
        secureUrl: "https://matthewyu.dev/og-sketchbook.mp4",
        width: 1200,
        height: 630,
        type: "video/mp4",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Matthew Yu",
    description: "tech, art, design, film",
    images: ["/og.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fully self-hosted Futura (FuturaCyrillic covers all glyphs incl. curly
  // quotes and ±) — zero external font requests.
  return (
    <html lang="en" className={futura.variable}>
      <body>
        {/* keyboard users can jump past the fixed header straight to content */}
        <a href="#main" className="skip-link">
          skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
