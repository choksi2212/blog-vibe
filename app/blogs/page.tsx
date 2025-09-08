"use client"

import { useState, useEffect } from "react"
import { PublicNav } from "@/components/layout/public-nav"
import { BlogCard } from "@/components/blog/blog-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter } from "lucide-react"

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

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState("")
  const [allTags, setAllTags] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    fetchBlogs()
    fetchTags()
  }, [page, searchQuery, selectedTag])

  const fetchBlogs = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
      })

      if (searchQuery) params.append("search", searchQuery)
      if (selectedTag) params.append("tag", selectedTag)

      const response = await fetch(`/api/blogs?${params}`)
      if (response.ok) {
        const data = await response.json()

        if (page === 1) {
          setBlogs(data.blogs)
        } else {
          setBlogs((prev) => [...prev, ...data.blogs])
        }

        setHasMore(data.pagination.page < data.pagination.pages)
      }
    } catch (error) {
      console.error("Error fetching blogs:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTags = async () => {
    try {
      const response = await fetch("/api/blogs/tags")
      if (response.ok) {
        const data = await response.json()
        setAllTags(data.tags)
      }
    } catch (error) {
      console.error("Error fetching tags:", error)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setPage(1)
    setBlogs([])
  }

  const handleTagFilter = (tag: string) => {
    setSelectedTag(tag === selectedTag ? "" : tag)
    setPage(1)
    setBlogs([])
  }

  const loadMore = () => {
    setPage((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">All Blog Posts</h1>
          <p className="text-muted-foreground">Discover insights and tutorials from our developer community</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search blogs..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {/* Tags Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filter by tag:</span>
            {allTags.slice(0, 10).map((tag) => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() => handleTagFilter(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        {loading && page === 1 ? (
          <div className="flex justify-center py-12">Loading blogs...</div>
        ) : blogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
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
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No blogs found</h3>
            <p className="text-muted-foreground">
              {searchQuery || selectedTag ? "Try adjusting your search or filters" : "No blogs have been published yet"}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
