import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { AdminNav } from "@/components/layout/admin-nav"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <AdminDashboard />
    </div>
  )
}
