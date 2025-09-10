import { SignupForm } from "@/components/auth/signup-form"

export default async function SignupPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100" />
        <div className="absolute top-20 left-10 w-64 h-64 bg-black/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-black/3 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-black/2 rounded-full blur-2xl animate-pulse-subtle" />
      </div>
      <div className="relative z-10">
        <SignupForm />
      </div>
    </div>
  )
}
