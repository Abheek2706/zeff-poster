"use client"

import { useAuth } from "./AuthContext"
import { usePathname } from "next/navigation"

const PUBLIC_PATHS = ["/login", "/register"]

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth()
    const pathname = usePathname()

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground text-lg">Loading...</div>
            </div>
        )
    }

    const isPublicPage = PUBLIC_PATHS.some(p => pathname.startsWith(p))

    if (!user && !isPublicPage) {
        // Redirect to login
        if (typeof window !== "undefined") {
            window.location.href = "/login"
        }
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-muted-foreground">Redirecting to login...</div>
            </div>
        )
    }

    return <>{children}</>
}
