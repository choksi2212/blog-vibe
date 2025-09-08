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
    <div className="min-h-screen bg-background">
      <PublicNav />
      <main>
        <HeroSection />
        <TrendingBlogs />
        <TestimonialsSection />
        <NewsletterSignup />
      </main>
      <Footer />
    </div>
  )
}
