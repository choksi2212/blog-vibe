"use client"

import { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { Users, FileText, Clock, CheckCircle, XCircle, Eye, EyeOff, Trash2, TrendingUp, AlertCircle, Shield } from "lucide-react"
import { GSAPFadeIn, GSAPMetricCard, GSAPLoadingSpinner } from "@/components/ui/gsap-animations"
import { GSAPGrid } from "@/components/ui/gsap-enhanced-animations"

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
  status: "draft" | "pending" | "published" | "rejected" | "hidden"
  createdAt: string
  updatedAt: string
  views?: number
  likes?: number
  comments?: number
}

interface AdminStats {
  totalBlogs: number
  pendingBlogs: number
  publishedBlogs: number
  totalUsers: number
  totalViews: number
}

export function AdminDashboard() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [stats, setStats] = useState<AdminStats>({
    totalBlogs: 0,
    pendingBlogs: 0,
    publishedBlogs: 0,
    totalUsers: 0,
    totalViews: 0,
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending')
  const { user, userRole } = useAuth()
  const { toast } = useToast()

  const recentActivity = useMemo(() => {
    return blogs
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5)
  }, [blogs])

  useEffect(() => {
    if (user && userRole === "admin") {
      fetchAdminData()
    }
  }, [user, userRole])

  const fetchAdminData = async () => {
    if (!user) return

    try {
      const [blogsResponse, statsResponse] = await Promise.all([
        fetch("/api/admin/blogs", {
          headers: {
            Authorization: `Bearer ${await user.getIdToken()}`,
          },
        }),
        fetch("/api/admin/stats", {
          headers: {
            Authorization: `Bearer ${await user.getIdToken()}`,
          },
        }),
      ])

      if (blogsResponse.ok) {
        const blogsData = await blogsResponse.json()
        setBlogs(blogsData.blogs)
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleBlogAction = async (blogId: string, action: "approve" | "reject" | "hide" | "delete" | "unhide") => {
    if (!user) return

    const confirmMessages = {
      approve: "Are you sure you want to approve this blog?",
      reject: "Are you sure you want to reject this blog?",
      hide: "Are you sure you want to hide this blog?",
      unhide: "Are you sure you want to unhide this blog?",
      delete: "Are you sure you want to delete this blog? This action cannot be undone.",
    }

    if (!confirm(confirmMessages[action])) return

    let rejectionReason = ""
    if (action === "reject") {
      rejectionReason = prompt("Please provide a reason for rejection (optional):") || ""
    }

    try {
      let response;
      
      if (action === "delete") {
        // Use DELETE method for actual deletion
        response = await fetch(`/api/admin/blogs/${blogId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${await user.getIdToken()}`,
          },
        })
      } else {
        // Use PATCH method for status updates
        const actionToSend = action === "unhide" ? "approve" : action;
        response = await fetch(`/api/admin/blogs/${blogId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await user.getIdToken()}`,
          },
          body: JSON.stringify({
            action: actionToSend,
            reason: rejectionReason,
          }),
        })
      }

      if (!response.ok) throw new Error(`Failed to ${action} blog`)

      if (action === "delete") {
        setBlogs(blogs.filter((blog) => blog._id !== blogId))
      } else {
        setBlogs(
          blogs.map((blog) =>
            blog._id === blogId
              ? { 
                  ...blog, 
                  status: action === "approve" || action === "unhide" ? "published" : 
                          action === "reject" ? "rejected" : "hidden" 
                }
              : blog,
          ),
        )
      }

      toast({
        title: "Success",
        description: `Blog ${action}d successfully${action === "reject" && rejectionReason ? ". Author has been notified with feedback." : ""}`,
      })

      // Refresh stats
      fetchAdminData()
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} blog`,
        variant: "destructive",
      })
    }
  }

  const filterBlogs = (status?: string) => {
    if (!status) return blogs
    return blogs.filter((blog) => blog.status === status)
  }

  if (userRole !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white p-8 border border-gray-200 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="font-serif text-2xl font-semibold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access the admin dashboard.
          </p>
          <button 
            onClick={() => window.history.back()}
            className="bg-black text-white px-6 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-black">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600">Manage blog posts, users, and platform content</p>
        </div>

        {/* Stats Cards */}
        <GSAPFadeIn delay={0.2}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <GSAPMetricCard
              title="Total Blogs"
              value={stats.totalBlogs}
              delay={0.1}
            />
            <GSAPMetricCard
              title="Pending Review"
              value={stats.pendingBlogs}
              delay={0.2}
            />
            <GSAPMetricCard
              title="Published"
              value={stats.publishedBlogs}
              delay={0.3}
            />
            <GSAPMetricCard
              title="Total Users"
              value={stats.totalUsers}
              delay={0.4}
            />
            <GSAPMetricCard
              title="Total Views"
              value={stats.totalViews}
              delay={0.5}
            />
          </div>
        </GSAPFadeIn>

        {/* Recent Activity */}
        <div className="bg-white border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-serif text-xl font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((blog) => (
                  <div key={blog._id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{blog.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>by {blog.author.displayName}</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          blog.status === 'published' ? 'bg-black text-white' :
                          blog.status === 'pending' ? 'bg-gray-600 text-white' :
                          blog.status === 'rejected' ? 'bg-gray-400 text-black' :
                          'bg-white text-black border border-black'
                        }`}>
                          {blog.status}
                        </span>
                        <span>{new Date(blog.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {blog.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleBlogAction(blog._id, 'approve')}
                          className="text-black hover:text-gray-700 text-sm font-medium"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleBlogAction(blog._id, 'reject')}
                          className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No recent activity</p>
              </div>
            )}
          </div>
        </div>

        {/* Blog Management Tabs */}
        <div className="bg-white border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { key: 'pending', label: `Pending (${filterBlogs('pending').length})`, urgent: true },
                { key: 'published', label: `Published (${filterBlogs('published').length})` },
                { key: 'rejected', label: `Rejected (${filterBlogs('rejected').length})` },
                { key: 'hidden', label: `Hidden (${filterBlogs('hidden').length})` },
                { key: 'all', label: `All (${blogs.length})` }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors flex items-center gap-2 ${
                    activeTab === tab.key
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.urgent && filterBlogs('pending').length > 0 && (
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  )}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            <AdminBlogGrid
              blogs={filterBlogs(activeTab === 'all' ? undefined : activeTab)}
              onAction={handleBlogAction}
              showActions={
                activeTab === 'pending' ? ['approve', 'reject', 'delete'] :
                activeTab === 'published' ? ['hide', 'delete'] :
                activeTab === 'rejected' ? ['approve', 'delete'] :
                activeTab === 'hidden' ? ['unhide', 'delete'] :
                ['approve', 'reject', 'hide', 'delete', 'unhide']
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}

