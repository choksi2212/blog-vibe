"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { 
  FileText, 
  Eye, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Edit, 
  Trash2, 
  Plus,
  Loader2,
  TrendingUp,
  Heart,
  MessageCircle,
  Home
} from 'lucide-react'
import { 
  GSAPMetricCard, 
  GSAPStatusBadge, 
  GSAPLoadingSpinner,
  GSAPFadeIn 
} from '@/components/ui/gsap-animations'
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
  const [activeTab, setActiveTab] = useState('all')
  const { user } = useAuth()
  const { toast } = useToast()

  const totalViews = useMemo(() => blogs.reduce((sum, blog) => sum + (blog.views || 0), 0), [blogs])
  const totalLikes = useMemo(() => blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0), [blogs])
  const totalComments = useMemo(() => blogs.reduce((sum, blog) => sum + (blog.comments || 0), 0), [blogs])

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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <GSAPLoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-8">
      <Link
        href="/"
        className="absolute top-6 left-6 z-20 font-serif text-2xl font-semibold text-gradient tracking-tight transition-smooth hover:scale-105 animate-fade-in"
      >
        Devnovate
      </Link>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <GSAPFadeIn delay={0.1}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div className="mb-4 sm:mb-0">
              <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-black mb-2">My Dashboard</h1>
              <p className="text-gray-600">Manage your blog posts and track performance</p>
            </div>
            <Link href="/dashboard/create">
              <button className="bg-black text-white px-6 py-3 text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Blog Post
              </button>
            </Link>
          </div>
        </GSAPFadeIn>

        {/* Stats Cards */}
        <GSAPFadeIn delay={0.2}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <GSAPMetricCard
              title="Total Posts"
              value={stats.total}
              className="flex-1"
              delay={0.1}
            />
            <GSAPMetricCard
              title="Published"
              value={stats.published}
              trend="up"
              className="flex-1"
              delay={0.2}
            />
            <GSAPMetricCard
              title="Pending Review"
              value={stats.pending}
              trend="neutral"
              className="flex-1"
              delay={0.3}
            />
            <GSAPMetricCard
              title="Drafts"
              value={stats.drafts}
              trend="neutral"
              className="flex-1"
              delay={0.4}
            />
          </div>
        </GSAPFadeIn>

        {/* Performance Metrics */}
        <GSAPFadeIn delay={0.6}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <GSAPMetricCard
              title="Total Views"
              value={totalViews}
              trend="up"
              change={12}
              className="flex-1"
              delay={0.1}
            />
            <GSAPMetricCard
              title="Total Likes"
              value={totalLikes}
              trend="up"
              change={8}
              className="flex-1"
              delay={0.2}
            />
            <GSAPMetricCard
              title="Total Comments"
              value={totalComments}
              trend="up"
              change={15}
              className="flex-1"
              delay={0.3}
            />
          </div>
        </GSAPFadeIn>

        {/* Blog Posts Tabs */}
        <div className="bg-white border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { key: 'all', label: `All (${stats.total})`, count: stats.total },
                { key: 'published', label: `Published (${stats.published})`, count: stats.published },
                { key: 'pending', label: `Pending (${stats.pending})`, count: stats.pending },
                { key: 'draft', label: `Drafts (${stats.drafts})`, count: stats.drafts },
                { key: 'rejected', label: `Rejected (${stats.rejected})`, count: stats.rejected }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.key
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            <BlogGrid blogs={filterBlogs(activeTab === 'all' ? undefined : activeTab)} onDelete={handleDeleteBlog} />
          </div>
        </div>
      </div>
    </div>
  )
}

function BlogGrid({ blogs, onDelete }: { blogs: Blog[]; onDelete: (id: string) => void }) {
  if (blogs.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="font-serif text-xl font-medium text-gray-900 mb-2">No blog posts found</h3>
        <p className="text-gray-500 mb-6">Start writing your first blog post to see it here!</p>
        <Link href="/dashboard/create">
          <button className="bg-black text-white px-6 py-3 text-sm font-medium hover:bg-gray-800 transition-colors">
            Create Your First Post
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {blogs.map((blog) => (
        <div key={blog._id} className="bg-white border border-gray-200 hover:shadow-sm transition-shadow">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-serif text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {blog.excerpt}
                </p>
              </div>
              <GSAPStatusBadge status={blog.status} className="ml-4" delay={0.5} />
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {blog.views || 0}
                </span>
                <span className="flex items-center">
                  <Heart className="w-4 h-4 mr-1" />
                  {blog.likes || 0}
                </span>
              </div>
              <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {blog.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs"
                  >
                    {tag}
                  </span>
                ))}
                {blog.tags.length > 2 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs">
                    +{blog.tags.length - 2} more
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => (window.location.href = `/dashboard/edit/${blog._id}`)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(blog._id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
