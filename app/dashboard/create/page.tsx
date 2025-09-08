"use client"

import { BlogEditor } from "@/components/blog/blog-editor"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function CreateBlogPage() {
  const handleSave = () => {
    window.location.href = "/dashboard"
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      <BlogEditor onSave={handleSave} />
    </div>
  )
}
