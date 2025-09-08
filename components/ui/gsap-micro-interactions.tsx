"use client"

import React, { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

interface GSAPButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const GSAPButton: React.FC<GSAPButtonProps> = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
  size = 'md'
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null)

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-black text-white hover:bg-gray-800'
      case 'secondary':
        return 'bg-gray-100 text-gray-900 hover:bg-gray-200'
      case 'ghost':
        return 'bg-transparent text-gray-900 hover:bg-gray-100'
      default:
        return 'bg-black text-white hover:bg-gray-800'
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm'
      case 'md':
        return 'px-4 py-2 text-sm'
      case 'lg':
        return 'px-6 py-3 text-base'
      default:
        return 'px-4 py-2 text-sm'
    }
  }

  const handleMouseEnter = () => {
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 1.05,
        duration: 0.2,
        ease: "power2.out"
      })
    }
  }

  const handleMouseLeave = () => {
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out"
      })
    }
  }

  const handleMouseDown = () => {
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.95,
        duration: 0.1,
        ease: "power2.out"
      })
    }
  }

  const handleMouseUp = () => {
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 1.05,
        duration: 0.1,
        ease: "power2.out"
      })
    }
  }

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className={`font-medium transition-colors ${getVariantStyles()} ${getSizeStyles()} ${className}`}
    >
      {children}
    </button>
  )
}

interface GSAPInputProps {
  type?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
}

export const GSAPInput: React.FC<GSAPInputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  className = ''
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)

  const handleFocus = () => {
    if (inputRef.current && labelRef.current) {
      gsap.to(inputRef.current, {
        borderColor: '#000',
        duration: 0.2,
        ease: "power2.out"
      })
      
      if (placeholder) {
        gsap.to(labelRef.current, {
          y: -20,
          scale: 0.8,
          color: '#000',
          duration: 0.2,
          ease: "power2.out"
        })
      }
    }
  }

  const handleBlur = () => {
    if (inputRef.current && labelRef.current) {
      gsap.to(inputRef.current, {
        borderColor: '#e5e7eb',
        duration: 0.2,
        ease: "power2.out"
      })
      
      if (placeholder && !value) {
        gsap.to(labelRef.current, {
          y: 0,
          scale: 1,
          color: '#6b7280',
          duration: 0.2,
          ease: "power2.out"
        })
      }
    }
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`w-full px-3 py-2 border border-gray-300 focus:outline-none transition-colors ${className}`}
      />
      {placeholder && (
        <div
          ref={labelRef}
          className="absolute left-3 top-2 text-gray-500 pointer-events-none"
        >
          {placeholder}
        </div>
      )}
    </div>
  )
}

interface GSAPCardProps {
  children: React.ReactNode
  className?: string
  hoverEffect?: boolean
}

export const GSAPCard: React.FC<GSAPCardProps> = ({
  children,
  className = '',
  hoverEffect = true
}) => {
  const cardRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0,
          duration: 0.6,
          ease: "power2.out"
        }
      )
    }
  }, [])

  const handleHover = () => {
    if (hoverEffect && cardRef.current) {
      gsap.to(cardRef.current, {
        y: -5,
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        duration: 0.3,
        ease: "power2.out"
      })
    }
  }

  const handleHoverOut = () => {
    if (hoverEffect && cardRef.current) {
      gsap.to(cardRef.current, {
        y: 0,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        duration: 0.3,
        ease: "power2.out"
      })
    }
  }

  return (
    <div
      ref={cardRef}
      className={`bg-white border border-gray-200 ${className}`}
      onMouseEnter={handleHover}
      onMouseLeave={handleHoverOut}
    >
      {children}
    </div>
  )
}

interface GSAPIconButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export const GSAPIconButton: React.FC<GSAPIconButtonProps> = ({
  children,
  onClick,
  className = '',
  size = 'md'
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null)

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'p-1'
      case 'md':
        return 'p-2'
      case 'lg':
        return 'p-3'
      default:
        return 'p-2'
    }
  }

  const handleClick = () => {
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        rotation: 360,
        duration: 0.6,
        ease: "back.out(1.7)"
      })
    }
    onClick?.()
  }

  const handleHover = () => {
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 1.1,
        duration: 0.2,
        ease: "power2.out"
      })
    }
  }

  const handleHoverOut = () => {
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out"
      })
    }
  }

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      onMouseEnter={handleHover}
      onMouseLeave={handleHoverOut}
      className={`text-gray-400 hover:text-gray-600 transition-colors ${getSizeStyles()} ${className}`}
    >
      {children}
    </button>
  )
}

interface GSAPTextAnimationProps {
  text: string
  className?: string
  delay?: number
}

export const GSAPTextAnimation: React.FC<GSAPTextAnimationProps> = ({
  text,
  className = '',
  delay = 0
}) => {
  const textRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (textRef.current) {
      const chars = text.split('')
      textRef.current.innerHTML = chars
        .map(char => `<span style="display: inline-block;">${char === ' ' ? '&nbsp;' : char}</span>`)
        .join('')

      const spans = textRef.current.querySelectorAll('span')
      
      gsap.fromTo(spans,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: delay,
          stagger: 0.05,
          ease: "power2.out"
        }
      )
    }
  }, [text, delay])

  return <div ref={textRef} className={className} />
}
