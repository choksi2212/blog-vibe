import type React from "react"
import { AdminNav } from "@/components/layout/admin-nav"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      {children}
    </div>
  )
}
