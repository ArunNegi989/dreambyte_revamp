import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ChromeWrapper from "./components/ChromeWrapper";
import PageLoader from "./components/pageloader/page";

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
        <PageLoader />
        <ChromeWrapper>{children}</ChromeWrapper>
      </body>
    </html>
  );
}