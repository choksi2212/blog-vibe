import { SignupForm } from "@/components/auth/signup-form"
import Script from "next/script"
import { headers } from "next/headers"

export default async function SignupPage() {
  const hdrs = await headers()
  const nonce = hdrs.get("x-nonce") || undefined
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
  return (
    <div className="min-h-screen bg-white">
      {siteKey ? (
        <Script nonce={nonce} src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`} strategy="afterInteractive" />
      ) : null}
      <SignupForm />
    </div>
  )
}
