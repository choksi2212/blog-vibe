import { PublicNav } from "@/components/layout/public-nav"
import { HeroSection } from "@/components/home/hero-section"
import { TrendingBlogs } from "@/components/home/trending-blogs"
import { LatestBlogs } from "@/components/home/latest-blogs"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <main>
        <HeroSection />
        <TrendingBlogs />
        <LatestBlogs />
      </main>

      {/* Footer */}
      <footer className="border-t py-12 px-4 bg-muted/20">
        <div className="container mx-auto text-center">
          <h3 className="text-xl font-bold text-primary mb-2">Devnovate</h3>
          <p className="text-muted-foreground mb-4">Empowering developers to share knowledge and grow together</p>
          <p className="text-sm text-muted-foreground">
            © 2024 Devnovate. Built with passion for the developer community.
          </p>
        </div>
      </footer>
    </div>
  )
}
