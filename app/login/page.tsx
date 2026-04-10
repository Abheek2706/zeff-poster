"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/components/auth/AuthContext"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

export default function LoginPage() {
    const { login } = useAuth()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!username.trim() || !password) {
            setError("Please fill in all fields.")
            return
        }

        setLoading(true)
        const err = login(username, password)
        if (err) {
            setError(err)
            setLoading(false)
        } else {
            window.location.href = "/"
        }
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

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1.5">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder="johndoe123"
                                className="w-full border border-input rounded px-3 py-2.5 text-sm bg-background"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1.5">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
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
