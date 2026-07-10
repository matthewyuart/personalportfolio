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
  openGraph: { title: "Matthew Yu", description: "tech, art, design, film", url: "https://matthewyu.dev" },
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
      <body>{children}</body>
    </html>
  );
}
