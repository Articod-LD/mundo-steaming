/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000", // Añadir el puerto 8000
      },
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "backend.mundostreaming.com.co", // Permitir imágenes desde backend.combipremium.com (HTTP)
      },
      {
        protocol: "https",
        hostname: "backend.mundostreaming.com.co", // Permitir imágenes desde backend.combipremium.com (HTTPS)
      },
    ],
  },
};

export default nextConfig;
