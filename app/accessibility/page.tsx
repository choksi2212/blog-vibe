"use client"

import React from 'react'
import { PublicNav } from "@/components/layout/public-nav"
import { Footer } from "@/components/layout/footer"
import { GSAPFadeIn } from '@/components/ui/gsap-animations'

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNav />
      
      <main className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <GSAPFadeIn delay={0.1}>
            <div className="text-center mb-16">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-black mb-6">
                Accessibility Statement
              </h1>
              <p className="text-xl text-gray-600">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </GSAPFadeIn>

          <GSAPFadeIn delay={0.2}>
            <div className="prose prose-lg max-w-none">
              <h2 className="font-serif text-2xl font-bold text-black mt-8 mb-4">Our Commitment</h2>
              <p className="text-gray-700 mb-6">
                Devnovate is committed to ensuring digital accessibility for people with disabilities. 
                We are continually improving the user experience for everyone and applying the relevant 
                accessibility standards to ensure we provide equal access to all users.
              </p>

              <h2 className="font-serif text-2xl font-bold text-black mt-8 mb-4">Conformance Status</h2>
              <p className="text-gray-700 mb-6">
                We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. 
                These guidelines explain how to make web content more accessible for people with 
                disabilities and user-friendly for everyone.
              </p>

              <h2 className="font-serif text-2xl font-bold text-black mt-8 mb-4">Accessibility Features</h2>
              <p className="text-gray-700 mb-4">
                We have implemented the following accessibility features on our website:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Keyboard navigation support</li>
                <li>Alternative text for images</li>
                <li>Semantic HTML5 markup</li>
                <li>ARIA landmarks and roles</li>
                <li>Sufficient color contrast</li>
                <li>Responsive design for various screen sizes</li>
              </ul>

              <h2 className="font-serif text-2xl font-bold text-black mt-8 mb-4">Areas for Improvement</h2>
              <p className="text-gray-700 mb-6">
                We're always looking to improve the accessibility of our website. If you encounter any 
                issues or have suggestions for improvement, please let us know.
              </p>

              <h2 className="font-serif text-2xl font-bold text-black mt-8 mb-4">Feedback</h2>
              <p className="text-gray-700 mb-6">
                We welcome your feedback on the accessibility of Devnovate. Please let us know if you 
                encounter accessibility barriers:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Email: <a href="mailto:manaschoksimirror@gmail.com" className="text-black underline">manaschoksimirror@gmail.com</a></li>
                <li>We try to respond to feedback within 5 business days</li>
              </ul>

              <h2 className="font-serif text-2xl font-bold text-black mt-8 mb-4">Technical Specifications</h2>
              <p className="text-gray-700 mb-6">
                Accessibility of Devnovate relies on the following technologies to work with the 
                particular combination of web browser and any assistive technologies or plugins 
                installed on your computer:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>HTML</li>
                <li>WAI-ARIA</li>
                <li>CSS</li>
                <li>JavaScript</li>
              </ul>

              <div className="mt-12 p-6 bg-gray-50 rounded-lg">
                <h3 className="font-serif text-xl font-bold text-black mb-4">Need Help?</h3>
                <p className="text-gray-700 mb-4">
                  If you're having trouble accessing any part of our website, please don't hesitate to contact us.
                </p>
                <a 
                  href="mailto:manaschoksimirror@gmail.com" 
                  className="inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                  Contact Us About Accessibility
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
