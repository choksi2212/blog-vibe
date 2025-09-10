"use client"

import { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { Users, FileText, Clock, CheckCircle, XCircle, Eye, EyeOff, Trash2, AlertCircle, Shield } from "lucide-react"
import { GSAPFadeIn, GSAPMetricCard } from "@/components/ui/gsap-animations"

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
  const [activeTab, setActiveTab] = useState("pending")
  const { user, userRole } = useAuth()
  const { toast } = useToast()

  const recentActivity = useMemo(() => {
    return blogs.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5)
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
      let response

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
        const actionToSend = action === "unhide" ? "approve" : action
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
                  status:
                    action === "approve" || action === "unhide"
                      ? "published"
                      : action === "reject"
                        ? "rejected"
                        : "hidden",
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
      <div className="min-h-screen bg-background flex items-center justify-center px-6 animate-fade-in">
        <div className="glass-effect border-border max-w-md w-full text-center p-8 rounded-xl hover-lift animate-scale-in">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-subtle">
            <Shield className="w-8 h-8 text-destructive animate-float" />
          </div>
          <h1 className="font-serif text-2xl font-semibold text-foreground mb-2 text-gradient">Access Denied</h1>
          <p className="text-muted-foreground mb-6 text-pretty">
            You don't have permission to access the admin dashboard.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-primary text-primary-foreground px-6 py-3 text-sm font-medium transition-smooth hover-lift rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center animate-fade-in">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground animate-pulse-subtle">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center animate-float">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-gradient">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground text-pretty">Manage blog posts, users, and platform content</p>
        </div>

        <GSAPFadeIn delay={0.2}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <GSAPMetricCard title="Total Blogs" value={stats.totalBlogs} delay={0.1} />
            <GSAPMetricCard title="Pending Review" value={stats.pendingBlogs} delay={0.2} />
            <GSAPMetricCard title="Published" value={stats.publishedBlogs} delay={0.3} />
            <GSAPMetricCard title="Total Users" value={stats.totalUsers} delay={0.4} />
            <GSAPMetricCard title="Total Views" value={stats.totalViews} delay={0.5} />
          </div>
        </GSAPFadeIn>

        <div
          className="glass-effect border-border mb-8 rounded-xl overflow-hidden animate-slide-in-left"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-serif text-xl font-semibold text-foreground">Recent Activity</h2>
          </div>
          <div className="p-6">
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((blog, index) => (
                  <div
                    key={blog._id}
                    className="flex items-center justify-between py-3 border-b border-border last:border-0 transition-smooth hover:bg-accent/50 rounded-lg px-2 animate-slide-in-right"
                    style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground mb-1 text-pretty">{blog.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>by {blog.author.displayName}</span>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full transition-smooth hover:scale-105 ${
                            blog.status === "published"
                              ? "bg-primary text-primary-foreground"
                              : blog.status === "pending"
                                ? "bg-secondary text-secondary-foreground"
                                : blog.status === "rejected"
                                  ? "bg-muted text-muted-foreground"
                                  : "bg-accent text-accent-foreground"
                          }`}
                        >
                          {blog.status}
                        </span>
                        <span>{new Date(blog.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {blog.status === "pending" && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleBlogAction(blog._id, "approve")}
                          className="text-primary hover:text-primary/80 text-sm font-medium transition-smooth hover:scale-105"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleBlogAction(blog._id, "reject")}
                          className="text-muted-foreground hover:text-foreground text-sm font-medium transition-smooth hover:scale-105"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 animate-fade-in">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-subtle">
                  <AlertCircle className="w-8 h-8 text-accent-foreground" />
                </div>
                <p className="text-muted-foreground">No recent activity</p>
              </div>
            )}
          </div>
        </div>

        <div
          className="glass-effect border-border rounded-xl overflow-hidden animate-slide-in-right"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="border-b border-border">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { key: "pending", label: `Pending (${filterBlogs("pending").length})`, urgent: true },
                { key: "published", label: `Published (${filterBlogs("published").length})` },
                { key: "rejected", label: `Rejected (${filterBlogs("rejected").length})` },
                { key: "hidden", label: `Hidden (${filterBlogs("hidden").length})` },
                { key: "all", label: `All (${blogs.length})` },
              ].map((tab, index) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-smooth flex items-center gap-2 hover:scale-105 animate-fade-in ${
                    activeTab === tab.key
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                  style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                >
                  {tab.urgent && filterBlogs("pending").length > 0 && (
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse-subtle"></div>
                  )}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            <AdminBlogGrid
              blogs={filterBlogs(activeTab === "all" ? undefined : activeTab)}
              onAction={handleBlogAction}
              showActions={
                activeTab === "pending"
                  ? ["approve", "reject", "delete"]
                  : activeTab === "published"
                    ? ["hide", "delete"]
                    : activeTab === "rejected"
                      ? ["approve", "delete"]
                      : activeTab === "hidden"
                        ? ["unhide", "delete"]
                        : ["approve", "reject", "hide", "delete", "unhide"]
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
      <div className="text-center py-16 animate-fade-in">
        <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-subtle">
          <FileText className="w-8 h-8 text-accent-foreground" />
        </div>
        <h3 className="font-serif text-xl font-medium text-foreground mb-2">No blog posts found</h3>
        <p className="text-muted-foreground">No blogs match the current filter.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {blogs.map((blog, index) => (
        <div key={blog._id} className="animate-slide-up" style={{ animationDelay: `${0.6 + index * 0.1}s` }}>
          <AdminBlogCard blog={blog} onAction={onAction} showActions={showActions} />
        </div>
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
        return "bg-primary text-primary-foreground"
      case "pending":
        return "bg-secondary text-secondary-foreground"
      case "draft":
        return "bg-accent text-accent-foreground border border-border"
      case "rejected":
        return "bg-muted text-muted-foreground"
      case "hidden":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-accent text-accent-foreground border border-border"
    }
  }

  return (
    <div className="glass-effect border-border h-full flex flex-col transition-smooth hover-lift rounded-xl overflow-hidden animate-glow">
      <div className="p-6 pb-3">
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="flex-1">
            <h3 className="font-serif text-lg font-medium text-foreground mb-2 line-clamp-2 text-pretty">
              {blog.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 text-pretty">{blog.excerpt}</p>
          </div>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full transition-smooth hover:scale-105 ${getStatusColor(blog.status)}`}
          >
            {blog.status}
          </span>
        </div>
      </div>

      <div className="px-6 pb-6 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-1">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <span
                key={tag}
                className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded-full transition-smooth hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {tag}
              </span>
            ))}
            {blog.tags.length > 3 && (
              <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full animate-pulse-subtle">
                +{blog.tags.length - 3}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1 group transition-smooth hover:text-foreground">
              <Users className="w-4 h-4 transition-smooth group-hover:rotate-12" />
              {blog.author.displayName}
            </div>
            <div className="flex items-center gap-1 group transition-smooth hover:text-foreground">
              <Clock className="w-4 h-4 transition-smooth group-hover:rotate-12" />
              {formatDate(blog.createdAt)}
            </div>
          </div>

          {blog.status === "published" && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1 group transition-smooth hover:text-foreground">
                <Eye className="w-4 h-4 transition-smooth group-hover:scale-110" />
                {blog.views || 0} views
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-6">
          {showActions.includes("approve") && (
            <button
              onClick={() => onAction(blog._id, "approve")}
              className="bg-primary text-primary-foreground px-3 py-2 text-xs font-medium transition-smooth hover-lift rounded-lg flex items-center gap-1 group"
            >
              <CheckCircle className="w-3 h-3 transition-smooth group-hover:rotate-12" />
              Approve
            </button>
          )}

          {showActions.includes("reject") && (
            <button
              onClick={() => onAction(blog._id, "reject")}
              className="bg-secondary text-secondary-foreground px-3 py-2 text-xs font-medium transition-smooth hover-lift rounded-lg flex items-center gap-1 group"
            >
              <XCircle className="w-3 h-3 transition-smooth group-hover:rotate-12" />
              Reject
            </button>
          )}

          {showActions.includes("hide") && (
            <button
              onClick={() => onAction(blog._id, "hide")}
              className="border border-border text-foreground px-3 py-2 text-xs font-medium transition-smooth hover:bg-accent hover:text-accent-foreground hover-lift rounded-lg flex items-center gap-1 group"
            >
              <EyeOff className="w-3 h-3 transition-smooth group-hover:scale-110" />
              Hide
            </button>
          )}

          {showActions.includes("unhide") && (
            <button
              onClick={() => onAction(blog._id, "unhide")}
              className="bg-primary text-primary-foreground px-3 py-2 text-xs font-medium transition-smooth hover-lift rounded-lg flex items-center gap-1 group"
            >
              <Eye className="w-3 h-3 transition-smooth group-hover:scale-110" />
              Unhide
            </button>
          )}

          {showActions.includes("delete") && (
            <button
              onClick={() => onAction(blog._id, "delete")}
              className="bg-destructive text-destructive-foreground px-3 py-2 text-xs font-medium transition-smooth hover-lift rounded-lg flex items-center gap-1 group"
            >
              <Trash2 className="w-3 h-3 transition-smooth group-hover:rotate-12" />
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
