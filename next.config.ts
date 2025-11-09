import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'utfs.io', 
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "<APP_ID>.ufs.sh",
        pathname: "/f/*",
      },
    ],
  },
  
  
};

export default nextConfig;
