"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import Link from "next/link"
import { User, LogOut, PenTool, Shield, Menu, X, Search } from "lucide-react"
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
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo - Squarespace style */}
          <Link href="/" className="font-serif text-2xl font-semibold text-black tracking-tight hover:opacity-70 transition-opacity">
            Devnovate
          </Link>

          {/* Desktop Navigation - Clean minimal style */}
          <div className="hidden lg:flex items-center space-x-12">
            <Link href="/blogs" className="text-sm font-medium text-gray-900 hover:opacity-70 transition-opacity">
              Articles
            </Link>
            <Link href="/search" className="text-sm font-medium text-gray-900 hover:opacity-70 transition-opacity">
              Search
            </Link>
            {user && (
              <Link href="/dashboard" className="text-sm font-medium text-gray-900 hover:opacity-70 transition-opacity">
                Dashboard
              </Link>
            )}
          </div>

          {/* Search - Desktop */}
          <div className="hidden md:flex items-center max-w-sm flex-1 mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
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
                className="pl-10 pr-4 py-2 w-full border border-gray-200 bg-gray-50 text-sm placeholder:text-gray-500 focus:bg-white focus:border-black focus:outline-none transition-all"
                placeholder="Search articles..."
              />
            </div>
          </div>

          {/* Desktop User Menu - Squarespace style */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-900 hover:opacity-70 transition-opacity">
                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-xs font-semibold">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden lg:block">{user.email?.split("@")[0]}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center px-4 py-3 text-sm text-gray-900 hover:bg-gray-50">
                      <PenTool className="w-4 h-4 mr-3" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {userRole === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center px-4 py-3 text-sm text-gray-900 hover:bg-gray-50">
                        <Shield className="w-4 h-4 mr-3" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-gray-100" />
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center px-4 py-3 text-sm text-gray-900 hover:bg-gray-50">
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login">
                  <button className="text-sm font-medium text-gray-900 hover:opacity-70 transition-opacity">
                    Sign In
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition-colors">
                    Get Started
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-900 hover:opacity-70 transition-opacity" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu - Squarespace style */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-6 py-6 space-y-6">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
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
                  className="pl-10 pr-4 py-3 w-full border border-gray-200 bg-gray-50 text-sm placeholder:text-gray-500 focus:bg-white focus:border-black focus:outline-none transition-all"
                  placeholder="Search articles..."
                />
              </div>

              {/* Mobile Navigation Links */}
              <div className="space-y-4">
                <Link href="/blogs" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium text-gray-900 hover:opacity-70 transition-opacity">
                  Articles
                </Link>
                <Link href="/search" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium text-gray-900 hover:opacity-70 transition-opacity">
                  Search
                </Link>
                {user && (
                  <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium text-gray-900 hover:opacity-70 transition-opacity">
                    Dashboard
                  </Link>
                )}
              </div>

              {/* Mobile User Menu */}
              {user ? (
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{user.email?.split("@")[0]}</span>
                  </div>
                  {userRole === "admin" && (
                    <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-3 text-gray-900 hover:opacity-70 transition-opacity">
                      <Shield className="w-5 h-5" />
                      <span className="text-sm font-medium">Admin Panel</span>
                    </Link>
                  )}
                  <button onClick={() => { handleSignOut(); setIsMenuOpen(false); }} className="flex items-center space-x-3 text-gray-900 hover:opacity-70 transition-opacity">
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <button className="w-full text-left text-lg font-medium text-gray-900 hover:opacity-70 transition-opacity">
                      Sign In
                    </button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                    <button className="w-full bg-black text-white py-3 text-sm font-medium hover:bg-gray-800 transition-colors">
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
