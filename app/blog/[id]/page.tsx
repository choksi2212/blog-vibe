import { BlogPost } from "@/components/blog/blog-post"
import { PublicNav } from "@/components/layout/public-nav"

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <main>
        <BlogPost blogId={id} />
      </main>
    </div>
  )
}
