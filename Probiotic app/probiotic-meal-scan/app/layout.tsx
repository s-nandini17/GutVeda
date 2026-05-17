import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GutVeda 🌿 — Your Gut's New Bestie",
  description:
    "Discover Indian probiotic foods, scan your meals for gut score, chat with your AI gut coach. It's Your gut Your gut health app!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect for faster Google Fonts loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
