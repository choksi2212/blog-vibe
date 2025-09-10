"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import Link from "next/link"
import { Shield, Home, LogOut } from "lucide-react"

export function AdminNav() {
  const { user, userRole } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  if (userRole !== "admin") {
    return null
  }

  return (
    <nav className="glass-effect border-b border-border animate-slide-up">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6 animate-fade-in">
            <Link
              href="/admin"
              className="flex items-center gap-2 font-bold text-primary transition-smooth hover:scale-105 hover-lift"
            >
              <Shield className="w-6 h-6 animate-float" />
              <span className="text-gradient">Devnovate Admin</span>
            </Link>

            <div className="flex items-center gap-4 animate-slide-in-left" style={{ animationDelay: "0.2s" }}>
              <Link
                href="/"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth hover:scale-105 group"
              >
                <Home className="w-4 h-4 transition-smooth group-hover:rotate-12" />
                Public Site
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4 animate-slide-in-right">
            <span className="text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.3s" }}>
              Welcome, <span className="text-foreground font-medium">{user?.email}</span>
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="transition-smooth hover-lift hover:bg-destructive hover:text-destructive-foreground hover:border-destructive group animate-scale-in bg-transparent"
              style={{ animationDelay: "0.4s" }}
            >
              <LogOut className="w-4 h-4 mr-2 transition-smooth group-hover:rotate-12" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
