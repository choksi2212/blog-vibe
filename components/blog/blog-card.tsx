"use client"

import React, { useRef } from 'react'
import { Calendar, User, Eye, Heart, MessageCircle } from 'lucide-react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { GSAPStatusBadge, GSAPFadeIn } from '@/components/ui/gsap-animations'
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
  const cardRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "2-digit",
    })
  }

  useGSAP(() => {
    if (cardRef.current && contentRef.current) {
      // Initial state
      gsap.set(cardRef.current, { 
        opacity: 0, 
        y: 30,
        scale: 0.98
      })
      
      gsap.set(contentRef.current.children, { 
        opacity: 0, 
        y: 20 
      })

      // Animate card entrance
      gsap.to(cardRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "power2.out"
      })

      // Animate content with stagger
      gsap.to(contentRef.current.children, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        delay: 0.2,
        stagger: 0.08,
        ease: "power2.out"
      })
    }
  }, [])

  const handleHover = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: -8,
        scale: 1.02,
        duration: 0.4,
        ease: "power2.out"
      })
    }
  }

  const handleHoverOut = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: 0,
        scale: 1,
        duration: 0.4,
        ease: "power2.out"
      })
    }
  }

  return (
    <article 
      ref={cardRef}
      className="group bg-white border border-gray-100 cursor-pointer w-full"
      onMouseEnter={handleHover}
      onMouseLeave={handleHoverOut}
    >
      <div ref={contentRef} className="p-6 lg:p-8">
        {/* Status Badge */}
        {blog.status !== "published" && (
          <div className="mb-4">
            <GSAPStatusBadge status={blog.status} delay={0.3} />
          </div>
        )}

        {/* Title */}
        <h3 className="mb-4">
          <Link
            href={`/blog/${blog._id}`}
            className="font-serif text-xl lg:text-2xl font-semibold text-gray-900 leading-tight group-hover:opacity-70 transition-opacity"
          >
            {blog.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
          {blog.excerpt}
        </p>

        {/* Tags */}
        {blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {blog.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="inline-block px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                {tag}
              </span>
            ))}
            {blog.tags.length > 4 && (
              <span className="inline-block px-3 py-1 text-xs font-medium text-gray-500 bg-gray-50">
                +{blog.tags.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-500 gap-4">
          <div className="flex items-center space-x-4 min-w-0 flex-1">
            <div className="flex items-center space-x-1 min-w-0">
              <User className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{blog.author.displayName}</span>
            </div>
            <div className="flex items-center space-x-1 flex-shrink-0">
              <Calendar className="w-4 h-4" />
              <span className="whitespace-nowrap">{formatDate(blog.createdAt)}</span>
            </div>
          </div>

          {/* Engagement Stats */}
          {blog.status === "published" && (
            <div className="flex items-center space-x-3 flex-shrink-0">
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{blog.views || 0}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>{blog.likes || 0}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span>{blog.comments || 0}</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex space-x-3 mt-6 pt-6 border-t border-gray-100">
            <button
              onClick={onEdit}
              className="px-4 py-2 text-sm font-medium text-gray-900 border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </article>
  )
}
