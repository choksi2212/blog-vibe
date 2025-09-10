"use client"

import { useAuth } from "@/components/auth/auth-provider"
import Link from "next/link"
import { PenTool, TrendingUp, Users } from "lucide-react"

export function HeroSection() {
  const { user } = useAuth()

  return (
    <section className="py-24 lg:py-32 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-serif text-5xl lg:text-7xl font-semibold text-foreground leading-tight mb-8 animate-fade-in">
            Share Your <em className="italic animate-float text-primary">Developer</em> Journey
          </h1>

          <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed mb-12 max-w-3xl mx-auto animate-slide-up text-pretty">
            Join the Devnovate community where developers share insights, tutorials, and experiences. Write, discover,
            and grow together in a space designed for technical excellence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20 animate-scale-in">
            {user ? (
              <Link href="/dashboard/create">
                <button className="bg-primary text-primary-foreground px-8 py-4 text-sm font-medium transition-smooth hover-lift rounded-lg inline-flex items-center space-x-2 group">
                  <PenTool className="w-4 h-4 transition-smooth group-hover:rotate-12" />
                  <span>Start Writing</span>
                </button>
              </Link>
            ) : (
              <>
                <Link href="/signup">
                  <button className="bg-primary text-primary-foreground px-8 py-4 text-sm font-medium transition-smooth hover-lift rounded-lg inline-flex items-center space-x-2 group">
                    <PenTool className="w-4 h-4 transition-smooth group-hover:rotate-12" />
                    <span>Start Writing</span>
                  </button>
                </Link>
                <Link href="/login">
                  <button className="border border-border text-foreground px-8 py-4 text-sm font-medium transition-smooth hover:bg-accent hover:text-accent-foreground rounded-lg">
                    Sign In
                  </button>
                </Link>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            <div className="text-center animate-slide-in-left glass-effect rounded-xl p-8 hover-lift">
              <div className="w-16 h-16 bg-accent flex items-center justify-center mx-auto mb-6 rounded-full transition-smooth hover:scale-110">
                <Users className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-3">Growing Community</h3>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                Connect with developers worldwide and build meaningful professional relationships.
              </p>
            </div>

            <div
              className="text-center animate-fade-in glass-effect rounded-xl p-8 hover-lift"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="w-16 h-16 bg-accent flex items-center justify-center mx-auto mb-6 rounded-full transition-smooth hover:scale-110">
                <TrendingUp className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-3">Quality Content</h3>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                Every article is carefully reviewed to ensure high-quality, valuable technical content.
              </p>
            </div>

            <div className="text-center animate-slide-in-right glass-effect rounded-xl p-8 hover-lift">
              <div className="w-16 h-16 bg-accent flex items-center justify-center mx-auto mb-6 rounded-full transition-smooth hover:scale-110">
                <PenTool className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-3">Easy Publishing</h3>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                Write with full markdown support and publish with a streamlined, distraction-free editor.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
