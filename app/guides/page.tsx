"use client"

import React from 'react'
import { PublicNav } from "@/components/layout/public-nav"
import { Footer } from "@/components/layout/footer"
import { GSAPFadeIn } from '@/components/ui/gsap-animations'

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNav />
      
      <main className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <GSAPFadeIn delay={0.1}>
            <div className="text-center mb-16">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-black mb-6">
                Guides
              </h1>
              <p className="text-xl text-gray-600">
                Step-by-step guides to help you succeed on Devnovate
              </p>
            </div>
          </GSAPFadeIn>

          <GSAPFadeIn delay={0.2}>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-serif text-xl font-bold text-black mb-3">Writing Great Content</h3>
                <p className="text-gray-600 mb-4">
                  Learn how to create technical content that engages readers and builds your reputation.
                </p>
                <a href="#" className="text-black underline hover:no-underline">Read Guide →</a>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-serif text-xl font-bold text-black mb-3">Building Your Audience</h3>
                <p className="text-gray-600 mb-4">
                  Strategies for growing your following and engaging with the developer community.
                </p>
                <a href="#" className="text-black underline hover:no-underline">Read Guide →</a>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-serif text-xl font-bold text-black mb-3">SEO for Developers</h3>
                <p className="text-gray-600 mb-4">
                  Optimize your technical content for search engines and increase visibility.
                </p>
                <a href="#" className="text-black underline hover:no-underline">Read Guide →</a>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-serif text-xl font-bold text-black mb-3">Community Guidelines</h3>
                <p className="text-gray-600 mb-4">
                  Best practices for engaging respectfully with other developers on the platform.
                </p>
                <a href="#" className="text-black underline hover:no-underline">Read Guide →</a>
              </div>
            </div>
          </GSAPFadeIn>

          <GSAPFadeIn delay={0.4}>
            <div className="mt-16 text-center">
              <h2 className="font-serif text-2xl font-bold text-black mb-4">Need More Help?</h2>
              <p className="text-gray-600 mb-6">
                Can't find the guide you're looking for? Let us know what you'd like to learn about.
              </p>
              <a 
                href="mailto:manaschoksimirror@gmail.com" 
                className="inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                Suggest a Guide
              </a>
            </div>
          </GSAPFadeIn>
        </div>
      </main>

      <Footer />
    </div>
  )
}
