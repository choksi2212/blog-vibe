"use client"

import React from 'react'
import { PublicNav } from "@/components/layout/public-nav"
import { Footer } from "@/components/layout/footer"
import { GSAPFadeIn } from '@/components/ui/gsap-animations'

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNav />
      
      <main className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <GSAPFadeIn delay={0.1}>
            <div className="text-center mb-16">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-black mb-6">
                API Reference
              </h1>
              <p className="text-xl text-gray-600">
                Integrate with Devnovate using our REST API
              </p>
            </div>
          </GSAPFadeIn>

          <GSAPFadeIn delay={0.2}>
            <div className="prose prose-lg max-w-none">
              <h2 className="font-serif text-2xl font-bold text-black mt-8 mb-4">Authentication</h2>
              <p className="text-gray-700 mb-6">
                All API requests require authentication using API keys. Contact us to get access to our API.
              </p>

              <h2 className="font-serif text-2xl font-bold text-black mt-8 mb-4">Endpoints</h2>
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <code className="text-sm">GET /api/blogs</code>
                <p className="text-gray-600 mt-2">Retrieve all published blogs</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <code className="text-sm">POST /api/blogs</code>
                <p className="text-gray-600 mt-2">Create a new blog post</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <code className="text-sm">GET /api/blogs/:id</code>
                <p className="text-gray-600 mt-2">Retrieve a specific blog post</p>
              </div>

              <div className="mt-12 p-6 bg-gray-50 rounded-lg">
                <h3 className="font-serif text-xl font-bold text-black mb-4">API Access</h3>
                <p className="text-gray-700 mb-4">
                  Interested in API access? Get in touch with our team.
                </p>
                <a 
                  href="mailto:manaschoksimirror@gmail.com" 
                  className="inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                  Request API Access
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
