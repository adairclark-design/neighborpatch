import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NeighborPatch — Share Your Yard, Grow Together",
  description: "The secure hyper-local marketplace connecting homeowners with unused yard space to aspiring gardeners. Start a garden in your neighborhood today.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
