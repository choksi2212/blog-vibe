"use client"

import type React from "react"

import { useState } from "react"
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Home } from "lucide-react"
import { GSAPFadeIn, GSAPLoadingSpinner } from "@/components/ui/gsap-animations"
import { GSAPButton } from "@/components/ui/gsap-micro-interactions"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()


  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      toast({
        title: "Success",
        description: "Logged in successfully!",
      })
      router.push("/")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      await signInWithPopup(auth, googleProvider)
      toast({ title: "Success", description: "Logged in with Google successfully!" })
      router.push("/")
    } catch (error: any) {
      // Do not fallback to full-page redirect; only handle popup-related infos
      if (error?.code === "auth/popup-closed-by-user") {
        // User closed the popup; no error toast needed
        return
      }
      if (error?.code === "auth/popup-blocked") {
        toast({ title: "Popup Blocked", description: "Please allow popups for this site and try again.", variant: "destructive" })
        return
      }
      if (error?.code === "auth/cancelled-popup-request") {
        // Another popup attempt while one is open; safely ignore
        return
      }
      toast({ title: "Error", description: error?.message || "Google sign-in failed", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-8">
      <Link
        href="/"
        className="absolute top-6 left-6 z-20 font-serif text-2xl font-semibold text-gradient tracking-tight transition-smooth hover:scale-105 animate-fade-in"
      >
        Devnovate
      </Link>
      
      <div className="w-full max-w-sm sm:max-w-md">
        {/* Header */}
        <GSAPFadeIn delay={0.1}>
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold bg-gradient-to-r from-black via-gray-800 to-black bg-clip-text text-transparent mb-3 animate-gradient-x">
              Welcome Back
            </h2>
            <p className="text-gray-600 text-base font-light tracking-wide">Sign in to your account</p>
          </div>
        </GSAPFadeIn>

        {/* Form */}
        <GSAPFadeIn delay={0.2}>
          <form onSubmit={handleEmailLogin} className="space-y-6">
            <div className="group">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-black mb-3 transition-colors group-focus-within:text-gray-800"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-6 py-4 border-2 border-black/20 rounded-lg bg-white/80 backdrop-blur-sm text-black placeholder:text-gray-500 focus:border-black focus:outline-none focus:ring-4 focus:ring-black/10 transition-all duration-300 hover:border-black/40 hover:shadow-lg hover:shadow-black/5"
              />
            </div>

            <div className="group">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-black mb-3 transition-colors group-focus-within:text-gray-800"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-6 py-4 border-2 border-black/20 rounded-lg bg-white/80 backdrop-blur-sm text-black placeholder:text-gray-500 focus:border-black focus:outline-none focus:ring-4 focus:ring-black/10 transition-all duration-300 hover:border-black/40 hover:shadow-lg hover:shadow-black/5"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 px-6 text-sm font-semibold rounded-lg hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5 active:translate-y-0 group"
            >
              {loading ? <GSAPLoadingSpinner size="sm" className="mr-2" /> : null}
              <span className="group-hover:tracking-wider transition-all duration-300">Sign In</span>
            </button>
          </form>
        </GSAPFadeIn>

        {/* Divider */}
        <GSAPFadeIn delay={0.3}>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-6 text-gray-500 font-medium">Or continue with</span>
            </div>
          </div>
        </GSAPFadeIn>

        {/* Google Login */}
        <GSAPFadeIn delay={0.4}>
          <GSAPButton
            onClick={handleGoogleLogin}
            variant="secondary"
            className="w-full py-4 px-6 text-sm font-semibold border-2 border-black/20 rounded-lg text-black bg-white/80 backdrop-blur-sm hover:bg-gray-50 hover:border-black/40 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center group"
          >
            {loading ? <GSAPLoadingSpinner size="sm" className="mr-2" /> : null}
            <span className="group-hover:tracking-wider transition-all duration-300">Continue with Google</span>
            <svg className="ml-3 w-5 h-5 group-hover:rotate-12 transition-transform duration-300" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c(.87-2.6 3.3-4.53 6.16-4.53z)"
              />
            </svg>
          </GSAPButton>
        </GSAPFadeIn>

        {/* Sign up link */}
        <GSAPFadeIn delay={0.5}>
          <div className="text-center mt-8">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="text-black font-semibold underline decoration-2 underline-offset-4 hover:decoration-gray-400 hover:text-gray-800 transition-all duration-300"
              >
                Sign up
              </a>
            </p>
          </div>
        </GSAPFadeIn>
      </div>
    </div>
  )
}
