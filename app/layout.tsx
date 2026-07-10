import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Inter (variable) — next/font downloads it at build time and self-hosts,
// so there are still zero external font requests at runtime.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
