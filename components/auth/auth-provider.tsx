"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  userRole: "user" | "admin" | null
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  userRole: null,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<"user" | "admin" | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)

      if (user) {
        // Fetch user role from backend
        try {
          const response = await fetch("/api/auth/user", {
            headers: {
              Authorization: `Bearer ${await user.getIdToken()}`,
            },
          })
          const userData = await response.json()
          setUserRole(userData.role || "user")
        } catch (error) {
          console.error("Error fetching user role:", error)
          setUserRole("user")
        }
      } else {
        setUserRole(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <AuthContext.Provider value={{ user: null, loading: true, userRole: null }}>{children}</AuthContext.Provider>
  }

  return <AuthContext.Provider value={{ user, loading, userRole }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
