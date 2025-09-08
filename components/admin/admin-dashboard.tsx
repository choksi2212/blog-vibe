"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Users, FileText, Clock, CheckCircle, XCircle, Eye, EyeOff, Trash2, TrendingUp } from "lucide-react"

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
  const { user, userRole } = useAuth()
  const { toast } = useToast()

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

  const handleBlogAction = async (blogId: string, action: "approve" | "reject" | "hide" | "delete") => {
    if (!user) return

    const confirmMessages = {
      approve: "Are you sure you want to approve this blog?",
      reject: "Are you sure you want to reject this blog?",
      hide: "Are you sure you want to hide this blog?",
      delete: "Are you sure you want to delete this blog? This action cannot be undone.",
    }

    if (!confirm(confirmMessages[action])) return

    let rejectionReason = ""
    if (action === "reject") {
      rejectionReason = prompt("Please provide a reason for rejection (optional):") || ""
    }

    try {
      const response = await fetch(`/api/admin/blogs/${blogId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
        body: JSON.stringify({
          action,
          reason: rejectionReason,
        }),
      })

      if (!response.ok) throw new Error(`Failed to ${action} blog`)

      if (action === "delete") {
        setBlogs(blogs.filter((blog) => blog._id !== blogId))
      } else {
        setBlogs(
          blogs.map((blog) =>
            blog._id === blogId
              ? { ...blog, status: action === "approve" ? "published" : action === "reject" ? "rejected" : "hidden" }
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
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              You don't have permission to access the admin dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading admin dashboard...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage blog posts and platform content</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBlogs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingBlogs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.publishedBlogs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews}</div>
          </CardContent>
        </Card>
      </div>

      {/* Blog Management Tabs */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="pending">Pending ({filterBlogs("pending").length})</TabsTrigger>
          <TabsTrigger value="published">Published ({filterBlogs("published").length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({filterBlogs("rejected").length})</TabsTrigger>
          <TabsTrigger value="hidden">Hidden ({filterBlogs("hidden").length})</TabsTrigger>
          <TabsTrigger value="all">All ({blogs.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <AdminBlogGrid
            blogs={filterBlogs("pending")}
            onAction={handleBlogAction}
            showActions={["approve", "reject", "delete"]}
          />
        </TabsContent>

        <TabsContent value="published" className="mt-6">
          <AdminBlogGrid
            blogs={filterBlogs("published")}
            onAction={handleBlogAction}
            showActions={["hide", "delete"]}
          />
        </TabsContent>

        <TabsContent value="rejected" className="mt-6">
          <AdminBlogGrid
            blogs={filterBlogs("rejected")}
            onAction={handleBlogAction}
            showActions={["approve", "delete"]}
          />
        </TabsContent>

        <TabsContent value="hidden" className="mt-6">
          <AdminBlogGrid
            blogs={filterBlogs("hidden")}
            onAction={handleBlogAction}
            showActions={["approve", "delete"]}
          />
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          <AdminBlogGrid
            blogs={blogs}
            onAction={handleBlogAction}
            showActions={["approve", "reject", "hide", "delete"]}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface AdminBlogGridProps {
  blogs: Blog[]
  onAction: (blogId: string, action: "approve" | "reject" | "hide" | "delete") => void
  showActions: ("approve" | "reject" | "hide" | "delete")[]
}

function AdminBlogGrid({ blogs, onAction, showActions }: AdminBlogGridProps) {
  if (blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No blog posts found</h3>
        <p className="text-muted-foreground">No blogs match the current filter.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map((blog) => (
        <AdminBlogCard key={blog._id} blog={blog} onAction={onAction} showActions={showActions} />
      ))}
    </div>
  )
}

interface AdminBlogCardProps {
  blog: Blog
  onAction: (blogId: string, action: "approve" | "reject" | "hide" | "delete") => void
  showActions: ("approve" | "reject" | "hide" | "delete")[]
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
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "hidden":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="text-lg font-semibold line-clamp-2">{blog.title}</h3>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{blog.excerpt}</p>
          </div>
          <Badge className={getStatusColor(blog.status)}>{blog.status}</Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1">
            {blog.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {blog.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{blog.tags.length - 3}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {blog.views || 0}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {showActions.includes("approve") && (
            <Button size="sm" onClick={() => onAction(blog._id, "approve")} className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Approve
            </Button>
          )}

          {showActions.includes("reject") && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onAction(blog._id, "reject")}
              className="flex items-center gap-1"
            >
              <XCircle className="w-3 h-3" />
              Reject
            </Button>
          )}

          {showActions.includes("hide") && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAction(blog._id, "hide")}
              className="flex items-center gap-1"
            >
              <EyeOff className="w-3 h-3" />
              Hide
            </Button>
          )}

          {showActions.includes("delete") && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onAction(blog._id, "delete")}
              className="flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
