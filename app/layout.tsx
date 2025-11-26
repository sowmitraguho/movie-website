import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar/Navbar";
import MobileNavbar from "./components/Navbar/MobileNavbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CineMax",
  description: "CineMax - Watch movies online",
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
        {/* Desktop - hidden on mobile */}
      <div className="hidden lg:block">
        <Navbar />
      </div>
      
      {/* Mobile - hidden on desktop */}
      <div className="block lg:hidden">
        <MobileNavbar />
      </div>
        {children}
      </body>
    </html>
  );
}
