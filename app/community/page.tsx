"use client"

import React from 'react'
import { PublicNav } from "@/components/layout/public-nav"
import { Footer } from "@/components/layout/footer"
import { GSAPFadeIn } from '@/components/ui/gsap-animations'

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNav />
      
      <main className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <GSAPFadeIn delay={0.1}>
            <div className="text-center mb-16">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-black mb-6">
                Community
              </h1>
              <p className="text-xl text-gray-600">
                Connect with developers from around the world
              </p>
            </div>
          </GSAPFadeIn>

          <GSAPFadeIn delay={0.2}>
            <div className="prose prose-lg max-w-none">
              <h2 className="font-serif text-2xl font-bold text-black mt-8 mb-4">Join Our Community</h2>
              <p className="text-gray-700 mb-6">
                Devnovate is more than just a blogging platform - it's a thriving community of developers
                who are passionate about sharing knowledge and helping each other grow.
              </p>

              <h2 className="font-serif text-2xl font-bold text-black mt-8 mb-4">Community Guidelines</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Be respectful and constructive in all interactions</li>
                <li>Share knowledge freely and help others learn</li>
                <li>Keep discussions relevant and on-topic</li>
                <li>No spam or self-promotion without value</li>
                <li>Report inappropriate content to moderators</li>
              </ul>

              <h2 className="font-serif text-2xl font-bold text-black mt-8 mb-4">Connect With Us</h2>
              <div className="grid gap-6 md:grid-cols-2 mb-8">
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-black mb-2">Discord</h3>
                  <p className="text-gray-600 text-sm mb-4">Join our Discord server for real-time discussions</p>
                  <a href="#" className="text-black underline">Join Discord →</a>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-black mb-2">GitHub</h3>
                  <p className="text-gray-600 text-sm mb-4">Contribute to open source projects</p>
                  <a href="https://github.com/choksi2212" className="text-black underline">View GitHub →</a>
                </div>
              </div>

              <div className="mt-12 p-6 bg-gray-50 rounded-lg">
                <h3 className="font-serif text-xl font-bold text-black mb-4">Get Involved</h3>
                <p className="text-gray-700 mb-4">
                  Want to become a community moderator or contribute to the platform? We'd love to hear from you.
                </p>
                <a 
                  href="mailto:manaschoksimirror@gmail.com" 
                  className="inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                  Get Involved
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
