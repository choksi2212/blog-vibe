"use client"

import { useState, useEffect } from "react"
import { BlogCard } from "@/components/blog/blog-card"
import { Button } from "@/components/ui/button"
import { Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

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

export function LatestBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLatestBlogs()
  }, [])

  const fetchLatestBlogs = async () => {
    try {
      const response = await fetch("/api/blogs?limit=6")
      if (response.ok) {
        const data = await response.json()
        setBlogs(data.blogs)
      }
    } catch (error) {
      console.error("Error fetching latest blogs:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-16 px-4 bg-muted/10">
        <div className="container mx-auto">
          <div className="flex justify-center items-center space-x-2">
            <div className="animate-pulse-subtle">Loading latest blogs...</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4 bg-muted/10">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-foreground animate-float" />
            <h2 className="text-3xl font-bold text-foreground text-gradient">Latest Posts</h2>
          </div>
          <Link href="/blogs">
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-transparent border-border text-foreground hover:bg-primary hover:text-primary-foreground transition-smooth hover-lift rounded-lg group"
            >
              View All
              <ArrowRight className="w-4 h-4 transition-smooth group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <div key={blog._id} className="animate-slide-up hover-lift" style={{ animationDelay: `${index * 0.1}s` }}>
                <BlogCard blog={blog} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 animate-fade-in">
            <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-subtle">
              <Clock className="w-8 h-8 text-accent-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2 text-foreground">No blogs published yet</h3>
            <p className="text-muted-foreground">Be the first to share your knowledge!</p>
          </div>
        )}
      </div>
    </section>
  )
}
