"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth-provider"
import Link from "next/link"
import { PenTool, TrendingUp, Users } from "lucide-react"

export function HeroSection() {
  const { user } = useAuth()

  return (
    <section className="py-20 px-4 text-center bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
          Share Your <span className="text-primary">Developer</span> Journey
        </h1>

        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
          Join the Devnovate community where developers share insights, tutorials, and experiences. Write, discover, and
          grow together.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          {user ? (
            <Link href="/dashboard/create">
              <Button size="lg" className="flex items-center gap-2">
                <PenTool className="w-5 h-5" />
                Start Writing
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/signup">
                <Button size="lg" className="flex items-center gap-2">
                  <PenTool className="w-5 h-5" />
                  Start Writing
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-3">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-1">Growing Community</h3>
            <p className="text-sm text-muted-foreground">Join developers worldwide</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-1">Quality Content</h3>
            <p className="text-sm text-muted-foreground">Curated by our community</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-3">
              <PenTool className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-1">Easy Publishing</h3>
            <p className="text-sm text-muted-foreground">Write with markdown support</p>
          </div>
        </div>
      </div>
    </section>
  )
}
