"use client"

import React, { useState } from 'react'
import { PublicNav } from "@/components/layout/public-nav"
import { Footer } from "@/components/layout/footer"
import { GSAPFadeIn } from '@/components/ui/gsap-animations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function DataRequestPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    requestType: 'access',
    description: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{success: boolean, message: string} | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      // In a real application, you would send this data to your backend
      console.log('Submitting data request:', formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setSubmitStatus({
        success: true,
        message: 'Your request has been submitted successfully. We will process it within 30 days.'
      })
      
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        requestType: 'access',
        description: '',
      })
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: 'An error occurred while submitting your request. Please try again later.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-white">
      <PublicNav />
      
      <main className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <GSAPFadeIn delay={0.1}>
            <div className="text-center mb-12">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-black mb-4">
                Data Request
              </h1>
              <p className="text-xl text-gray-600">
                Submit a request regarding your personal data
              </p>
            </div>
          </GSAPFadeIn>

          <GSAPFadeIn delay={0.2}>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              {submitStatus ? (
                <div className={`p-4 mb-6 rounded-md ${submitStatus.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  {submitStatus.message}
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="requestType" className="block text-sm font-medium text-gray-700 mb-1">
                    Type of Request
                  </label>
                  <select
                    id="requestType"
                    name="requestType"
                    value={formData.requestType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                    required
                  >
                    <option value="access">Access my data</option>
                    <option value="deletion">Delete my data</option>
                    <option value="correction">Correct my data</option>
                    <option value="restriction">Restrict processing</option>
                    <option value="portability">Data portability</option>
                    <option value="objection">Object to processing</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description of Your Request
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Please provide details about your request..."
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Please be as specific as possible to help us process your request efficiently.
                  </p>
                </div>

                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full bg-black text-white hover:bg-gray-800"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  </Button>
                </div>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-lg font-medium text-black mb-3">What to Expect</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>We will verify your identity before processing your request</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>You will receive a confirmation email with a reference number</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>We will respond to your request within 30 days</span>
                  </li>
                </ul>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-md">
                  <h4 className="font-medium text-black mb-2">Need help?</h4>
                  <p className="text-sm text-gray-600">
                    If you have questions about your data rights, please contact us at{' '}
                    <a href="mailto:manaschoksimirror@gmail.com" className="text-black underline">
                      manaschoksimirror@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </GSAPFadeIn>
        </div>
      </main>

      <Footer />
    </div>
  )
}
