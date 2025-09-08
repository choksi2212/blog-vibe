"use client"

import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

// Install ScrollTrigger plugin
let ScrollTrigger: any = null
if (typeof window !== 'undefined') {
  import('gsap/ScrollTrigger').then(({ ScrollTrigger: ST }) => {
    ScrollTrigger = ST
    gsap.registerPlugin(ScrollTrigger)
  })
}

interface GSAPScrollFadeProps {
  children: React.ReactNode
  direction?: 'up' | 'down' | 'left' | 'right'
  distance?: number
  className?: string
  trigger?: string
  start?: string
  end?: string
}

export const GSAPScrollFade: React.FC<GSAPScrollFadeProps> = ({
  children,
  direction = 'up',
  distance = 50,
  className = '',
  trigger,
  start = 'top 80%',
  end = 'bottom 20%'
}) => {
  const elementRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (elementRef.current && ScrollTrigger) {
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
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: trigger || elementRef.current,
            start: start,
            end: end,
            toggleActions: "play none none reverse"
          }
        }
      )
    }
  }, [direction, distance, trigger, start, end])

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  )
}

interface GSAPScrollStaggerProps {
  children: React.ReactNode
  stagger?: number
  className?: string
  childSelector?: string
}

export const GSAPScrollStagger: React.FC<GSAPScrollStaggerProps> = ({
  children,
  stagger = 0.1,
  className = '',
  childSelector = '> *'
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (containerRef.current && ScrollTrigger) {
      const childElements = containerRef.current.children
      
      gsap.fromTo(childElements,
        { 
          opacity: 0,
          y: 30
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: stagger,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: "play none none reverse"
          }
        }
      )
    }
  }, [stagger, childSelector])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}

interface GSAPParallaxProps {
  children: React.ReactNode
  speed?: number
  className?: string
}

export const GSAPParallax: React.FC<GSAPParallaxProps> = ({
  children,
  speed = 0.5,
  className = ''
}) => {
  const elementRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (elementRef.current && ScrollTrigger) {
      gsap.to(elementRef.current, {
        yPercent: -50 * speed,
        ease: "none",
        scrollTrigger: {
          trigger: elementRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      })
    }
  }, [speed])

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  )
}

interface GSAPCountUpOnScrollProps {
  value: number
  duration?: number
  className?: string
  prefix?: string
  suffix?: string
}

export const GSAPCountUpOnScroll: React.FC<GSAPCountUpOnScrollProps> = ({
  value,
  duration = 2,
  className = '',
  prefix = '',
  suffix = ''
}) => {
  const counterRef = useRef<HTMLSpanElement>(null)
  const [displayValue, setDisplayValue] = React.useState(0)

  useGSAP(() => {
    if (counterRef.current && ScrollTrigger) {
      const obj = { value: 0 }
      
      gsap.to(obj, {
        value: value,
        duration: duration,
        ease: "power2.out",
        onUpdate: function() {
          setDisplayValue(Math.floor(obj.value))
        },
        scrollTrigger: {
          trigger: counterRef.current,
          start: 'top 80%',
          toggleActions: "play none none reverse"
        }
      })
    }
  }, [value, duration])

  return (
    <span ref={counterRef} className={className}>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  )
}
