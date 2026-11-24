import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Static ERP demo in public/erp-demo. A redirect (not a rewrite) so the browser
  // URL ends in /erp-demo/index.html and the demo's relative links resolve
  // inside the folder; Next strips trailing slashes, so /erp-demo/ lands here too.
  async redirects() {
    return [
      { source: "/erp-demo", destination: "/erp-demo/index.html", permanent: false },
    ];
  },
  // The demo uses invented data and must not compete with the portfolio in search.
  async headers() {
    return [
      {
        source: "/erp-demo/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
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
