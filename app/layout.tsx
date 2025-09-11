import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProvider } from "@/components/auth/auth-provider"
import { ClientOnly } from "@/components/ui/client-only"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Devnovate Blog",
  description: "A minimalistic blogging platform for developers",
  generator: "Manas Choksi",
  icons: {
    icon: "/favicon.png",   // normal browser favicon
    shortcut: "/favicon.png",
    apple: "/favicon.png",  // for iOS/Apple devices
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ClientOnly fallback={<div className="min-h-screen bg-background">{children}</div>}>
          <Suspense fallback={<div>Loading...</div>}>
            <AuthProvider>{children}</AuthProvider>
          </Suspense>
        </ClientOnly>
        <Analytics />
      </body>
    </html>
  )
}
