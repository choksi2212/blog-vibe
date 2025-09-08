"use client"

import React from 'react'
import { PublicNav } from "@/components/layout/public-nav"
import { Footer } from "@/components/layout/footer"
import { GSAPFadeIn } from '@/components/ui/gsap-animations'

export default function PressPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNav />
      
      <main className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <GSAPFadeIn delay={0.1}>
            <div className="text-center mb-16">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-black mb-6">
                Press & Media
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Resources and information for media inquiries.
              </p>
            </div>
          </GSAPFadeIn>

          <GSAPFadeIn delay={0.2}>
            <div className="text-center">
              <p className="text-gray-700 text-lg mb-8">
                For press inquiries, interviews, or media resources, please contact us directly.
              </p>
              <a 
                href="mailto:manaschoksimirror@gmail.com" 
                className="bg-black text-white px-8 py-3 font-medium hover:bg-gray-800 transition-colors"
              >
                Media Contact
              </a>
            </div>
          </GSAPFadeIn>
        </div>
      </main>

      <Footer />
    </div>
  )
}
