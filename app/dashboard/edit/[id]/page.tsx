"use client"

import { useState, useEffect } from "react"
import { BlogEditor } from "@/components/blog/blog-editor"
import { useAuth } from "@/components/auth/auth-provider"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface Blog {
  _id: string
  title: string
  content: string
  excerpt: string
  tags: string[]
}

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const [blogId, setBlogId] = useState<string>("")
  const { user } = useAuth()

  useEffect(() => {
    const loadParams = async () => {
      const { id } = await params;
      setBlogId(id);
    };
    loadParams();
  }, [params]);

  useEffect(() => {
    if (user && blogId) {
      fetchBlog()
    }
  }, [user, blogId])

  const fetchBlog = async () => {
    if (!user || !blogId) return

    try {
      const response = await fetch(`/api/blogs/${blogId}`, {
        headers: {
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setBlog(data.blog)
      }
    } catch (error) {
      console.error("Error fetching blog:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>
  }

  if (!blog) {
    return <div className="flex justify-center p-8">Blog not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      <BlogEditor
        initialData={{
          id: blog._id,
          title: blog.title,
          content: blog.content,
          excerpt: blog.excerpt,
          tags: blog.tags,
        }}
        onSave={() => (window.location.href = "/dashboard")}
      />
    </div>
  )
}
