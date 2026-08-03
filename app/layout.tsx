import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// PP Mori, self-hosted — no render-blocking external font.
// Extralight carries display, Regular carries body, Semibold carries emphasis.
const mori = localFont({
  src: [
    { path: "./fonts/ppmori-extralight.otf", weight: "300", style: "normal" },
    { path: "./fonts/ppmori-regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/ppmori-semibold.otf", weight: "500", style: "normal" },
  ],
  variable: "--font-mori",
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
    <html lang="en" className={mori.variable}>
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
