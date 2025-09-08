"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, Eye, Heart, MessageCircle } from "lucide-react"
import Link from "next/link"

interface BlogCardProps {
  blog: {
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
  showActions?: boolean
  onEdit?: () => void
  onDelete?: () => void
}

export function BlogCard({ blog, showActions, onEdit, onDelete }: BlogCardProps) {
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
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <Link
              href={`/blog/${blog._id}`}
              className="text-lg font-semibold hover:text-primary transition-colors line-clamp-2"
            >
              {blog.title}
            </Link>
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
              <User className="w-4 h-4" />
              {blog.author.displayName}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(blog.createdAt)}
            </div>
          </div>

          {blog.status === "published" && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {blog.views || 0}
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {blog.likes || 0}
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                {blog.comments || 0}
              </div>
            </div>
          )}
        </div>

        {showActions && (
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={onEdit}>
              Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={onDelete}>
              Delete
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
