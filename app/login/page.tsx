"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/components/auth/AuthContext"
import GoogleAuthButton from "@/components/auth/GoogleAuthButton"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

const ERROR_MESSAGES: Record<string, string> = {
  google_access_denied: "Google sign-in was canceled before completion.",
  google_callback_failed: "Google sign-in failed. Please try again.",
  google_not_configured: "Google sign-in is not configured yet.",
  google_state_mismatch: "Google sign-in expired. Please try again.",
}

export default function LoginPage() {
  const { login } = useAuth()
  const searchParams = useSearchParams()
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const errorCode = searchParams.get("error")
    if (errorCode && ERROR_MESSAGES[errorCode]) {
      setError(ERROR_MESSAGES[errorCode])
    }
  }, [searchParams])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")

    if (!identifier.trim() || !password) {
      setError("Please fill in all fields.")
      return
    }

    setLoading(true)
    const err = await login(identifier, password)

    if (err) {
      setError(err)
      setLoading(false)
      return
    }

    window.location.href = "/"
  }

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col">
            <Navbar />

            {/* LOGIN FORM */}
            <section className="flex items-center justify-center py-20 px-4">
                <Card className="w-full max-w-md p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-serif font-bold">Welcome Back</h2>
                        <p className="text-muted-foreground mt-1">Sign in to continue</p>
                    </div>

                    <div className="space-y-4 mb-4">
                        <GoogleAuthButton nextPath="/">Continue with Google</GoogleAuthButton>

                        <div className="relative text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            <span className="bg-white px-3 relative z-10">or</span>
                            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-border" />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1.5">Username or Email</label>
                            <input
                                type="text"
                                value={identifier}
                                onChange={(event) => setIdentifier(event.target.value)}
                                placeholder="johndoe123"
                                className="w-full border border-input rounded px-3 py-2.5 text-sm bg-background"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1.5">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="••••••••"
                                className="w-full border border-input rounded px-3 py-2.5 text-sm bg-background"
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm mb-4 p-3 bg-red-50 rounded border border-red-200">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>

                    <div className="text-center mt-6 text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="text-foreground font-semibold underline">
                            Sign Up
                        </Link>
                    </div>
                </Card>
            </section>
            
            <Footer />
        </div>
    )
}
