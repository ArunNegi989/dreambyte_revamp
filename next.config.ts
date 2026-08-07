import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Dev me localhost backend private IP resolve karta hai jise Next.js
    // SSRF-protection ke tehat block kar deta hai. Optimizer sirf prod
    // (real domain) ke liye chalao, dev me raw image serve karo.
    unoptimized: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "api.dreambytesolutions.com",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;