"use client"

import React from 'react'
import { PublicNav } from "@/components/layout/public-nav"
import { Footer } from "@/components/layout/footer"
import { GSAPFadeIn } from '@/components/ui/gsap-animations'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNav />
      
      <main className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <GSAPFadeIn delay={0.1}>
            <div className="text-center mb-16">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-black mb-6">
                About Devnovate
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Empowering developers to share knowledge and grow together through high-quality technical content.
              </p>
            </div>
          </GSAPFadeIn>

          <GSAPFadeIn delay={0.2}>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                Devnovate is a platform built by developers, for developers. We believe that knowledge sharing 
                is the cornerstone of innovation in the tech industry. Our mission is to create a space where 
                developers can write, discover, and engage with high-quality technical content.
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                Whether you're a seasoned engineer looking to share your expertise or a newcomer eager to learn, 
                Devnovate provides the tools and community you need to grow your skills and advance your career.
              </p>

              <h2 className="font-serif text-2xl font-bold text-black mt-12 mb-6">Our Vision</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                To become the go-to platform for developers worldwide to share knowledge, collaborate on ideas, 
                and build the future of technology together.
              </p>

              <h2 className="font-serif text-2xl font-bold text-black mt-12 mb-6">What We Offer</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-3 mb-6">
                <li>A clean, distraction-free writing environment</li>
                <li>Powerful content discovery and curation</li>
                <li>Engaged community of developers</li>
                <li>Advanced analytics and insights</li>
                <li>Seamless integration with development workflows</li>
              </ul>
            </div>
          </GSAPFadeIn>
        </div>
      </main>

      <Footer />
    </div>
  )
}
