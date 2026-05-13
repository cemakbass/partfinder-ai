import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PartFinder AI",
  description: "Find any car part instantly with AI."
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
