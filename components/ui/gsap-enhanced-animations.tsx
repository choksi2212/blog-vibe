"use client"

import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

// Advanced GSAP preloader for lightning-fast loading
export const GSAPPreloader: React.FC = () => {
  const preloaderRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (preloaderRef.current && logoRef.current && progressRef.current) {
      const tl = gsap.timeline()
      
      // Logo animation
      tl.fromTo(logoRef.current,
        { scale: 0, rotation: -180 },
        { scale: 1, rotation: 0, duration: 0.8, ease: "back.out(1.7)" }
      )
      
      // Progress bar animation
      tl.fromTo(progressRef.current,
        { width: '0%' },
        { width: '100%', duration: 1.2, ease: "power2.out" },
        "-=0.4"
      )
      
      // Fade out preloader
      tl.to(preloaderRef.current,
        { opacity: 0, duration: 0.5, ease: "power2.out" },
        "+=0.2"
      )
      
      tl.set(preloaderRef.current, { display: 'none' })
    }
  }, [])

  return (
    <div 
      ref={preloaderRef}
      className="fixed inset-0 bg-white z-50 flex items-center justify-center"
    >
      <div className="text-center">
        <div 
          ref={logoRef}
          className="w-16 h-16 bg-black mb-4 mx-auto"
        />
        <div className="w-48 h-1 bg-gray-200 mx-auto">
          <div 
            ref={progressRef}
            className="h-full bg-black"
          />
        </div>
      </div>
    </div>
  )
}

// Enhanced responsive animations
interface GSAPResponsiveContainerProps {
  children: React.ReactNode
  className?: string
}

export const GSAPResponsiveContainer: React.FC<GSAPResponsiveContainerProps> = ({
  children,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (containerRef.current) {
      // Mobile-first responsive animations
      const mm = gsap.matchMedia()
      
      mm.add("(max-width: 768px)", () => {
        gsap.fromTo(containerRef.current!.children,
          { opacity: 0, y: 30 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.6, 
            stagger: 0.1,
            ease: "power2.out"
          }
        )
      })
      
      mm.add("(min-width: 769px)", () => {
        gsap.fromTo(containerRef.current!.children,
          { opacity: 0, x: -50 },
          { 
            opacity: 1, 
            x: 0, 
            duration: 0.8, 
            stagger: 0.15,
            ease: "power2.out"
          }
        )
      })
      
      return () => mm.revert()
    }
  }, [])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}

// Black & White theme toggle with GSAP
interface GSAPThemeToggleProps {
  isDark: boolean
  onToggle: () => void
}

export const GSAPThemeToggle: React.FC<GSAPThemeToggleProps> = ({
  isDark,
  onToggle
}) => {
  const toggleRef = useRef<HTMLButtonElement>(null)
  const circleRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (toggleRef.current && circleRef.current) {
      gsap.to(circleRef.current, {
        x: isDark ? 24 : 0,
        duration: 0.3,
        ease: "power2.out"
      })
      
      gsap.to(toggleRef.current, {
        backgroundColor: isDark ? '#000000' : '#ffffff',
        borderColor: isDark ? '#ffffff' : '#000000',
        duration: 0.3,
        ease: "power2.out"
      })
    }
  }, [isDark])

  const handleClick = () => {
    if (toggleRef.current) {
      gsap.to(toggleRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.out"
      })
    }
    onToggle()
  }

  return (
    <button
      ref={toggleRef}
      onClick={handleClick}
      className="relative w-12 h-6 border-2 border-black bg-white transition-colors"
    >
      <div
        ref={circleRef}
        className="absolute top-0.5 left-0.5 w-4 h-4 bg-black transition-transform"
      />
    </button>
  )
}

// Enhanced loading states
interface GSAPSkeletonProps {
  width?: string
  height?: string
  className?: string
}

export const GSAPSkeleton: React.FC<GSAPSkeletonProps> = ({
  width = '100%',
  height = '1rem',
  className = ''
}) => {
  const skeletonRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (skeletonRef.current) {
      gsap.to(skeletonRef.current, {
        opacity: 0.5,
        duration: 1,
        yoyo: true,
        repeat: -1,
        ease: "power2.inOut"
      })
    }
  }, [])

  return (
    <div
      ref={skeletonRef}
      className={`bg-gray-300 ${className}`}
      style={{ width, height }}
    />
  )
}

// Performance-optimized grid animations
interface GSAPGridProps {
  children: React.ReactNode
  columns?: number
  gap?: string
  className?: string
}

export const GSAPGrid: React.FC<GSAPGridProps> = ({
  children,
  columns = 3,
  gap = '1rem',
  className = ''
}) => {
  const gridRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (gridRef.current) {
      const items = gridRef.current.children
      
      gsap.fromTo(items,
        { 
          opacity: 0, 
          y: 50,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: {
            amount: 0.8,
            grid: [Math.ceil(items.length / columns), columns],
            from: "start"
          },
          ease: "power2.out"
        }
      )
    }
  }, [columns])

  return (
    <div
      ref={gridRef}
      className={`grid ${className}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap
      }}
    >
      {children}
    </div>
  )
}

// Magnetic button effect
interface GSAPMagneticButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

export const GSAPMagneticButton: React.FC<GSAPMagneticButtonProps> = ({
  children,
  onClick,
  className = ''
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      
      gsap.to(buttonRef.current, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: "power2.out"
      })
    }
  }

  const handleMouseLeave = () => {
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)"
      })
    }
  }

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`bg-black text-white px-6 py-3 font-medium hover:bg-gray-800 transition-colors ${className}`}
    >
      {children}
    </button>
  )
}

// Text reveal animation
interface GSAPTextRevealProps {
  text: string
  className?: string
  delay?: number
}

export const GSAPTextReveal: React.FC<GSAPTextRevealProps> = ({
  text,
  className = '',
  delay = 0
}) => {
  const textRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (textRef.current) {
      const words = text.split(' ')
      textRef.current.innerHTML = words
        .map(word => `<span class="inline-block overflow-hidden"><span class="inline-block">${word}</span></span>`)
        .join(' ')

      const spans = textRef.current.querySelectorAll('span span')
      
      gsap.fromTo(spans,
        { y: '100%' },
        {
          y: '0%',
          duration: 0.8,
          delay: delay,
          stagger: 0.1,
          ease: "power2.out"
        }
      )
    }
  }, [text, delay])

  return <div ref={textRef} className={className} />
}
