import type { Metadata } from "next";
import type React from "react";

import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

import { QueryProvider } from "@/providers/query-provider";
import NextTopLoader from "nextjs-toploader";

import { Inter, Noto_Sans } from "next/font/google";
import { Toaster } from "sonner";

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
  icons: {
    icon: [
      {
        url: "/flexliving.webp",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/flexliving.webp",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: "/flexliving.webp",
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
