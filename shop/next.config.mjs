const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000", // Permitir imágenes desde localhost:8000
      },
      {
        protocol: "https",
        hostname: "**", // Permitir imágenes desde cualquier dominio HTTPS
      },
      {
        protocol: "http",
        hostname: "backend.combipremium.com", // Permitir imágenes desde backend.combipremium.com (HTTP)
      },
      {
        protocol: "https",
        hostname: "backend.combipremium.com", // Permitir imágenes desde backend.combipremium.com (HTTPS)
      },
    ],
  },
};

module.exports = nextConfig;
