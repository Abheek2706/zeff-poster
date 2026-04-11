"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "./AuthContext"

const PUBLIC_PATHS = ["/login", "/register"]

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const isPublicPage = PUBLIC_PATHS.some((path) => pathname.startsWith(path))

  useEffect(() => {
    if (!isLoading && !user && !isPublicPage) {
      router.replace("/login")
    }
  }, [isLoading, isPublicPage, router, user])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground text-lg">Loading...</div>
      </div>
    )
  }

  if (!user && !isPublicPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Redirecting to login...</div>
      </div>
    )
  }

  return <>{children}</>
}
