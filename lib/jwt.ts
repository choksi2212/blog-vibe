import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const JWT_ISSUER = process.env.JWT_ISSUER || "blog-vibe"
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || "blog-vibe-app"

export interface JWTPayload {
  userId: string
  email: string
  role: "user" | "admin"
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "15m",
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
    algorithm: "HS256",
  })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
      algorithms: ["HS256"],
      clockTolerance: 5,
    }) as JWTPayload
  } catch {
    return null
  }
}
