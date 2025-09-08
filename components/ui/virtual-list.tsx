import React, { useState, useEffect, useMemo, useRef } from 'react'

interface VirtualListProps<T> {
  items: T[]
  itemHeight: number
  containerHeight: number
  renderItem: (item: T, index: number) => React.ReactNode
  overscan?: number
  className?: string
}

export function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  className = ''
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)
  const scrollElementRef = useRef<HTMLDivElement>(null)

  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    )
    return { startIndex, endIndex }
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan])

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1)
  }, [items, visibleRange])

  const totalHeight = items.length * itemHeight
  const offsetY = visibleRange.startIndex * itemHeight

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }

  return (
    <div
      ref={scrollElementRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) =>
            renderItem(item, visibleRange.startIndex + index)
          )}
        </div>
      </div>
    </div>
  )
}

// Hook for infinite scrolling
export const useInfiniteScroll = <T,>(
  fetchMore: () => Promise<T[]>,
  hasMore: boolean,
  threshold = 100
) => {
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<T[]>([])

  const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    
    if (
      scrollHeight - scrollTop <= clientHeight + threshold &&
      hasMore &&
      !loading
    ) {
      setLoading(true)
      try {
        const newItems = await fetchMore()
        setItems(prev => [...prev, ...newItems])
      } catch (error) {
        console.error('Failed to fetch more items:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  return { items, setItems, loading, handleScroll }
}

// Optimized grid component for blog cards
interface VirtualGridProps<T> {
  items: T[]
  itemHeight: number
  itemWidth: number
  containerWidth: number
  containerHeight: number
  renderItem: (item: T, index: number) => React.ReactNode
  gap?: number
  className?: string
}

export function VirtualGrid<T>({
  items,
  itemHeight,
  itemWidth,
  containerWidth,
  containerHeight,
  renderItem,
  gap = 16,
  className = ''
}: VirtualGridProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)
  
  const columnsCount = Math.floor((containerWidth + gap) / (itemWidth + gap))
  const rowsCount = Math.ceil(items.length / columnsCount)
  
  const visibleRange = useMemo(() => {
    const startRow = Math.max(0, Math.floor(scrollTop / (itemHeight + gap)) - 2)
    const endRow = Math.min(
      rowsCount - 1,
      Math.ceil((scrollTop + containerHeight) / (itemHeight + gap)) + 2
    )
    return { startRow, endRow }
  }, [scrollTop, itemHeight, gap, containerHeight, rowsCount])

  const visibleItems = useMemo(() => {
    const startIndex = visibleRange.startRow * columnsCount
    const endIndex = Math.min(items.length - 1, (visibleRange.endRow + 1) * columnsCount - 1)
    return items.slice(startIndex, endIndex + 1).map((item, index) => ({
      item,
      index: startIndex + index,
      row: Math.floor((startIndex + index) / columnsCount),
      col: (startIndex + index) % columnsCount
    }))
  }, [items, visibleRange, columnsCount])

  const totalHeight = rowsCount * (itemHeight + gap) - gap
  const offsetY = visibleRange.startRow * (itemHeight + gap)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }

  return (
    <div
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map(({ item, index, row, col }) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                top: (row - visibleRange.startRow) * (itemHeight + gap),
                left: col * (itemWidth + gap),
                width: itemWidth,
                height: itemHeight
              }}
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
