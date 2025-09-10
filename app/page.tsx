"use client"

import React from 'react'
import { PublicNav } from "@/components/layout/public-nav"
import { HeroSection } from "@/components/home/hero-section"
import { TrendingBlogs } from "@/components/home/trending-blogs"
import { TestimonialsSection } from "@/components/home/testimonials"
import { NewsletterSignup } from "@/components/home/newsletter-signup"
import { Footer } from "@/components/layout/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Responsive Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-black" />
        
        {/* Animated geometric shapes */}
        <div className="absolute top-10 left-10 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-black/10 dark:bg-white/10 rounded-full blur-2xl animate-float" />
        <div className="absolute top-20 right-10 w-24 h-24 sm:w-36 sm:h-36 lg:w-48 lg:h-48 bg-black/8 dark:bg-white/8 rounded-full blur-2xl animate-float-delayed" />
        <div className="absolute bottom-20 left-1/4 w-28 h-28 sm:w-40 sm:h-40 lg:w-56 lg:h-56 bg-black/6 dark:bg-white/6 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-32 right-1/3 w-20 h-20 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-black/12 dark:bg-white/12 rounded-full blur-2xl animate-float-delayed" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]" />
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-black/20 dark:bg-white/20 rounded-full animate-pulse-subtle" />
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-black/30 dark:bg-white/30 rounded-full animate-pulse-subtle" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 left-1/5 w-1.5 h-1.5 bg-black/25 dark:bg-white/25 rounded-full animate-pulse-subtle" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 right-1/5 w-1 h-1 bg-black/35 dark:bg-white/35 rounded-full animate-pulse-subtle" style={{ animationDelay: '0.5s' }} />
        
        {/* Subtle wave pattern */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/5 dark:from-white/5 to-transparent" />
      </div>
      
      <div className="relative z-10">
        <PublicNav />
        <main>
          <HeroSection />
          <TrendingBlogs />
          <TestimonialsSection />
          <NewsletterSignup />
        </main>
        <Footer />
      </div>
    </div>
  )
}
