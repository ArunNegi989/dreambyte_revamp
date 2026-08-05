import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
      // production mein backend ka real domain bhi yahan add karna, e.g.:
      // { protocol: "https", hostname: "api.dreambytesolution.com", pathname: "/uploads/**" },
    ],
  },
};

export default nextConfig;