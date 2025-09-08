"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Heart, MessageCircle, Eye, Calendar, User, Share2 } from "lucide-react"

interface BlogPost {
  _id: string
  title: string
  content: string
  excerpt: string
  tags: string[]
  author: {
    displayName: string
    email: string
  }
  createdAt: string
  updatedAt: string
  views: number
  likes: number
  comments: Comment[] | number
}

interface Comment {
  _id: string
  content: string
  author: {
    displayName: string
    email: string
  }
  createdAt: string
}

interface BlogPostProps {
  blogId: string
}

export function BlogPost({ blogId }: BlogPostProps) {
  const [blog, setBlog] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [submittingComment, setSubmittingComment] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchBlog()
    if (user) {
      checkIfLiked()
    }
  }, [blogId, user])

  const fetchBlog = async () => {
    try {
      const response = await fetch(`/api/blogs/${blogId}`)
      if (response.ok) {
        const data = await response.json()
        const apiBlog = data.blog as BlogPost
        // Normalize fields from seeded documents
        const normalized: BlogPost = {
          ...apiBlog,
          views: typeof apiBlog.views === "number" ? apiBlog.views : 0,
          likes: typeof apiBlog.likes === "number" ? apiBlog.likes : 0,
          comments: Array.isArray(apiBlog.comments) ? apiBlog.comments : [],
        }
        setBlog(normalized)
      }
    } catch (error) {
      console.error("Error fetching blog:", error)
    } finally {
      setLoading(false)
    }
  }

  const checkIfLiked = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/blogs/${blogId}/like`, {
        headers: {
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setLiked(data.liked)
      }
    } catch (error) {
      console.error("Error checking like status:", error)
    }
  }

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like posts",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/blogs/${blogId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setLiked(data.liked)
        setBlog((prev) =>
          prev
            ? {
                ...prev,
                likes: data.liked ? prev.likes + 1 : prev.likes - 1,
              }
            : null,
        )
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
      })
    }
  }

  const handleComment = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to comment",
        variant: "destructive",
      })
      return
    }

    if (!newComment.trim()) return

    setSubmittingComment(true)
    try {
      const response = await fetch(`/api/blogs/${blogId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
        body: JSON.stringify({ content: newComment }),
      })

      if (response.ok) {
        const data = await response.json()
        setBlog((prev) =>
          prev
            ? {
                ...prev,
                comments: [...prev.comments, data.comment],
              }
            : null,
        )
        setNewComment("")
        toast({
          title: "Success",
          description: "Comment added successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      })
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.title,
          text: blog?.excerpt,
          url: window.location.href,
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copying URL
      await navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "Blog link copied to clipboard",
      })
    }
  }

  const renderMarkdown = (text: string) => {
    return text
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-6 text-balance">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mb-4 text-balance">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-medium mb-3 text-balance">$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*)\*/gim, "<em>$1</em>")
      .replace(/```([\s\S]*?)```/gim, '<pre class="bg-muted p-4 rounded-lg overflow-x-auto my-4"><code>$1</code></pre>')
      .replace(/`([^`]*)`/gim, '<code class="bg-muted px-2 py-1 rounded text-sm">$1</code>')
      .replace(/\n\n/gim, "</p><p class='mb-4'>")
      .replace(/\n/gim, "<br>")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>
  }

  if (!blog) {
    return <div className="flex justify-center p-8">Blog post not found</div>
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-balance">{blog.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{blog.author.displayName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(blog.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>{blog.views} views</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {blog.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 pb-6 border-b">
          <Button
            variant={liked ? "default" : "outline"}
            size="sm"
            onClick={handleLike}
            className="flex items-center gap-2"
          >
            <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
            {blog.likes}
          </Button>

          <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
            <MessageCircle className="w-4 h-4" />
            {Array.isArray(blog.comments) ? blog.comments.length : 0}
          </Button>

          <Button variant="outline" size="sm" onClick={handleShare} className="flex items-center gap-2 bg-transparent">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
      </header>

      {/* Content */}
      <div
        className="prose prose-lg max-w-none mb-12 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: `<p class="mb-4">${renderMarkdown(blog.content)}</p>` }}
      />

      {/* Comments Section */}
      <section className="border-t pt-8">
        <h2 className="text-2xl font-semibold mb-6">Comments ({Array.isArray(blog.comments) ? blog.comments.length : 0})</h2>

        {/* Add Comment */}
        {user ? (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="mb-4"
              />
              <Button onClick={handleComment} disabled={submittingComment || !newComment.trim()}>
                {submittingComment ? "Posting..." : "Post Comment"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">Sign in to join the conversation</p>
              <Button asChild>
                <a href="/login">Sign In</a>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Comments List */}
        <div className="space-y-6">
          {Array.isArray(blog.comments) && blog.comments.map((comment) => (
            <Card key={comment._id}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-medium">{comment.author.displayName}</span>
                  <span className="text-sm text-muted-foreground">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="text-pretty">{comment.content}</p>
              </CardContent>
            </Card>
          ))}

          {(!Array.isArray(blog.comments) || blog.comments.length === 0) && (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No comments yet. Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      </section>
    </article>
  )
}
