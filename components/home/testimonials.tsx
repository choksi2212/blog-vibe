"use client"

import React from 'react'
import { Star, Quote } from 'lucide-react'
import { gsap } from 'gsap'
import { GSAPFadeIn } from '@/components/ui/gsap-animations'
import { GSAPScrollFade, GSAPScrollStagger } from '@/components/ui/gsap-scroll-animations'

interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  rating: number
  avatar?: string
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'Senior Developer',
    company: 'TechCorp',
    content: 'Devnovate has transformed how I share knowledge with my team. The platform is intuitive and the community is incredibly supportive.',
    rating: 5
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    role: 'Tech Lead',
    company: 'StartupXYZ',
    content: 'The quality of content on Devnovate is exceptional. I\'ve learned more here in 6 months than I did in years elsewhere.',
    rating: 5
  },
  {
    id: '3',
    name: 'Emily Johnson',
    role: 'Full Stack Engineer',
    company: 'InnovateLabs',
    content: 'Writing on Devnovate has helped me grow as a developer and connect with amazing people in the tech community.',
    rating: 5
  },
  {
    id: '4',
    name: 'David Kim',
    role: 'Software Architect',
    company: 'CloudTech',
    content: 'The platform\'s clean design and powerful features make it a joy to use. Highly recommend for any developer.',
    rating: 5
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    role: 'Frontend Developer',
    company: 'DesignStudio',
    content: 'Devnovate\'s community has been invaluable for my career growth. The feedback and discussions are top-notch.',
    rating: 5
  },
  {
    id: '6',
    name: 'Alex Patel',
    role: 'DevOps Engineer',
    company: 'ScaleUp',
    content: 'I love how easy it is to discover new technologies and best practices through the curated content here.',
    rating: 5
  }
]

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? 'fill-black text-black' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  )
}

const TestimonialCard: React.FC<{ testimonial: Testimonial; index: number }> = ({
  testimonial,
  index
}) => {
  const cardRef = React.useRef<HTMLDivElement>(null)

  const handleHover = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: -8,
        scale: 1.02,
        duration: 0.4,
        ease: "power2.out"
      })
    }
  }

  const handleHoverOut = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: 0,
        scale: 1,
        duration: 0.4,
        ease: "power2.out"
      })
    }
  }

  return (
    <div 
      ref={cardRef}
      className="bg-white border border-gray-200 p-6 h-full flex flex-col cursor-pointer"
      onMouseEnter={handleHover}
      onMouseLeave={handleHoverOut}
    >
      <div className="flex items-start justify-between mb-4">
        <Quote className="w-8 h-8 text-gray-300 flex-shrink-0" />
        <StarRating rating={testimonial.rating} />
      </div>
      
      <p className="text-gray-700 mb-6 flex-1 leading-relaxed">
        "{testimonial.content}"
      </p>
      
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-medium text-lg">
          {testimonial.name.charAt(0)}
        </div>
        <div>
          <h4 className="font-medium text-black">{testimonial.name}</h4>
          <p className="text-sm text-gray-600">
            {testimonial.role} at {testimonial.company}
          </p>
        </div>
      </div>
    </div>
  )
}

export function TestimonialsSection() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <GSAPFadeIn delay={0.1}>
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6">
              What Developers Say
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Join thousands of developers who trust Devnovate to share knowledge, grow their careers, and build amazing things together.
            </p>
          </div>
        </GSAPFadeIn>

        <GSAPScrollStagger>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                index={index}
              />
            ))}
          </div>
        </GSAPScrollStagger>

      </div>
    </section>
  )
}
