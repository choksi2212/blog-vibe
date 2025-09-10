"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import Link from "next/link"
import { LogOut, PenTool, Shield, Menu, X, Search } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SearchAutocomplete } from "@/components/search/search-autocomplete"

export function PublicNav() {
  const { user, userRole } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  const handleSearch = (query: string) => {
    if (query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(query)}`
    }
  }

  return (
    <nav className="glass-effect border-b border-border sticky top-0 z-50 animate-slide-up">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link
            href="/"
            className="font-serif text-2xl font-semibold text-gradient tracking-tight transition-smooth hover:scale-105 animate-fade-in"
          >
            Devnovate
          </Link>

          <div className="hidden lg:flex items-center space-x-12 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Link
              href="/blogs"
              className="text-sm font-medium text-foreground transition-smooth hover:text-primary hover:scale-105 relative group"
            >
              Articles
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/search"
              className="text-sm font-medium text-foreground transition-smooth hover:text-primary hover:scale-105 relative group"
            >
              Search
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            {user && (
              <Link
                href="/dashboard"
                className="text-sm font-medium text-foreground transition-smooth hover:text-primary hover:scale-105 relative group"
              >
                Dashboard
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            )}
          </div>

          <div
            className="hidden md:flex items-center max-w-sm flex-1 mx-8 animate-scale-in"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground transition-smooth" />
              <SearchAutocomplete
                value={searchQuery}
                onChange={setSearchQuery}
                onSelect={(suggestion) => {
                  if (suggestion.type === "title" && suggestion.id) {
                    window.location.href = `/blog/${suggestion.id}`
                  } else {
                    handleSearch(suggestion.text)
                  }
                }}
                className="pl-10 pr-4 py-2 w-full border border-border bg-background/50 backdrop-blur-sm text-sm placeholder:text-muted-foreground focus:bg-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring transition-smooth rounded-lg"
                placeholder="Search articles..."
              />
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4 animate-slide-in-right">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-foreground transition-smooth hover:bg-accent hover:text-accent-foreground rounded-lg hover-lift">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-semibold transition-smooth hover:scale-110">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden lg:block">{user.email?.split("@")[0]}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 glass-effect border-border animate-scale-in">
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard"
                      className="flex items-center px-4 py-3 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-smooth"
                    >
                      <PenTool className="w-4 h-4 mr-3" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {userRole === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link
                        href="/admin"
                        className="flex items-center px-4 py-3 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-smooth"
                      >
                        <Shield className="w-4 h-4 mr-3" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="flex items-center px-4 py-3 text-sm text-foreground hover:bg-destructive hover:text-destructive-foreground transition-smooth"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login">
                  <button className="text-sm font-medium text-foreground transition-smooth hover:text-primary hover:scale-105">
                    Sign In
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="bg-primary text-primary-foreground px-6 py-2 text-sm font-medium transition-smooth hover-lift rounded-lg">
                    Get Started
                  </button>
                </Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden p-2 text-foreground transition-smooth hover:bg-accent hover:text-accent-foreground rounded-lg hover:scale-110"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div
              className="transition-transform duration-300"
              style={{ transform: isMenuOpen ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </div>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-border glass-effect animate-slide-up">
            <div className="px-6 py-6 space-y-6">
              <div className="relative animate-fade-in">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <SearchAutocomplete
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSelect={(suggestion) => {
                    if (suggestion.type === "title" && suggestion.id) {
                      window.location.href = `/blog/${suggestion.id}`
                    } else {
                      handleSearch(suggestion.text)
                    }
                    setIsMenuOpen(false)
                  }}
                  className="pl-10 pr-4 py-3 w-full border border-border bg-background/50 backdrop-blur-sm text-sm placeholder:text-muted-foreground focus:bg-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring transition-smooth rounded-lg"
                  placeholder="Search articles..."
                />
              </div>

              <div className="space-y-4">
                <Link
                  href="/blogs"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-lg font-medium text-foreground transition-smooth hover:text-primary hover:translate-x-2 animate-slide-in-left"
                  style={{ animationDelay: "0.1s" }}
                >
                  Articles
                </Link>
                <Link
                  href="/search"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-lg font-medium text-foreground transition-smooth hover:text-primary hover:translate-x-2 animate-slide-in-left"
                  style={{ animationDelay: "0.2s" }}
                >
                  Search
                </Link>
                {user && (
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-lg font-medium text-foreground transition-smooth hover:text-primary hover:translate-x-2 animate-slide-in-left"
                    style={{ animationDelay: "0.3s" }}
                  >
                    Dashboard
                  </Link>
                )}
              </div>

              {user ? (
                <div
                  className="space-y-4 pt-4 border-t border-border animate-fade-in"
                  style={{ animationDelay: "0.4s" }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-foreground">{user.email?.split("@")[0]}</span>
                  </div>
                  {userRole === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 text-foreground transition-smooth hover:text-primary hover:translate-x-2"
                    >
                      <Shield className="w-5 h-5" />
                      <span className="text-sm font-medium">Admin Panel</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleSignOut()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center space-x-3 text-foreground transition-smooth hover:text-destructive hover:translate-x-2"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">Sign Out</span>
                  </button>
                </div>
              ) : (
                <div
                  className="space-y-3 pt-4 border-t border-border animate-fade-in"
                  style={{ animationDelay: "0.4s" }}
                >
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <button className="w-full text-left text-lg font-medium text-foreground transition-smooth hover:text-primary hover:translate-x-2">
                      Sign In
                    </button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                    <button className="w-full bg-primary text-primary-foreground py-3 text-sm font-medium transition-smooth hover-lift rounded-lg">
                      Get Started
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
