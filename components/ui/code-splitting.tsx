import React, { Suspense, lazy } from 'react'
import { LoadingSkeleton, LoadingSpinner } from './react-bits'

// Lazy load heavy components
export const LazyBlogEditor = lazy(() => 
  import('../blog/blog-editor').then(module => ({ default: module.BlogEditor }))
)

export const LazyAdminDashboard = lazy(() => 
  import('../admin/admin-dashboard').then(module => ({ default: module.AdminDashboard }))
)

export const LazyUserDashboard = lazy(() => 
  import('../dashboard/user-dashboard').then(module => ({ default: module.UserDashboard }))
)

// HOC for lazy loading with custom fallback
interface LazyWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  error?: React.ReactNode
}

export const LazyWrapper: React.FC<LazyWrapperProps> = ({
  children,
  fallback = <LoadingSpinner size="lg" className="mx-auto my-8" />,
  error = <div className="text-center py-8 text-red-600">Failed to load component</div>
}) => {
  return (
    <Suspense fallback={fallback}>
      <ErrorBoundary fallback={error}>
        {children}
      </ErrorBoundary>
    </Suspense>
  )
}

// Error boundary for lazy loaded components
interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy loading error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }

    return this.props.children
  }
}

// Preloader for critical components
export const preloadComponent = (componentImport: () => Promise<any>) => {
  const componentPromise = componentImport()
  return () => componentPromise
}

// Preload critical components on user interaction
export const usePreloadOnHover = (preloadFn: () => Promise<any>) => {
  const handleMouseEnter = () => {
    preloadFn()
  }

  return { onMouseEnter: handleMouseEnter }
}

// Dynamic import with retry logic
export const dynamicImportWithRetry = (
  importFn: () => Promise<any>,
  retries = 3,
  delay = 1000
): Promise<any> => {
  return new Promise((resolve, reject) => {
    importFn()
      .then(resolve)
      .catch((error) => {
        if (retries > 0) {
          setTimeout(() => {
            dynamicImportWithRetry(importFn, retries - 1, delay * 2)
              .then(resolve)
              .catch(reject)
          }, delay)
        } else {
          reject(error)
        }
      })
  })
}

// Component for progressive enhancement
interface ProgressiveEnhancementProps {
  children: React.ReactNode
  fallback: React.ReactNode
  condition?: boolean
}

export const ProgressiveEnhancement: React.FC<ProgressiveEnhancementProps> = ({
  children,
  fallback,
  condition = true
}) => {
  const [isClient, setIsClient] = React.useState(false)

  React.useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient || !condition) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
