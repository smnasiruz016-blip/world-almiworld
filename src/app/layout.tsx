import type { Metadata } from "next";
import { ShamoolFooter } from "@/components/ShamoolFooter";
import "./globals.css";

export const metadata: Metadata = {
  title: "AlmiWorld — your career, around the globe",
  description:
    "AlmiWorld is the hub for AlmiCV, AlmiJob, AlmiSalary, and AlmiStudy. Pick a country and a role; we link you to the right product.",
  metadataBase: new URL("https://world.almiworld.com"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-neutral-900 antialiased">
        {children}
        <ShamoolFooter />
      </body>
    </html>
  );
}
