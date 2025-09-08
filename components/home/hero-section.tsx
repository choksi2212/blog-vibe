"use client"

import { useAuth } from "@/components/auth/auth-provider"
import Link from "next/link"
import { PenTool, TrendingUp, Users } from "lucide-react"

export function HeroSection() {
  const { user } = useAuth()

  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading - Squarespace style */}
          <h1 className="font-serif text-5xl lg:text-7xl font-semibold text-gray-900 leading-tight mb-8">
            Share Your{" "}
            <em className="italic">Developer</em>{" "}
            Journey
          </h1>

          {/* Subtitle */}
          <p className="text-lg lg:text-xl text-gray-600 leading-relaxed mb-12 max-w-3xl mx-auto">
            Join the Devnovate community where developers share insights, tutorials, and experiences. 
            Write, discover, and grow together in a space designed for technical excellence.
          </p>

          {/* CTA Buttons - Squarespace style */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            {user ? (
              <Link href="/dashboard/create">
                <button className="bg-black text-white px-8 py-4 text-sm font-medium hover:bg-gray-800 transition-colors inline-flex items-center space-x-2">
                  <PenTool className="w-4 h-4" />
                  <span>Start Writing</span>
                </button>
              </Link>
            ) : (
              <>
                <Link href="/signup">
                  <button className="bg-black text-white px-8 py-4 text-sm font-medium hover:bg-gray-800 transition-colors inline-flex items-center space-x-2">
                    <PenTool className="w-4 h-4" />
                    <span>Start Writing</span>
                  </button>
                </Link>
                <Link href="/login">
                  <button className="border border-gray-300 text-gray-900 px-8 py-4 text-sm font-medium hover:bg-gray-50 transition-colors">
                    Sign In
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Features Grid - Squarespace minimalist style */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mx-auto mb-6">
                <Users className="w-6 h-6 text-gray-900" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-gray-900 mb-3">Growing Community</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with developers worldwide and build meaningful professional relationships.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-6 h-6 text-gray-900" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-gray-900 mb-3">Quality Content</h3>
              <p className="text-gray-600 leading-relaxed">
                Every article is carefully reviewed to ensure high-quality, valuable technical content.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mx-auto mb-6">
                <PenTool className="w-6 h-6 text-gray-900" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-gray-900 mb-3">Easy Publishing</h3>
              <p className="text-gray-600 leading-relaxed">
                Write with full markdown support and publish with a streamlined, distraction-free editor.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
