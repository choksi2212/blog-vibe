"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, X, Search, Filter } from "lucide-react"
import { format } from "date-fns"

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void
  initialFilters?: SearchFilters
}

export interface SearchFilters {
  query: string
  tags: string[]
  author: string
  dateFrom?: Date
  dateTo?: Date
  sortBy: "createdAt" | "popularity" | "views" | "likes"
  sortOrder: "desc" | "asc"
}

export function AdvancedSearch({ onSearch, initialFilters }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: initialFilters?.query || "",
    tags: initialFilters?.tags || [],
    author: initialFilters?.author || "",
    dateFrom: initialFilters?.dateFrom,
    dateTo: initialFilters?.dateTo,
    sortBy: initialFilters?.sortBy || "createdAt",
    sortOrder: initialFilters?.sortOrder || "desc",
  })

  const [tagInput, setTagInput] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)

  const handleAddTag = (tag: string) => {
    if (tag.trim() && !filters.tags.includes(tag.trim())) {
      setFilters((prev) => ({
        ...prev,
        tags: [...prev.tags, tag.trim()],
      }))
    }
    setTagInput("")
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleSearch = () => {
    onSearch(filters)
  }

  const handleReset = () => {
    const resetFilters: SearchFilters = {
      query: "",
      tags: [],
      author: "",
      dateFrom: undefined,
      dateTo: undefined,
      sortBy: "createdAt",
      sortOrder: "desc",
    }
    setFilters(resetFilters)
    onSearch(resetFilters)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          Advanced Search
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="ml-auto">
            <Filter className="w-4 h-4" />
            {isExpanded ? "Simple" : "Advanced"}
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Main search query */}
        <div className="space-y-2">
          <Label htmlFor="search-query">Search Query</Label>
          <Input
            id="search-query"
            placeholder="Search blogs, titles, content..."
            value={filters.query}
            onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        {isExpanded && (
          <>
            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  placeholder="Add tags..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddTag(tagInput)
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleAddTag(tagInput)}
                  disabled={!tagInput.trim()}
                >
                  Add
                </Button>
              </div>

              {filters.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {filters.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Author */}
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                placeholder="Search by author name..."
                value={filters.author}
                onChange={(e) => setFilters((prev) => ({ ...prev, author: e.target.value }))}
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>From Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateFrom ? format(filters.dateFrom, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.dateFrom}
                      onSelect={(date) => setFilters((prev) => ({ ...prev, dateFrom: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>To Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateTo ? format(filters.dateTo, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.dateTo}
                      onSelect={(date) => setFilters((prev) => ({ ...prev, dateTo: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Sort Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sort By</Label>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value: any) => setFilters((prev) => ({ ...prev, sortBy: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Date Created</SelectItem>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="views">Views</SelectItem>
                    <SelectItem value="likes">Likes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Sort Order</Label>
                <Select
                  value={filters.sortOrder}
                  onValueChange={(value: any) => setFilters((prev) => ({ ...prev, sortOrder: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Descending</SelectItem>
                    <SelectItem value="asc">Ascending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button onClick={handleSearch} className="flex-1">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
