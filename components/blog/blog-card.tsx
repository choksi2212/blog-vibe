"use client"

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
      month: "short",
      day: "numeric",
      year: "2-digit",
    })
  }

  // Removed GSAP animations to prevent visual artifacts

  // Removed GSAP hover animations to prevent visual artifacts

  return (
    <article className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 cursor-pointer w-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 rounded-xl overflow-hidden">
      <div className="p-6 lg:p-8">
        {blog.status !== "published" && (
          <div className="mb-4">
            <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
              {blog.status.toUpperCase()}
            </span>
          </div>
        )}

        <h3 className="mb-4">
          <Link
            href={`/blog/${blog._id}`}
            className="font-serif text-xl lg:text-2xl font-semibold text-gradient leading-tight transition-smooth hover:scale-105 inline-block text-pretty"
          >
            {blog.title}
          </Link>
        </h3>

        <p className="text-muted-foreground leading-relaxed mb-6 line-clamp-3 text-pretty">{blog.excerpt}</p>

        {blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {blog.tags.slice(0, 4).map((tag, index) => (
              <span
                key={tag}
                className="inline-block px-3 py-1 text-xs font-medium text-foreground bg-accent hover:bg-primary hover:text-primary-foreground transition-smooth rounded-full animate-fade-in hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {tag}
              </span>
            ))}
            {blog.tags.length > 4 && (
              <span className="inline-block px-3 py-1 text-xs font-medium text-muted-foreground bg-muted rounded-full animate-pulse-subtle">
                +{blog.tags.length - 4} more
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-muted-foreground gap-4">
          <div className="flex items-center space-x-4 min-w-0 flex-1">
            <div className="flex items-center space-x-1 min-w-0 group/author">
              <User className="w-4 h-4 flex-shrink-0 transition-smooth group-hover/author:rotate-12" />
              <span className="truncate transition-smooth group-hover/author:text-foreground">
                {blog.author.displayName}
              </span>
            </div>
            <div className="flex items-center space-x-1 flex-shrink-0 group/date">
              <Calendar className="w-4 h-4 transition-smooth group-hover/date:rotate-12" />
              <span className="whitespace-nowrap transition-smooth group-hover/date:text-foreground">
                {formatDate(blog.createdAt)}
              </span>
            </div>
          </div>

          {blog.status === "published" && (
            <div className="flex items-center space-x-3 flex-shrink-0">
              <div className="flex items-center space-x-1 group/stat transition-smooth hover:text-foreground">
                <Eye className="w-4 h-4 transition-smooth group-hover/stat:scale-110" />
                <span>{blog.views || 0}</span>
              </div>
              <div className="flex items-center space-x-1 group/stat transition-smooth hover:text-red-500">
                <Heart className="w-4 h-4 transition-smooth group-hover/stat:scale-110" />
                <span>{blog.likes || 0}</span>
              </div>
              <div className="flex items-center space-x-1 group/stat transition-smooth hover:text-foreground">
                <MessageCircle className="w-4 h-4 transition-smooth group-hover/stat:scale-110" />
                <span>{blog.comments || 0}</span>
              </div>
            </div>
          )}
        </div>

        {showActions && (
          <div className="flex space-x-3 mt-6 pt-6 border-t border-border animate-slide-up">
            <button
              onClick={onEdit}
              className="px-4 py-2 text-sm font-medium text-foreground border border-border hover:bg-accent hover:text-accent-foreground transition-smooth rounded-lg hover-lift"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="px-4 py-2 text-sm font-medium text-destructive-foreground bg-destructive hover:bg-destructive/90 transition-smooth rounded-lg hover-lift"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </article>
  )
}
