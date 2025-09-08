"use client"

import React, { useEffect, useState } from 'react'

interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  memoryUsage?: number
  networkRequests: number
}

export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    networkRequests: 0
  })

  useEffect(() => {
    // Measure page load time
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (navigation) {
      const loadTime = navigation.loadEventEnd - navigation.fetchStart
      setMetrics(prev => ({ ...prev, loadTime }))
    }

    // Measure render time
    const paintEntries = performance.getEntriesByType('paint')
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint')
    if (fcp) {
      setMetrics(prev => ({ ...prev, renderTime: fcp.startTime }))
    }

    // Count network requests
    const resourceEntries = performance.getEntriesByType('resource')
    setMetrics(prev => ({ ...prev, networkRequests: resourceEntries.length }))

    // Memory usage (if available)
    if ('memory' in performance) {
      const memory = (performance as any).memory
      setMetrics(prev => ({ 
        ...prev, 
        memoryUsage: memory.usedJSHeapSize / 1024 / 1024 // MB
      }))
    }
  }, [])

  return metrics
}

interface PerformanceIndicatorProps {
  show?: boolean
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

export const PerformanceIndicator: React.FC<PerformanceIndicatorProps> = ({
  show = process.env.NODE_ENV === 'development',
  position = 'bottom-right'
}) => {
  const metrics = usePerformanceMonitor()

  if (!show) return null

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  }

  const getLoadTimeColor = (time: number) => {
    if (time < 1000) return 'text-green-600'
    if (time < 3000) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className={`fixed ${positionClasses[position]} z-50 bg-black/80 text-white p-3 rounded text-xs font-mono`}>
      <div className="space-y-1">
        <div className={`flex justify-between ${getLoadTimeColor(metrics.loadTime)}`}>
          <span>Load:</span>
          <span>{Math.round(metrics.loadTime)}ms</span>
        </div>
        <div className="flex justify-between">
          <span>FCP:</span>
          <span>{Math.round(metrics.renderTime)}ms</span>
        </div>
        <div className="flex justify-between">
          <span>Requests:</span>
          <span>{metrics.networkRequests}</span>
        </div>
        {metrics.memoryUsage && (
          <div className="flex justify-between">
            <span>Memory:</span>
            <span>{metrics.memoryUsage.toFixed(1)}MB</span>
          </div>
        )}
      </div>
    </div>
  )
}

// Hook for measuring component render performance
export const useRenderPerformance = (componentName: string) => {
  useEffect(() => {
    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      const renderTime = endTime - startTime
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`)
      }
    }
  })
}

// HOC for performance monitoring
export const withPerformanceMonitoring = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
) => {
  const PerformanceMonitoredComponent: React.FC<P> = (props) => {
    useRenderPerformance(componentName)
    return <WrappedComponent {...props} />
  }
  
  PerformanceMonitoredComponent.displayName = `withPerformanceMonitoring(${componentName})`
  return PerformanceMonitoredComponent
}
