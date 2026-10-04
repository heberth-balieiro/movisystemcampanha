import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

function getApiOrigin() {
  const value = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (!value) return null;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.origin : null;
  } catch {
    return null;
  }
}

function buildContentSecurityPolicy() {
  const apiOrigin = getApiOrigin();
  const connectSources = ["'self'"];

  if (apiOrigin) connectSources.push(apiOrigin);
  if (isDev) connectSources.push("http:", "https:", "ws:", "wss:");

  const scriptSources = ["'self'", "'unsafe-inline'"];
  if (isDev) scriptSources.push("'unsafe-eval'");

  const imageSources = ["'self'", "data:", "blob:", "https:"];
  if (isDev) imageSources.push("http:");

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    `script-src ${scriptSources.join(" ")}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src ${imageSources.join(" ")}`,
    "font-src 'self' data:",
    `connect-src ${connectSources.join(" ")}`,
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    "media-src 'none'",
  ].join("; ");
}

const securityHeaders = [
  { key: "Content-Security-Policy", value: buildContentSecurityPolicy() },
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  ...(isDev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=31536000" }]),
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  allowedDevOrigins: ["192.168.15.11"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
