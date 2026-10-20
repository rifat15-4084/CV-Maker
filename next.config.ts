import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // CVForge is fully local: avatars and CV photos are data URLs held in the
    // browser, so there is no storage host to allow. These are kept for the
    // marketing/blog imagery and for anyone who later adds a remote backend.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
};

export default nextConfig;
