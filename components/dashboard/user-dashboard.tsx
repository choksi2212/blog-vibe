"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { BlogCard } from "@/components/blog/blog-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Plus, FileText, Clock, CheckCircle, XCircle } from "lucide-react"
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
  status: "draft" | "pending" | "published" | "rejected"
  createdAt: string
  updatedAt: string
  views?: number
  likes?: number
  comments?: number
}

export function UserDashboard() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      fetchUserBlogs()
    }
  }, [user])

  const fetchUserBlogs = async () => {
    if (!user) return

    try {
      const response = await fetch("/api/blogs/user", {
        headers: {
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
      })

      if (!response.ok) throw new Error("Failed to fetch blogs")

      const data = await response.json()
      setBlogs(data.blogs)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load your blogs",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBlog = async (blogId: string) => {
    if (!user || !confirm("Are you sure you want to delete this blog?")) return

    try {
      const response = await fetch(`/api/blogs/${blogId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
      })

      if (!response.ok) throw new Error("Failed to delete blog")

      setBlogs(blogs.filter((blog) => blog._id !== blogId))
      toast({
        title: "Success",
        description: "Blog deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete blog",
        variant: "destructive",
      })
    }
  }

  const getStats = () => {
    return {
      total: blogs.length,
      published: blogs.filter((b) => b.status === "published").length,
      pending: blogs.filter((b) => b.status === "pending").length,
      drafts: blogs.filter((b) => b.status === "draft").length,
      rejected: blogs.filter((b) => b.status === "rejected").length,
    }
  }

  const filterBlogs = (status?: string) => {
    if (!status) return blogs
    return blogs.filter((blog) => blog.status === status)
  }

  const stats = getStats()

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-muted-foreground">Manage your blog posts</p>
        </div>
        <Link href="/dashboard/create">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Blog Post
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.published}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <XCircle className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.drafts}</div>
          </CardContent>
        </Card>
      </div>

      {/* Blog Posts Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
          <TabsTrigger value="published">Published ({stats.published})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
          <TabsTrigger value="draft">Drafts ({stats.drafts})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({stats.rejected})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <BlogGrid blogs={filterBlogs()} onDelete={handleDeleteBlog} />
        </TabsContent>

        <TabsContent value="published" className="mt-6">
          <BlogGrid blogs={filterBlogs("published")} onDelete={handleDeleteBlog} />
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          <BlogGrid blogs={filterBlogs("pending")} onDelete={handleDeleteBlog} />
        </TabsContent>

        <TabsContent value="draft" className="mt-6">
          <BlogGrid blogs={filterBlogs("draft")} onDelete={handleDeleteBlog} />
        </TabsContent>

        <TabsContent value="rejected" className="mt-6">
          <BlogGrid blogs={filterBlogs("rejected")} onDelete={handleDeleteBlog} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function BlogGrid({ blogs, onDelete }: { blogs: Blog[]; onDelete: (id: string) => void }) {
  if (blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No blog posts found</h3>
        <p className="text-muted-foreground">Start writing your first blog post!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map((blog) => (
        <BlogCard
          key={blog._id}
          blog={blog}
          showActions
          onEdit={() => (window.location.href = `/dashboard/edit/${blog._id}`)}
          onDelete={() => onDelete(blog._id)}
        />
      ))}
    </div>
  )
}
