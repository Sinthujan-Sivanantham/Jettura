/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kkbsaplhjcsqtycmstxl.supabase.co",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api-gds/:path*",
        destination: "https://test.api.amadeus.com/:path*",
      },
      {
        source: "/api-travel/:path*",
        destination: "https://api.travelpayouts.com/:path*",
      },
      {
        source: "/api-duffel/:path*",
        destination: "https://api.duffel.com/:path*",
      },
    ];
  },
};

export default nextConfig;
