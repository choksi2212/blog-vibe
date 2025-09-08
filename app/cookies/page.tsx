"use client"

import React from 'react'
import { PublicNav } from "@/components/layout/public-nav"
import { Footer } from "@/components/layout/footer"
import { GSAPFadeIn } from '@/components/ui/gsap-animations'

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNav />
      
      <main className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <GSAPFadeIn delay={0.1}>
            <div className="text-center mb-16">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-black mb-6">
                Cookie Policy
              </h1>
              <p className="text-xl text-gray-600">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </GSAPFadeIn>

          <GSAPFadeIn delay={0.2}>
            <div className="prose prose-lg max-w-none">
              <h2 className="font-serif text-2xl font-bold text-black mt-8 mb-4">What Are Cookies</h2>
              <p className="text-gray-700 mb-6">
                Cookies are small text files that are stored on your device when you visit our website. 
                They help us provide you with a better experience by remembering your preferences and 
                enabling certain functionality.
              </p>

              <h2 className="font-serif text-2xl font-bold text-black mt-8 mb-4">How We Use Cookies</h2>
              <p className="text-gray-700 mb-6">
                We use cookies for various purposes, including:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Authentication and security</li>
                <li>Remembering your preferences</li>
                <li>Analyzing site usage</li>
                <li>Improving our services</li>
              </ul>

              <h2 className="font-serif text-2xl font-bold text-black mt-8 mb-4">Managing Cookies</h2>
              <p className="text-gray-700 mb-6">
                You can control and/or delete cookies as you wish. You can delete all cookies that are 
                already on your device and you can set most browsers to prevent them from being placed. 
                If you do this, however, you may have to manually adjust some preferences every time 
                you visit our site and some services and functionalities may not work.
              </p>

              <h2 className="font-serif text-2xl font-bold text-black mt-8 mb-4">Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions about our Cookie Policy, please contact us at{' '}
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