interface AdminBlogGridProps {
  blogs: Blog[]
  onAction: (blogId: string, action: "approve" | "reject" | "hide" | "delete" | "unhide") => void
  showActions: ("approve" | "reject" | "hide" | "delete" | "unhide")[]
}

function AdminBlogGrid({ blogs, onAction, showActions }: AdminBlogGridProps) {
  if (blogs.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="font-serif text-xl font-medium text-gray-900 mb-2">No blog posts found</h3>
        <p className="text-gray-500">No blogs match the current filter.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {blogs.map((blog) => (
        <AdminBlogCard key={blog._id} blog={blog} onAction={onAction} showActions={showActions} />
      ))}
    </div>
  )
}

interface AdminBlogCardProps {
  blog: Blog
  onAction: (blogId: string, action: "approve" | "reject" | "hide" | "delete" | "unhide") => void
  showActions: ("approve" | "reject" | "hide" | "delete" | "unhide")[]
}

function AdminBlogCard({ blog, onAction, showActions }: AdminBlogCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-black text-white"
      case "pending":
        return "bg-gray-600 text-white"
      case "draft":
        return "bg-white text-black border border-black"
      case "rejected":
        return "bg-gray-400 text-black"
      case "hidden":
        return "bg-gray-300 text-black"
      default:
        return "bg-white text-black border border-black"
    }
  }

  return (
    <div className="bg-white border border-gray-200 h-full flex flex-col hover:shadow-sm transition-shadow">
      <div className="p-6 pb-3">
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="flex-1">
            <h3 className="font-serif text-lg font-medium text-gray-900 mb-2 line-clamp-2">{blog.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{blog.excerpt}</p>
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(blog.status)}`}>
            {blog.status}
          </span>
        </div>
      </div>

      <div className="px-6 pb-6 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-1">
            {blog.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                {tag}
              </span>
            ))}
            {blog.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                +{blog.tags.length - 3}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {blog.author.displayName}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatDate(blog.createdAt)}
            </div>
          </div>

          {blog.status === "published" && (
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {blog.views || 0} views
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-6">
          {showActions.includes("approve") && (
            <button 
              onClick={() => onAction(blog._id, "approve")} 
              className="bg-black text-white px-3 py-2 text-xs font-medium hover:bg-gray-800 transition-colors flex items-center gap-1"
            >
              <CheckCircle className="w-3 h-3" />
              Approve
            </button>
          )}

          {showActions.includes("reject") && (
            <button
              onClick={() => onAction(blog._id, "reject")}
              className="bg-gray-600 text-white px-3 py-2 text-xs font-medium hover:bg-gray-700 transition-colors flex items-center gap-1"
            >
              <XCircle className="w-3 h-3" />
              Reject
            </button>
          )}

          {showActions.includes("hide") && (
            <button
              onClick={() => onAction(blog._id, "hide")}
              className="border border-black text-black px-3 py-2 text-xs font-medium hover:bg-gray-100 transition-colors flex items-center gap-1"
            >
              <EyeOff className="w-3 h-3" />
              Hide
            </button>
          )}

          {showActions.includes("unhide") && (
            <button
              onClick={() => onAction(blog._id, "unhide")}
              className="bg-black text-white px-3 py-2 text-xs font-medium hover:bg-gray-800 transition-colors flex items-center gap-1"
            >
              <Eye className="w-3 h-3" />
              Unhide
            </button>
          )}

          {showActions.includes("delete") && (
            <button
              onClick={() => onAction(blog._id, "delete")}
              className="bg-gray-400 text-black px-3 py-2 text-xs font-medium hover:bg-gray-500 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
