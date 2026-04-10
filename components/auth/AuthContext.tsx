"use client"

import { createContext, useContext, useEffect, useState } from "react"

type User = {
    fullName: string
    username: string
    email: string
}

type AuthContextType = {
    user: User | null
    isLoading: boolean
    login: (username: string, password: string) => string | null
    register: (user: User & { password: string }) => string | null
    logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const saved = localStorage.getItem("zeff-user")
        if (saved) setUser(JSON.parse(saved))
        setIsLoading(false)
    }, [])

    const login = (username: string, password: string): string | null => {
        const usersRaw = localStorage.getItem("zeff-users")
        const users: Record<string, { fullName: string; email: string; password: string }> = usersRaw
            ? JSON.parse(usersRaw)
            : {}

        const entry = users[username.toLowerCase()]
        if (!entry) return "Account not found. Please sign up."
        if (entry.password !== password) return "Incorrect password."

        const u: User = { fullName: entry.fullName, username: username.toLowerCase(), email: entry.email }
        setUser(u)
        localStorage.setItem("zeff-user", JSON.stringify(u))
        return null
    }

    const register = (data: User & { password: string }): string | null => {
        const usersRaw = localStorage.getItem("zeff-users")
        const users: Record<string, { fullName: string; email: string; password: string }> = usersRaw
            ? JSON.parse(usersRaw)
            : {}

        if (users[data.username.toLowerCase()]) return "Username already taken."

        users[data.username.toLowerCase()] = {
            fullName: data.fullName,
            email: data.email,
            password: data.password,
        }
        localStorage.setItem("zeff-users", JSON.stringify(users))

        const u: User = { fullName: data.fullName, username: data.username.toLowerCase(), email: data.email }
        setUser(u)
        localStorage.setItem("zeff-user", JSON.stringify(u))
        return null
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem("zeff-user")
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("useAuth must be inside AuthProvider")
    return ctx
}
