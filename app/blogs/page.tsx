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
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4 text-gradient animate-float">All Blog Posts</h1>
          <p className="text-muted-foreground text-pretty">
            Discover insights and tutorials from our developer community
          </p>
        </div>

        <div className="mb-8 space-y-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 transition-smooth" />
            <Input
              placeholder="Search blogs..."
              className="pl-10 bg-background/50 backdrop-blur-sm border-border focus:border-primary transition-smooth rounded-lg"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap animate-slide-in-left" style={{ animationDelay: "0.3s" }}>
            <Filter className="w-4 h-4 text-muted-foreground animate-float" />
            <span className="text-sm text-muted-foreground">Filter by tag:</span>
            {allTags.slice(0, 10).map((tag, index) => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? "default" : "secondary"}
                className="cursor-pointer transition-smooth hover:scale-105 hover-lift animate-scale-in"
                style={{ animationDelay: `${0.4 + index * 0.05}s` }}
                onClick={() => handleTagFilter(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {loading && page === 1 ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse-subtle text-muted-foreground">Loading blogs...</div>
          </div>
        ) : blogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {blogs.map((blog, index) => (
                <div key={blog._id} className="animate-slide-up" style={{ animationDelay: `${0.5 + index * 0.1}s` }}>
                  <BlogCard blog={blog} />
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="text-center animate-fade-in" style={{ animationDelay: "1s" }}>
                <Button onClick={loadMore} disabled={loading} className="transition-smooth hover-lift">
                  {loading ? "Loading..." : "Load More"}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-subtle">
              <Search className="w-8 h-8 text-accent-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2 text-foreground">No blogs found</h3>
            <p className="text-muted-foreground text-pretty">
              {searchQuery || selectedTag ? "Try adjusting your search or filters" : "No blogs have been published yet"}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
