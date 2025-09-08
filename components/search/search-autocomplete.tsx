"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Hash, User, FileText } from "lucide-react"
import { ClientOnly } from "@/components/ui/client-only"

interface SearchSuggestion {
  type: "title" | "tag" | "author"
  text: string
  id?: string
  count?: number
}

interface SearchAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onSelect?: (suggestion: SearchSuggestion) => void
  placeholder?: string
  className?: string
}

export function SearchAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = "Search blogs...",
  className,
}: SearchAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<{
    titles: SearchSuggestion[]
    tags: SearchSuggestion[]
    authors: SearchSuggestion[]
  }>({
    titles: [],
    tags: [],
    authors: [],
  })
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (value.length < 2) {
        setSuggestions({ titles: [], tags: [], authors: [] })
        setShowSuggestions(false)
        return
      }

      setLoading(true)
      try {
        const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(value)}&limit=3`)
        if (response.ok) {
          const data = await response.json()
          setSuggestions(data.suggestions)
          setShowSuggestions(true)
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error)
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onChange(suggestion.text)
    setShowSuggestions(false)
    onSelect?.(suggestion)
  }

  const allSuggestions = [...suggestions.titles, ...suggestions.tags, ...suggestions.authors]

  const getIcon = (type: string) => {
    switch (type) {
      case "title":
        return <FileText className="w-4 h-4" />
      case "tag":
        return <Hash className="w-4 h-4" />
      case "author":
        return <User className="w-4 h-4" />
      default:
        return <Search className="w-4 h-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "title":
        return "Blog"
      case "tag":
        return "Tag"
      case "author":
        return "Author"
      default:
        return ""
    }
  }

  return (
    <div className="relative">
      <div className="relative">
        <ClientOnly fallback={<div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        </ClientOnly>
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`pl-10 ${className}`}
          onFocus={() => value.length >= 2 && setShowSuggestions(true)}
        />
      </div>

      {showSuggestions && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-80 overflow-y-auto" ref={suggestionsRef}>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-4 text-center text-muted-foreground">
                <ClientOnly fallback={<div className="w-4 h-4 mx-auto mb-2" />}>
                  <Search className="w-4 h-4 animate-spin mx-auto mb-2" />
                </ClientOnly>
                Searching...
              </div>
            ) : allSuggestions.length > 0 ? (
              <div className="py-2">
                {suggestions.titles.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b">
                      Blog Posts
                    </div>
                    {suggestions.titles.map((suggestion, index) => (
                      <div
                        key={`title-${index}`}
                        className="px-4 py-2 hover:bg-muted cursor-pointer flex items-center gap-3"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <ClientOnly fallback={<div className="w-4 h-4" />}>
                          {getIcon(suggestion.type)}
                        </ClientOnly>
                        <span className="flex-1 truncate">{suggestion.text}</span>
                        <Badge variant="secondary" className="text-xs">
                          {getTypeLabel(suggestion.type)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}

                {suggestions.tags.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b">
                      Tags
                    </div>
                    {suggestions.tags.map((suggestion, index) => (
                      <div
                        key={`tag-${index}`}
                        className="px-4 py-2 hover:bg-muted cursor-pointer flex items-center gap-3"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <ClientOnly fallback={<div className="w-4 h-4" />}>
                          {getIcon(suggestion.type)}
                        </ClientOnly>
                        <span className="flex-1">{suggestion.text}</span>
                        {suggestion.count && (
                          <Badge variant="secondary" className="text-xs">
                            {suggestion.count} posts
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {suggestions.authors.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b">
                      Authors
                    </div>
                    {suggestions.authors.map((suggestion, index) => (
                      <div
                        key={`author-${index}`}
                        className="px-4 py-2 hover:bg-muted cursor-pointer flex items-center gap-3"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <ClientOnly fallback={<div className="w-4 h-4" />}>
                          {getIcon(suggestion.type)}
                        </ClientOnly>
                        <span className="flex-1">{suggestion.text}</span>
                        <Badge variant="secondary" className="text-xs">
                          {getTypeLabel(suggestion.type)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground">No suggestions found</div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
