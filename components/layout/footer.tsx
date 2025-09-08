"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Mail, Twitter, Github, Linkedin } from 'lucide-react'
import { GSAPFadeIn } from '@/components/ui/gsap-animations'
import { useToast } from '@/hooks/use-toast'

const footerSections = {
  company: {
    title: 'COMPANY',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Blog', href: '/blogs' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Contact Us', href: '/contact' }
    ]
  },
  legal: {
    title: 'LEGAL',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Copyright', href: '/copyright' },
      { label: 'Accessibility', href: '/accessibility' },
      { label: 'Data Request', href: '/data-request' }
    ]
  },
  resources: {
    title: 'RESOURCES',
    links: [
      { label: 'Documentation', href: '/docs' },
      { label: 'API Reference', href: '/api-docs' },
      { label: 'Guides', href: '/guides' },
      { label: 'Community', href: '/community' },
      { label: 'Status', href: '/status' }
    ]
  }
}

export function Footer() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success!",
          description: "You've been subscribed to our newsletter.",
        })
        setEmail('')
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to subscribe",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <GSAPFadeIn delay={0.1}>
              <div className="mb-6">
                <h3 className="font-serif text-2xl font-bold mb-4">Devnovate</h3>
                <p className="text-gray-300 leading-relaxed max-w-sm">
                  Empowering developers to share knowledge and grow together. A platform 
                  where developers can write, discover, and engage with high-quality technical content.
                </p>
              </div>
              
              <div className="mb-8">
                <h4 className="font-medium mb-4">Stay Updated</h4>
                <p className="text-gray-400 text-sm mb-4">
                  Get the latest updates on new features, protocols, and platform developments.
                </p>
                <form onSubmit={handleSubscribe} className="flex gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@gmail.com"
                    required
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-gray-900 text-white placeholder:text-gray-500 border border-gray-700 focus:outline-none focus:border-white text-sm disabled:opacity-50"
                  />
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-white text-black hover:bg-gray-200 transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    {isLoading ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </form>
              </div>

              <div className="flex gap-4">
                <a
                  href="https://x.com/manas_choksi_22"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="https://github.com/choksi2212"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://linkedin.com/in/manas-choksi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="mailto:manaschoksimirror@gmail.com"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </GSAPFadeIn>
          </div>

          {/* Footer Links */}
          {Object.entries(footerSections).map(([key, section], index) => (
            <div key={key}>
              <GSAPFadeIn delay={0.2 + index * 0.1}>
                <h4 className="font-medium text-sm text-gray-300 mb-4 tracking-wider">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </GSAPFadeIn>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <GSAPFadeIn delay={0.6}>
          <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 Devnovate. Built with passion for the developer community.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-white transition-colors">
                Cookie Policy
              </Link>
              <Link href="/accessibility" className="hover:text-white transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
        </GSAPFadeIn>
      </div>
    </footer>
  )
}
