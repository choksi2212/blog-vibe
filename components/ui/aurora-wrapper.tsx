"use client"

import dynamic from 'next/dynamic'

// Dynamically import Silk with no SSR to prevent hydration issues
const SilkBackground = dynamic(() => import('./silk-background').then(mod => ({ default: mod.SilkBackground })), {
  ssr: false,
  loading: () => null
})

export function AuroraWrapper() {
  return <SilkBackground />
}
