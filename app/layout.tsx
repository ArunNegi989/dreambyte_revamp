import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/app/Layout/Header/page";
import "./globals.css";
import Footer from "./Layout/Footer/page";
import FloatingActionButtons from "./components/Homepage/Floatingactionbuttons/page";
import BotpressWidget from "./components/BotpressWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Best Digital Marketing Agency in Dehradun | Dream Byte Solutions",
  description: "Best Digital Marketing Agency in Dehradun",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
         <BotpressWidget />
         <FloatingActionButtons />
        <Footer />
      </body>
    </html>
  );
}