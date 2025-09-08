"use client"

import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

// Register GSAP plugins
gsap.registerPlugin(useGSAP)

interface AnimatedCounterProps {
  value: number
  duration?: number
  className?: string
  prefix?: string
  suffix?: string
}

export const GSAPAnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 2,
  className = '',
  prefix = '',
  suffix = ''
}) => {
  const counterRef = useRef<HTMLSpanElement>(null)
  const [displayValue, setDisplayValue] = useState(0)

  useGSAP(() => {
    if (counterRef.current) {
      const obj = { value: 0 }
      gsap.to(obj, {
        value: value,
        duration: duration,
        ease: "power2.out",
        onUpdate: function() {
          setDisplayValue(Math.floor(obj.value))
        }
      })
    }
  }, [value])

  return (
    <span ref={counterRef} className={className}>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  )
}

interface GSAPMetricCardProps {
  title: string
  value: number
  change?: number
  trend?: 'up' | 'down' | 'neutral'
  className?: string
  delay?: number
}

export const GSAPMetricCard: React.FC<GSAPMetricCardProps> = ({
  title,
  value,
  change,
  trend = 'neutral',
  className = '',
  delay = 0
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (cardRef.current && contentRef.current) {
      // Initial state
      gsap.set(cardRef.current, { 
        opacity: 0, 
        y: 30,
        scale: 0.95
      })
      
      gsap.set(contentRef.current.children, { 
        opacity: 0, 
        y: 20 
      })

      // Animate card entrance
      gsap.to(cardRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        delay: delay,
        ease: "back.out(1.7)"
      })

      // Animate content with stagger
      gsap.to(contentRef.current.children, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        delay: delay + 0.2,
        stagger: 0.1,
        ease: "power2.out"
      })
    }
  }, [delay])

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-black'
      case 'down': return 'text-gray-600'
      default: return 'text-gray-400'
    }
  }

  const handleHover = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: -5,
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out"
      })
    }
  }

  const handleHoverOut = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      })
    }
  }

  return (
    <div 
      ref={cardRef}
      className={`bg-white p-6 border border-gray-200 cursor-pointer ${className}`}
      onMouseEnter={handleHover}
      onMouseLeave={handleHoverOut}
    >
      <div ref={contentRef}>
        <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
        <div className="flex items-center space-x-2">
          <GSAPAnimatedCounter 
            value={value} 
            className="text-2xl font-bold text-gray-900" 
          />
          {change !== undefined && (
            <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
              <span className="text-sm font-medium">
                {change > 0 ? '+' : ''}{change}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface GSAPProgressBarProps {
  value: number
  max: number
  className?: string
  showLabel?: boolean
  color?: string
  delay?: number
}

export const GSAPProgressBar: React.FC<GSAPProgressBarProps> = ({
  value,
  max,
  className = '',
  showLabel = false,
  color = 'bg-gray-900',
  delay = 0
}) => {
  const progressRef = useRef<HTMLDivElement>(null)
  const percentage = Math.min((value / max) * 100, 100)

  useGSAP(() => {
    if (progressRef.current) {
      gsap.fromTo(progressRef.current, 
        { width: '0%' },
        { 
          width: `${percentage}%`,
          duration: 1.5,
          delay: delay,
          ease: "power2.out"
        }
      )
    }
  }, [percentage, delay])

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            {value} / {max}
          </span>
          <span className="text-sm text-gray-600">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 h-2 overflow-hidden">
        <div
          ref={progressRef}
          className={`${color} h-full`}
        />
      </div>
    </div>
  )
}

interface GSAPStatusBadgeProps {
  status: 'published' | 'draft' | 'pending' | 'rejected' | 'hidden'
  className?: string
  delay?: number
}

export const GSAPStatusBadge: React.FC<GSAPStatusBadgeProps> = ({
  status,
  className = '',
  delay = 0
}) => {
  const badgeRef = useRef<HTMLSpanElement>(null)

  useGSAP(() => {
    if (badgeRef.current) {
      gsap.fromTo(badgeRef.current,
        { opacity: 0, scale: 0.8 },
        { 
          opacity: 1, 
          scale: 1,
          duration: 0.4,
          delay: delay,
          ease: "back.out(1.7)"
        }
      )
    }
  }, [delay])

  const getStatusStyles = () => {
    switch (status) {
      case 'published':
        return 'bg-black text-white border-black'
      case 'draft':
        return 'bg-white text-black border-gray-400'
      case 'pending':
        return 'bg-gray-800 text-white border-gray-800'
      case 'rejected':
        return 'bg-gray-600 text-white border-gray-600'
      case 'hidden':
        return 'bg-gray-300 text-black border-gray-300'
      default:
        return 'bg-white text-black border-gray-400'
    }
  }

  return (
    <span 
      ref={badgeRef}
      className={`inline-flex items-center px-2 py-1 text-xs font-medium border ${getStatusStyles()} ${className}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

interface GSAPLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  color?: string
}

export const GSAPLoadingSpinner: React.FC<GSAPLoadingSpinnerProps> = ({
  size = 'md',
  className = '',
  color = 'border-gray-900'
}) => {
  const spinnerRef = useRef<HTMLDivElement>(null)

  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  useGSAP(() => {
    if (spinnerRef.current) {
      gsap.to(spinnerRef.current, {
        rotation: 360,
        duration: 1,
        repeat: -1,
        ease: "none"
      })
    }
  }, [])

  return (
    <div className={`${sizes[size]} ${className}`}>
      <div 
        ref={spinnerRef}
        className={`rounded-full border-2 border-gray-300 border-t-transparent ${color} h-full w-full`}
      />
    </div>
  )
}

interface GSAPFadeInProps {
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  distance?: number
  className?: string
}

export const GSAPFadeIn: React.FC<GSAPFadeInProps> = ({
  children,
  delay = 0,
  direction = 'up',
  distance = 30,
  className = ''
}) => {
  const elementRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (elementRef.current) {
      const getInitialPosition = () => {
        switch (direction) {
          case 'up': return { y: distance }
          case 'down': return { y: -distance }
          case 'left': return { x: distance }
          case 'right': return { x: -distance }
          default: return { y: distance }
        }
      }

      gsap.fromTo(elementRef.current,
        { 
          opacity: 0,
          ...getInitialPosition()
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.8,
          delay: delay,
          ease: "power2.out"
        }
      )
    }
  }, [delay, direction, distance])

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  )
}

// Hook for scroll-triggered animations
export const useGSAPScrollTrigger = () => {
  useEffect(() => {
    // Dynamically import ScrollTrigger to avoid SSR issues
    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      gsap.registerPlugin(ScrollTrigger)
      
      // Refresh ScrollTrigger after registration
      ScrollTrigger.refresh()
    })
  }, [])
}
