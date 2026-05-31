import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CallBack Leads — Never lose a missed call",
  description:
    "Recover missed calls with instant SMS and lead capture for plumbers, electricians, and gas engineers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
