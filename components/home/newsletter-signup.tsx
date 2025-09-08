"use client"

import React, { useState } from 'react'
import { Mail, ArrowRight } from 'lucide-react'
import { GSAPFadeIn } from '@/components/ui/gsap-animations'
import { GSAPButton } from '@/components/ui/gsap-micro-interactions'

export function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically handle the newsletter signup
    console.log('Newsletter signup:', email)
    setIsSubscribed(true)
    setEmail('')
  }

  if (isSubscribed) {
    return (
      <section className="py-20 px-4 bg-black text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <GSAPFadeIn delay={0.1}>
            <div className="w-16 h-16 bg-white text-black flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Welcome to the Community!
            </h2>
            <p className="text-xl text-gray-300">
              Thank you for subscribing. You'll receive the latest updates on new features, 
              protocols, and platform developments.
            </p>
          </GSAPFadeIn>
        </div>
      </section>
    )
  }

  return null
}
