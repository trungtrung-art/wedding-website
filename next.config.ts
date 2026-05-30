import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow inline SVG assets (seal-tq.svg, placeholder-*.svg). We control
    // every SVG in /public/wedding-assets/ so the usual XSS concern doesn't
    // apply here; the sandbox + script-src 'none' CSP is belt-and-braces.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
