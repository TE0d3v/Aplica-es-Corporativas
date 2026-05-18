import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://aplicacoes-corporativas.onrender.com/:path*", // Redireciona para a API local
      },
    ];
  },
};

export default nextConfig;
