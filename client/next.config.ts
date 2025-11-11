import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:4000/api/:path*",
      },
    ];
  },
  async headers() {
    return [
      // {
      //   source: "/api/:path*",
      //   headers: [
      //     {
      //       key: "Access-Control-Allow-Origin",
      //       value: "http://127.0.0.1:3001",
      //     },
      //     { key: "Access-Control-Allow-Credentials", value: "true" },
      //     {
      //       key: "Access-Control-Allow-Methods",
      //       value: "GET,POST,PUT,DELETE,OPTIONS",
      //     },
      //     {
      //       key: "Access-Control-Allow-Headers",
      //       value: "Content-Type, Authorization",
      //     },
      //   ],
      // },
      {
        // Relax COOP/COEP only for auth-related routes
        source: "/login",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "unsafe-none" },
          { key: "Cross-Origin-Embedder-Policy", value: "unsafe-none" },
        ],
      },
      {
        source: "/api/auth/:path*",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "unsafe-none" },
          { key: "Cross-Origin-Embedder-Policy", value: "unsafe-none" },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
