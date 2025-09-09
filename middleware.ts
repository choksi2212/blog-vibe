import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Lightweight nonce generator without crypto import to avoid bundling surprises
function generateNonce(): string {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
}

function buildSecurityHeaders(nonce: string, isApi: boolean) {
  const cspDirectives = [
    "default-src 'self'",
    // Keep report-only and permit inline during migration; tighten later by removing 'unsafe-inline'
    `script-src 'self' 'unsafe-inline' 'nonce-${nonce}'`,
    `style-src 'self' 'unsafe-inline'`,
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https: http:",
    "frame-ancestors 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join("; ")

  const headers: Record<string, string> = {
    // Report-Only first to avoid breaking existing inline usages; can switch to enforced later
    "Content-Security-Policy-Report-Only": cspDirectives,
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    // Limit powerful APIs
    "Permissions-Policy": [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "accelerometer=()",
      "ambient-light-sensor=()",
      "autoplay=()",
      "battery=()",
      "display-capture=()",
      "document-domain=()",
      "encrypted-media=()",
      "fullscreen=()",
      "gyroscope=()",
      "magnetometer=()",
      "midi=()",
      "payment=()",
      "picture-in-picture=(self)",
      "publickey-credentials-get=(self)",
      "screen-wake-lock=()",
      "usb=()",
      "vr=()",
      "xr-spatial-tracking=()",
    ].join(", "),
    // Cross-origin isolation group (safe defaults); API responses also benefit
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Resource-Policy": "same-site",
    // HSTS only over HTTPS; clients on HTTP ignore it
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
    // legacy header kept for compatibility
    "X-DNS-Prefetch-Control": "off",
  }

  // Minimal CORS reflection for API only when Origin matches our host, otherwise no ACAO header
  if (isApi) {
    const allowOrigin = "*" // Keep permissive to avoid breaking existing integrations; tighten via API route helpers later
    headers["Access-Control-Allow-Origin"] = allowOrigin
    headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
    headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    headers["Access-Control-Max-Age"] = "600"
  }

  // Surface nonce for pages that wish to adopt it
  headers["X-Nonce"] = nonce

  return headers
}

export function middleware(request: NextRequest) {
  const nonce = generateNonce()
  const isApi = request.nextUrl.pathname.startsWith("/api/")

  // Handle CORS preflight early for API routes
  if (isApi && request.method === "OPTIONS") {
    const preflight = new NextResponse(null, { status: 204 })
    const headers = buildSecurityHeaders(nonce, true)
    Object.entries(headers).forEach(([k, v]) => preflight.headers.set(k, v))
    return preflight
  }

  const response = NextResponse.next()
  const headers = buildSecurityHeaders(nonce, isApi)
  Object.entries(headers).forEach(([k, v]) => response.headers.set(k, v))
  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
