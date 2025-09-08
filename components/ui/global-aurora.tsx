"use client"

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

// Dynamically import Aurora with no SSR
const Aurora = dynamic(() => import('./aurora'), {
  ssr: false,
  loading: () => null
})

export function GlobalAurora() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Only render on client and after mount
  if (!isClient) {
    return null
  }

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none opacity-20">
      <Aurora
        colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
        blend={0.5}
        amplitude={1.0}
        speed={0.5}
      />
    </div>
  )
}
