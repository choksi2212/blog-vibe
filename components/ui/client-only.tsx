"use client"

import { useEffect, useState } from "react"

interface ClientOnlyProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    // Add a small delay to ensure browser extensions have finished modifying the DOM
    const timer = setTimeout(() => {
      setHasMounted(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  if (!hasMounted) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
