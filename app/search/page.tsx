"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { PublicNav } from "@/components/layout/public-nav"
import { BlogCard } from "@/components/blog/blog-card"
import { AdvancedSearch, type SearchFilters } from "@/components/search/advanced-search"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, TrendingUp } from "lucide-react"

interface Blog {
  _id: string
  title: string
  excerpt: string
  content: string
  tags: string[]
  author: {
    displayName: string
    email: string
  }
  status: "published"
  createdAt: string
  updatedAt: string
  views: number
  likes: number
  comments: number
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [totalResults, setTotalResults] = useState(0)
  const [popularTags, setPopularTags] = useState<string[]>([])
  const [trendingBlogs, setTrendingBlogs] = useState<Blog[]>([])

  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get("q") || "",
    tags: searchParams.get("tags")?.split(",").filter(Boolean) || [],
    author: searchParams.get("author") || "",
    sortBy: (searchParams.get("sortBy") as any) || "createdAt",
    sortOrder: (searchParams.get("sortOrder") as any) || "desc",
  })

  useEffect(() => {
    fetchPopularTags()
    fetchTrendingBlogs()
  }, [])

  useEffect(() => {
    handleSearch(filters, true)
  }, [])

  const fetchPopularTags = async () => {
    try {
      const response = await fetch("/api/blogs/tags")
      if (response.ok) {
        const data = await response.json()
        setPopularTags(data.tags.slice(0, 10))
      }
    } catch (error) {
      console.error("Error fetching popular tags:", error)
    }
  }

  const fetchTrendingBlogs = async () => {
    try {
      const response = await fetch("/api/trending?limit=5")
      if (response.ok) {
        const data = await response.json()
        setTrendingBlogs(data.blogs)
      }
    } catch (error) {
      console.error("Error fetching trending blogs:", error)
    }
  }

  const handleSearch = async (newFilters: SearchFilters, reset = false) => {
    setLoading(true)
    const currentPage = reset ? 1 : page

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
      })

      if (newFilters.query) params.append("search", newFilters.query)
      if (newFilters.tags.length > 0) {
        newFilters.tags.forEach((tag) => params.append("tag", tag))
      }
      if (newFilters.author) params.append("author", newFilters.author)
      if (newFilters.dateFrom) params.append("dateFrom", newFilters.dateFrom.toISOString())
      if (newFilters.dateTo) params.append("dateTo", newFilters.dateTo.toISOString())
      params.append("sortBy", newFilters.sortBy)
      params.append("sortOrder", newFilters.sortOrder)

      const response = await fetch(`/api/blogs?${params}`)
      if (response.ok) {
        const data = await response.json()

        if (reset) {
          setBlogs(data.blogs)
          setPage(1)
        } else {
          setBlogs((prev) => [...prev, ...data.blogs])
        }

        setTotalResults(data.pagination.total)
        setHasMore(data.pagination.page < data.pagination.pages)
        setFilters(newFilters)
      }
    } catch (error) {
      console.error("Error searching blogs:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    setPage((prev) => prev + 1)
    handleSearch(filters, false)
  }

  const handleTagClick = (tag: string) => {
    const newFilters = {
      ...filters,
      tags: filters.tags.includes(tag) ? filters.tags.filter((t) => t !== tag) : [...filters.tags, tag],
    }
    handleSearch(newFilters, true)
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4">Search Results</h1>
              {totalResults > 0 && (
                <p className="text-muted-foreground">
                  Found {totalResults} result{totalResults !== 1 ? "s" : ""}
                  {filters.query && ` for "${filters.query}"`}
                </p>
              )}
            </div>

            {/* Advanced Search */}
            <AdvancedSearch onSearch={(newFilters) => handleSearch(newFilters, true)} initialFilters={filters} />

            {/* Active Filters */}
            {(filters.query || filters.tags.length > 0 || filters.author) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Active Filters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {filters.query && <Badge variant="default">Query: {filters.query}</Badge>}
                    {filters.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => handleTagClick(tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                    {filters.author && <Badge variant="outline">Author: {filters.author}</Badge>}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Search Results */}
            {loading && page === 1 ? (
              <div className="flex justify-center py-12">
                <Search className="w-8 h-8 animate-spin" />
              </div>
            ) : blogs.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {blogs.map((blog) => (
                    <BlogCard key={blog._id} blog={blog} />
                  ))}
                </div>

                {hasMore && (
                  <div className="text-center">
                    <Button onClick={loadMore} disabled={loading}>
                      {loading ? "Loading..." : "Load More"}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No results found</h3>
                  <p className="text-muted-foreground">Try adjusting your search terms or filters</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Popular Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Popular Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={filters.tags.includes(tag) ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => handleTagClick(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trending Blogs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Trending Now
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trendingBlogs.map((blog) => (
                    <div key={blog._id} className="border-b pb-4 last:border-b-0">
                      <h4 className="font-medium line-clamp-2 mb-2">
                        <a href={`/blog/${blog._id}`} className="hover:text-primary">
                          {blog.title}
                        </a>
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{blog.author.displayName}</span>
                        <span>•</span>
                        <span>{blog.likes} likes</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
