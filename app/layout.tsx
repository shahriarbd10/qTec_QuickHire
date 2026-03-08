import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QuickHire",
  description: "Mini job board built for the Qtec technical assessment.",
  icons: {
    icon: "/icon",
    shortcut: "/icon",
    apple: "/icon",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
