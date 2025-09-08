"use client"

import React from 'react'
import { PublicNav } from "@/components/layout/public-nav"
import { Footer } from "@/components/layout/footer"
import { GSAPFadeIn } from '@/components/ui/gsap-animations'

export default function CopyrightPage() {
  const currentYear = new Date().getFullYear()
  
  return (
    <div className="min-h-screen bg-white">
      <PublicNav />
      
      <main className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <GSAPFadeIn delay={0.1}>
            <div className="text-center mb-16">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-black mb-6">
                Copyright Policy
              </h1>
              <p className="text-xl text-gray-600">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </GSAPFadeIn>

          <GSAPFadeIn delay={0.2}>
            <div className="prose prose-lg max-w-none">
              <h2 className="font-serif text-2xl font-bold text-black mt-8 mb-4">Copyright Notice</h2>
              <p className="text-gray-700 mb-6">
                © {currentYear} Devnovate. All rights reserved. All content on this website, including but not limited to 
                text, graphics, logos, and images, is the property of Devnovate or its content suppliers and is 
                protected by international copyright laws.
              </p>

              <h2 className="font-serif text-2xl font-bold text-black mt-8 mb-4">Use of Content</h2>
              <p className="text-gray-700 mb-6">
                The content on this website is for personal, non-commercial use only. You may not reproduce, distribute, 
                modify, create derivative works of, publicly display, or in any way exploit any of the content without 
                our express written permission.
              </p>

              <h2 className="font-serif text-2xl font-bold text-black mt-8 mb-4">User-Generated Content</h2>
              <p className="text-gray-700 mb-6">
                By posting content on our platform, you grant Devnovate a non-exclusive, royalty-free, perpetual, 
                and worldwide license to use, reproduce, modify, adapt, publish, translate, create derivative works 
                from, distribute, and display such content.
              </p>

              <h2 className="font-serif text-2xl font-bold text-black mt-8 mb-4">Copyright Infringement</h2>
              <p className="text-gray-700 mb-6">
                If you believe that your work has been copied in a way that constitutes copyright infringement, 
                please provide our copyright agent with the following information:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Identification of the copyrighted work claimed to have been infringed</li>
                <li>Identification of the material that is claimed to be infringing</li>
                <li>Your contact information</li>
                <li>A statement that you have a good faith belief that use of the material is not authorized</li>
                <li>A statement that the information in the notification is accurate</li>
              </ul>

              <h2 className="font-serif text-2xl font-bold text-black mt-8 mb-4">Contact Information</h2>
              <p className="text-gray-700">
                For copyright-related inquiries, please contact us at{' '}
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
