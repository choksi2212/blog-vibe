import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProvider } from "@/components/auth/auth-provider"
import { ClientOnly } from "@/components/ui/client-only"
import { AuroraWrapper } from "@/components/ui/aurora-wrapper"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Devnovate Blog",
  description: "A minimalistic blogging platform for developers",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Prevent Dark Reader and other browser extensions from causing hydration issues
              (function() {
                // Store original createElement to intercept element creation
                const originalCreateElement = document.createElement;
                document.createElement = function(tagName) {
                  const element = originalCreateElement.call(this, tagName);
                  
                  // If it's an SVG element, prevent Dark Reader from modifying it
                  if (tagName.toLowerCase() === 'svg') {
                    element.setAttribute('data-no-darkreader', 'true');
                  }
                  
                  return element;
                };
                
                // Prevent Dark Reader from modifying existing elements
                const observer = new MutationObserver(function(mutations) {
                  mutations.forEach(function(mutation) {
                    if (mutation.type === 'attributes') {
                      const target = mutation.target;
                      if (target.hasAttribute('data-darkreader-inline-stroke') || 
                          target.hasAttribute('data-darkreader-mode')) {
                        // Remove Dark Reader attributes to prevent hydration mismatch
                        target.removeAttribute('data-darkreader-inline-stroke');
                        target.removeAttribute('data-darkreader-mode');
                        target.removeAttribute('data-darkreader-scheme');
                        target.removeAttribute('data-darkreader-proxy-injected');
                        if (target.style && target.style.getPropertyValue('--darkreader-inline-stroke')) {
                          target.style.removeProperty('--darkreader-inline-stroke');
                        }
                      }
                    }
                  });
                });
                
                // Start observing when DOM is ready
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', function() {
                    observer.observe(document.body, {
                      attributes: true,
                      subtree: true,
                      attributeFilter: ['data-darkreader-inline-stroke', 'data-darkreader-mode', 'data-darkreader-scheme', 'data-darkreader-proxy-injected']
                    });
                  });
                } else {
                  observer.observe(document.body, {
                    attributes: true,
                    subtree: true,
                    attributeFilter: ['data-darkreader-inline-stroke', 'data-darkreader-mode', 'data-darkreader-scheme', 'data-darkreader-proxy-injected']
                  });
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuroraWrapper />
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
