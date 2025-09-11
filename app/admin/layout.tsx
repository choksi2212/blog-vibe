import type React from "react"
import { AdminNav } from "@/components/layout/admin-nav"
import { AdminGuard } from "@/components/admin/admin-guard"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <AdminNav />
        {children}
      </div>
    </AdminGuard>
  )
}
