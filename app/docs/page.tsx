"use client"

import React from 'react'
import { PublicNav } from "@/components/layout/public-nav"
import { Footer } from "@/components/layout/footer"
import { GSAPFadeIn } from '@/components/ui/gsap-animations'

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNav />
      
      <main className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <GSAPFadeIn delay={0.1}>
            <div className="text-center mb-16">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-black mb-6">
                Documentation
              </h1>
              <p className="text-xl text-gray-600">
                Everything you need to know about using Devnovate
              </p>
            </div>
          </GSAPFadeIn>

          <GSAPFadeIn delay={0.2}>
            <div className="prose prose-lg max-w-none">
              <h2 className="font-serif text-2xl font-bold text-black mt-8 mb-4">Getting Started</h2>
              <p className="text-gray-700 mb-6">
                Welcome to Devnovate! This documentation will help you get started with our platform
                and make the most of all available features.
              </p>

              <h2 className="font-serif text-2xl font-bold text-black mt-8 mb-4">Writing Your First Blog</h2>
              <p className="text-gray-700 mb-6">
                Learn how to create engaging technical content that resonates with the developer community.
                Our editor supports markdown, code syntax highlighting, and rich media embedding.
              </p>

              <h2 className="font-serif text-2xl font-bold text-black mt-8 mb-4">Community Guidelines</h2>
              <p className="text-gray-700 mb-6">
                To maintain a high-quality platform, we ask all users to follow our community guidelines
                when posting content and engaging with other developers.
              </p>

              <h2 className="font-serif text-2xl font-bold text-black mt-8 mb-4">Features</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Rich text editor with markdown support</li>
                <li>Code syntax highlighting</li>
                <li>Image and media embedding</li>
                <li>Community engagement tools</li>
                <li>Analytics and insights</li>
              </ul>

              <div className="mt-12 p-6 bg-gray-50 rounded-lg">
                <h3 className="font-serif text-xl font-bold text-black mb-4">Need Help?</h3>
                <p className="text-gray-700 mb-4">
                  Can't find what you're looking for? Our team is here to help.
                </p>
                <a 
                  href="mailto:manaschoksimirror@gmail.com" 
                  className="inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </GSAPFadeIn>
        </div>
      </main>

      <Footer />
    </div>
  )
}
