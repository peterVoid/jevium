import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import TanstackQuery from "./TanstackQuery";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Jevium",
    default: "Jevium",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TanstackQuery>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </TanstackQuery>
      </body>
    </html>
  );
}
