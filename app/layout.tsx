import type { Metadata } from "next";
import type React from "react";

import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

import { QueryProvider } from "@/providers/query-provider";
import NextTopLoader from "nextjs-toploader";

import { Inter, Noto_Sans } from "next/font/google";
import { Toaster } from "sonner";

// Initialize fonts
const _notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});
const _inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "FlexLiving - Find Your Perfect Stay",
  description:
    "Discover amazing properties in the heart of London with FlexLiving",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`font-sans antialiased ${_notoSans.className} ${_inter.className}`}
      >
        <NextTopLoader />
        <Toaster richColors position="top-right" />
        <QueryProvider>{children}</QueryProvider>
        <Analytics />
      </body>
    </html>
  );
}
