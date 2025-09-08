"use client"

import React from 'react'
import { PublicNav } from "@/components/layout/public-nav"
import { Footer } from "@/components/layout/footer"
import { GSAPFadeIn } from '@/components/ui/gsap-animations'

export default function StatusPage() {
  const services = [
    { name: 'Website', status: 'operational', uptime: '99.9%' },
    { name: 'API', status: 'operational', uptime: '99.8%' },
    { name: 'Database', status: 'operational', uptime: '99.9%' },
    { name: 'CDN', status: 'operational', uptime: '100%' },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-500'
      case 'degraded': return 'bg-yellow-500'
      case 'outage': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <PublicNav />
      
      <main className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <GSAPFadeIn delay={0.1}>
            <div className="text-center mb-16">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-black mb-6">
                System Status
              </h1>
              <p className="text-xl text-gray-600">
                Current status of Devnovate services
              </p>
            </div>
          </GSAPFadeIn>

          <GSAPFadeIn delay={0.2}>
            <div className="mb-12">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <h2 className="text-lg font-medium text-green-800">All Systems Operational</h2>
                </div>
                <p className="text-green-700 mt-2">All services are running normally.</p>
              </div>

              <div className="space-y-4">
                {services.map((service) => (
                  <div key={service.name} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${getStatusColor(service.status)}`}></div>
                        <span className="font-medium text-black">{service.name}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">Uptime: {service.uptime}</span>
                        <span className="text-sm text-green-600 capitalize">{service.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GSAPFadeIn>

          <GSAPFadeIn delay={0.3}>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-serif text-xl font-bold text-black mb-4">Recent Updates</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-black">System Maintenance Complete</h4>
                      <p className="text-gray-600 text-sm">Routine maintenance completed successfully</p>
                    </div>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-black">Performance Improvements</h4>
                      <p className="text-gray-600 text-sm">API response times improved by 15%</p>
                    </div>
                    <span className="text-xs text-gray-500">1 day ago</span>
                  </div>
                </div>
              </div>
            </div>
          </GSAPFadeIn>

          <GSAPFadeIn delay={0.4}>
            <div className="mt-12 text-center">
              <h2 className="font-serif text-2xl font-bold text-black mb-4">Issues or Questions?</h2>
              <p className="text-gray-600 mb-6">
                If you're experiencing issues not reflected here, please contact our support team.
              </p>
              <a 
                href="mailto:manaschoksimirror@gmail.com" 
                className="inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                Contact Support
              </a>
            </div>
          </GSAPFadeIn>
        </div>
      </main>

      <Footer />
    </div>
  )
}
