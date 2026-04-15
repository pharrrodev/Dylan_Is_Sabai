import type { Metadata } from "next";
import { Geist_Mono, Inter, Playfair_Display, Space_Grotesk } from "next/font/google";

import { DashboardShell } from "@/components/intelligence-command/dashboard-shell";

import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-editorial-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dylan Is Sabai | Executive Summary",
  description:
    "Bare-bones financial MVP for UK creators. Ledger, Spendable Cash, HMRC sandbox.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${geistMono.variable} ${playfairDisplay.variable} dark h-full overflow-hidden`}
    >
      <body className="h-full overflow-hidden">
        <DashboardShell>{children}</DashboardShell>
      </body>
    </html>
  );
}
