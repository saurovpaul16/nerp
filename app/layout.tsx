import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "NERP Birthday Bash 2026 — An Exclusive Celebration",
  description:
    "You're invited to the most exclusive party of 2026. NERP Birthday Bash — hosted by Neil, Eric, Ryan & Paul. June 20th, 2026.",
  openGraph: {
    title: "NERP Birthday Bash 2026",
    description: "An exclusive celebration hosted by Neil • Eric • Ryan • Paul",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body
        className="min-h-full flex flex-col"
        style={{ background: "var(--bg)", color: "var(--foreground)" }}
      >
        {children}
      </body>
    </html>
  );
}
