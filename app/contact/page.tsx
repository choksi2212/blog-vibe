"use client"

import React from 'react'
import { PublicNav } from "@/components/layout/public-nav"
import { Footer } from "@/components/layout/footer"
import { GSAPFadeIn } from '@/components/ui/gsap-animations'
import { Mail, Twitter, Github, Linkedin } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNav />
      
      <main className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <GSAPFadeIn delay={0.1}>
            <div className="text-center mb-16">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-black mb-6">
                Get in Touch
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Have questions, feedback, or want to collaborate? We'd love to hear from you.
              </p>
            </div>
          </GSAPFadeIn>

          <GSAPFadeIn delay={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="font-serif text-2xl font-bold text-black mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-600" />
                    <a 
                      href="mailto:manaschoksimirror@gmail.com"
                      className="text-gray-700 hover:text-black transition-colors"
                    >
                      manaschoksimirror@gmail.com
                    </a>
                  </div>
                </div>

                <h3 className="font-medium text-black mt-8 mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <a
                    href="https://x.com/manas_choksi_22"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a
                    href="https://github.com/choksi2212"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                  <a
                    href="https://linkedin.com/in/manas-choksi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold text-black mb-6">Quick Contact</h2>
                <p className="text-gray-700 mb-6">
                  For the fastest response, send us an email directly. We typically respond within 24 hours.
                </p>
                <a 
                  href="mailto:manaschoksimirror@gmail.com" 
                  className="bg-black text-white px-8 py-3 font-medium hover:bg-gray-800 transition-colors inline-block"
                >
                  Send Email
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
