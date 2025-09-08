"use client"

import React from 'react'
import { PublicNav } from "@/components/layout/public-nav"
import { Footer } from "@/components/layout/footer"
import { GSAPFadeIn } from '@/components/ui/gsap-animations'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNav />
      
      <main className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <GSAPFadeIn delay={0.1}>
            <div className="text-center mb-16">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-black mb-6">
                Terms of Service
              </h1>
              <p className="text-xl text-gray-600">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </GSAPFadeIn>

          <GSAPFadeIn delay={0.2}>
            <div className="prose prose-lg max-w-none">
              <h2 className="font-serif text-2xl font-bold text-black mt-8 mb-4">Acceptance of Terms</h2>
              <p className="text-gray-700 mb-6">
                By accessing and using Devnovate, you accept and agree to be bound by the terms 
                and provision of this agreement.
              </p>

              <h2 className="font-serif text-2xl font-bold text-black mt-8 mb-4">Use License</h2>
              <p className="text-gray-700 mb-6">
                Permission is granted to temporarily use Devnovate for personal, non-commercial 
                transitory viewing only. This is the grant of a license, not a transfer of title.
              </p>

              <h2 className="font-serif text-2xl font-bold text-black mt-8 mb-4">User Content</h2>
              <p className="text-gray-700 mb-6">
                You retain ownership of content you post on Devnovate. By posting content, you grant 
                us a license to use, modify, and display your content on our platform.
              </p>

              <h2 className="font-serif text-2xl font-bold text-black mt-8 mb-4">Prohibited Uses</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Posting harmful, offensive, or illegal content</li>
                <li>Attempting to gain unauthorized access to our systems</li>
                <li>Using the platform for spam or commercial solicitation</li>
                <li>Violating any applicable laws or regulations</li>
              </ul>

              <h2 className="font-serif text-2xl font-bold text-black mt-8 mb-4">Contact Information</h2>
              <p className="text-gray-700">
                If you have any questions about these Terms of Service, please contact us at{' '}
                <a href="mailto:manaschoksimirror@gmail.com" className="text-black underline">
                  manaschoksimirror@gmail.com
                </a>
              </p>
            </div>
          </GSAPFadeIn>
        </div>
      </main>

      <Footer />
    </div>
  )
}
