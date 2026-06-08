import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "500mb",
    },
  },
  middlewareClientMaxBodySize: "500mb",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      }
    ]
  },
  transpilePackages: ["lodash-es", "quill", "react-quill-new"]
};

export default nextConfig;
