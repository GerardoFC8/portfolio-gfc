import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Static demos in public/<name>-demo. A redirect (not a rewrite) so the browser
  // URL ends in /<name>-demo/index.html and the demo's relative links resolve
  // inside the folder; Next strips trailing slashes, so /<name>-demo/ lands here too.
  async redirects() {
    return [
      { source: "/erp-demo", destination: "/erp-demo/index.html", permanent: false },
      { source: "/finanzentral-demo", destination: "/finanzentral-demo/index.html", permanent: false },
    ];
  },
  // The demos use invented data and must not compete with the portfolio in search.
  async headers() {
    return [
      ...["/erp-demo/:path*", "/finanzentral-demo/:path*"].map((source) => ({
        source,
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      })),
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        // Load-bearing for the onError fallback placeholder in technologies.tsx TechItem.
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
