type RateRecord = {
  windowStartMs: number
  count: number
}

const rateLimitStore: Map<string, RateRecord> = new Map()

function getClientIp(requestHeaders: Headers): string {
  return (
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "unknown"
  )
}

export function rateLimit(requestHeaders: Headers, bucket: string, max: number, windowMs: number): {
  allowed: boolean
  remaining: number
  resetMs: number
} {
  const ip = getClientIp(requestHeaders)
  const key = `${bucket}:${ip}`
  const now = Date.now()
  const record = rateLimitStore.get(key)
  if (!record || now - record.windowStartMs >= windowMs) {
    rateLimitStore.set(key, { windowStartMs: now, count: 1 })
    return { allowed: true, remaining: max - 1, resetMs: windowMs }
  }
  if (record.count < max) {
    record.count += 1
    rateLimitStore.set(key, record)
    return { allowed: true, remaining: max - record.count, resetMs: windowMs - (now - record.windowStartMs) }
  }
  return { allowed: false, remaining: 0, resetMs: windowMs - (now - record.windowStartMs) }
}

// Very lightweight HTML sanitizer for server-side use
// Removes <script>, <iframe>, event handler attributes, and javascript: URLs
export function sanitizeHtmlBasic(input: string): string {
  if (!input) return ""
  // Remove script and iframe blocks
  let sanitized = input.replace(/<\s*(script|iframe)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
  // Remove on* event handler attributes
  sanitized = sanitized.replace(/ on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
  // Neutralize javascript: URLs in href/src
  sanitized = sanitized.replace(/(href|src)\s*=\s*("|')\s*javascript:[^\2]*\2/gi, "$1=\"#\"")
  return sanitized
}

// Convenience: set standard CORS headers. Keep permissive to avoid breakage; tighten later per-route
export function applyCorsHeaders(headers: Headers, allowOrigin: string = "*") {
  headers.set("Access-Control-Allow-Origin", allowOrigin)
  headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
  headers.set("Access-Control-Max-Age", "600")
}

export function isValidObjectId(id: string): boolean {
  // 24 hex chars
  return /^[a-f\d]{24}$/i.test(id)
}

export async function verifyRecaptcha(token: string | undefined, remoteIp?: string | null): Promise<{ success: boolean, score?: number, action?: string, hostname?: string }> {
  const secret = process.env.RECAPTCHA_SECRET_KEY
  const v2Secret = process.env.RECAPTCHA_V2_SECRET_KEY
  if (!secret) {
    // Opt-in only: if not configured, consider verification passed to avoid breaking flows
    return { success: true }
  }
  if (!token) {
    return { success: false }
  }
  async function verifyWithSecret(useSecret: string) {
    const params = new URLSearchParams()
    params.append("secret", useSecret)
    params.append("response", token!)
    if (remoteIp) params.append("remoteip", remoteIp)
    const resp = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    })
    const data = await resp.json()
    return data
  }

  try {
    const data = await verifyWithSecret(secret)
    if (data?.success === true) {
      const score: number | undefined = typeof data.score === "number" ? data.score : undefined
      const action: string | undefined = typeof data.action === "string" ? data.action : undefined
      const hostname: string | undefined = typeof data.hostname === "string" ? data.hostname : undefined
      return { success: true, score, action, hostname }
    }
    if (v2Secret) {
      const dataV2 = await verifyWithSecret(v2Secret)
      if (dataV2?.success === true) {
        return { success: true }
      }
    }
    return { success: false }
  } catch {
    return { success: false }
  }
}


