"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth/auth-provider"
import { Loader2, Eye, Edit } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface BlogEditorProps {
  initialData?: {
    id?: string
    title: string
    content: string
    excerpt: string
    tags: string[]
  }
  onSave?: () => void
}

export function BlogEditor({ initialData, onSave }: BlogEditorProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [content, setContent] = useState(initialData?.content || "")
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "")
  const [tags, setTags] = useState(initialData?.tags?.join(", ") || "")
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (isDraft = false) => {
    if (!user) return

    setLoading(true)
    try {
      const blogData = {
        title,
        content,
        excerpt,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        status: isDraft ? "draft" : "pending",
        authorId: user.uid,
      }

      const url = initialData?.id ? `/api/blogs/${initialData.id}` : "/api/blogs"

      const method = initialData?.id ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
        body: JSON.stringify(blogData),
      })

      if (!response.ok) throw new Error("Failed to save blog")

      toast({
        title: "Success",
        description: isDraft
          ? "Blog saved as draft"
          : initialData?.id
            ? "Blog updated successfully"
            : "Blog submitted for review",
      })

      onSave?.()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save blog",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const renderMarkdown = (text: string) => {
    return text
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-3">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-medium mb-2">$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*)\*/gim, "<em>$1</em>")
      .replace(/```([\s\S]*?)```/gim, '<pre class="bg-muted p-4 rounded-md overflow-x-auto"><code>$1</code></pre>')
      .replace(/`([^`]*)`/gim, '<code class="bg-muted px-1 rounded">$1</code>')
      .replace(/\n/gim, "<br>")
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData?.id ? "Edit Blog Post" : "Create New Blog Post"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Enter blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            placeholder="Brief description of your blog post"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            placeholder="Enter tags separated by commas (e.g., javascript, react, tutorial)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Tabs defaultValue="edit" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="edit" className="flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Edit
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Preview
              </TabsTrigger>
            </TabsList>
            <TabsContent value="edit">
              <Textarea
                id="content"
                placeholder="Write your blog content here... (Markdown supported)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={15}
                className="font-mono"
              />
            </TabsContent>
            <TabsContent value="preview">
              <div
                className="min-h-[400px] p-4 border rounded-md prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSubmit(true)}
            disabled={loading || !title.trim()}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Save as Draft
          </Button>
          <Button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={loading || !title.trim() || !content.trim()}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {initialData?.id ? "Update Blog" : "Submit for Review"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
