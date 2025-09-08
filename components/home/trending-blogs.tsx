"use client"

import { useState, useEffect } from "react"
import { BlogCard } from "@/components/blog/blog-card"
import { Button } from "@/components/ui/button"
import { TrendingUp, ArrowRight } from "lucide-react"
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

export function TrendingBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrendingBlogs()
  }, [])

  const fetchTrendingBlogs = async () => {
    try {
      const response = await fetch("/api/blogs/trending")
      if (response.ok) {
        const data = await response.json()
        setBlogs(data.blogs)
      }
    } catch (error) {
      console.error("Error fetching trending blogs:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex justify-center">Loading trending blogs...</div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-black" />
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-black">
              Trending This Week
            </h2>
          </div>
          <div className="flex justify-center">
            <Link href="/blogs">
              <Button variant="outline" className="flex items-center gap-2 bg-transparent border-black text-black hover:bg-black hover:text-white">
                View All
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.slice(0, 6).map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No trending blogs yet</h3>
            <p className="text-muted-foreground">Check back soon for popular content!</p>
          </div>
        )}
      </div>
    </section>
  )
}
