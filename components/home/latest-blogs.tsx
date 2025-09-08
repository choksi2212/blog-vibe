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
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="flex justify-center">Loading latest blogs...</div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4 bg-muted/20">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold">Latest Posts</h2>
          </div>
          <Link href="/blogs">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No blogs published yet</h3>
            <p className="text-muted-foreground">Be the first to share your knowledge!</p>
          </div>
        )}
      </div>
    </section>
  )
}
