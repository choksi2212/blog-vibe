import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, BarChart3, PieChart, Activity } from 'lucide-react'

interface LoadingSkeletonProps {
  className?: string
  variant?: 'text' | 'card' | 'avatar' | 'button'
  lines?: number
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className = '',
  variant = 'text',
  lines = 1
}) => {
  const baseClasses = 'loading-skeleton rounded'
  
  const variants = {
    text: 'h-4 w-full',
    card: 'h-48 w-full',
    avatar: 'h-12 w-12 rounded-full',
    button: 'h-10 w-24'
  }
  
  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${variants.text} ${
              index === lines - 1 ? 'w-3/4' : ''
            }`}
          />
        ))}
      </div>
    )
  }
  
  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`} />
  )
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = ''
}) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }
  
  return (
    <div className={`${sizes[size]} ${className}`}>
      <div className="animate-spin rounded-full border-2 border-gray-300 border-t-gray-900 h-full w-full" />
    </div>
  )
}

interface AnimatedCounterProps {
  value: number
  duration?: number
  className?: string
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1000,
  className = ''
}) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      setCount(Math.floor(progress * value))
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [value, duration])

  return <span className={className}>{count.toLocaleString()}</span>
}

interface ProgressBarProps {
  value: number
  max: number
  className?: string
  showLabel?: boolean
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  className = '',
  showLabel = false
}) => {
  const percentage = Math.min((value / max) * 100, 100)
  
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-1">
        {showLabel && (
          <span className="text-sm text-gray-600">
            {value} / {max}
          </span>
        )}
        <span className="text-sm text-gray-600">{Math.round(percentage)}%</span>
      </div>
      <div className="w-full bg-gray-200 h-2 overflow-hidden">
        <div
          className="bg-gray-900 h-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: number
  change?: number
  trend?: 'up' | 'down' | 'neutral'
  className?: string
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  trend = 'neutral',
  className = ''
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-400" />
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600'
      case 'down':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className={`bg-white p-6 border border-gray-200 hover:shadow-sm transition-shadow ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-center space-x-2 mt-2">
            <AnimatedCounter 
              value={value} 
              className="text-2xl font-bold text-gray-900" 
            />
            {change !== undefined && (
              <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
                {getTrendIcon()}
                <span className="text-sm font-medium">
                  {change > 0 ? '+' : ''}{change}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface ChartDataPoint {
  label: string
  value: number
  color?: string
}

interface MiniBarChartProps {
  data: ChartDataPoint[]
  className?: string
  height?: number
}

export const MiniBarChart: React.FC<MiniBarChartProps> = ({
  data,
  className = '',
  height = 100
}) => {
  const maxValue = Math.max(...data.map(d => d.value))
  
  return (
    <div className={`flex items-end space-x-1 ${className}`} style={{ height }}>
      {data.map((point, index) => (
        <div key={index} className="flex-1 flex flex-col items-center">
          <div
            className={`w-full transition-all duration-500 ease-out ${
              point.color || 'bg-gray-900'
            }`}
            style={{
              height: `${(point.value / maxValue) * (height - 20)}px`,
              minHeight: '2px'
            }}
          />
          <span className="text-xs text-gray-600 mt-1 truncate">
            {point.label}
          </span>
        </div>
      ))}
    </div>
  )
}

interface ActivityFeedProps {
  activities: Array<{
    id: string
    type: 'create' | 'update' | 'delete' | 'approve' | 'reject'
    title: string
    timestamp: Date
    user?: string
  }>
  className?: string
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  className = ''
}) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'create':
        return <div className="w-2 h-2 bg-green-500 rounded-full" />
      case 'update':
        return <div className="w-2 h-2 bg-blue-500 rounded-full" />
      case 'delete':
        return <div className="w-2 h-2 bg-red-500 rounded-full" />
      case 'approve':
        return <div className="w-2 h-2 bg-green-500 rounded-full" />
      case 'reject':
        return <div className="w-2 h-2 bg-red-500 rounded-full" />
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full" />
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1">
            {getActivityIcon(activity.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900 truncate">
              {activity.title}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              {activity.user && (
                <span className="text-xs text-gray-500">{activity.user}</span>
              )}
              <span className="text-xs text-gray-400">
                {formatTimeAgo(activity.timestamp)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

interface StatusBadgeProps {
  status: 'published' | 'draft' | 'pending' | 'rejected' | 'hidden'
  className?: string
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = ''
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'hidden':
        return 'bg-gray-100 text-gray-600 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium border ${getStatusStyles()} ${className}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}
