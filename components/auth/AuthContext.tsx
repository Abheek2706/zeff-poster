"use client"

import { createContext, useContext, useEffect, useState } from "react"

export type User = {
  id: string
  fullName: string
  username: string
  email: string
  avatarUrl: string | null
  provider: "credentials" | "google" | "hybrid"
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (identifier: string, password: string) => Promise<string | null>
  register: (user: {
    fullName: string
    username: string
    email: string
    password: string
  }) => Promise<string | null>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") || ""
  if (!contentType.includes("application/json")) {
    throw new Error("Unexpected server response.")
  }

  return response.json() as Promise<T>
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshSession = async () => {
    try {
      const response = await fetch("/api/auth/session", {
        method: "GET",
        cache: "no-store",
      })
      const data = await parseResponse<{ user: User | null }>(response)
      setUser(data.user)
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void refreshSession()
  }, [])

  const login = async (identifier: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier, password }),
      })

      const data = await parseResponse<{ user?: User; error?: string }>(response)
      if (!response.ok || !data.user) {
        return data.error || "Unable to sign in."
      }

      setUser(data.user)
      return null
    } catch {
      return "Unable to sign in right now. Please try again."
    }
  }

  const register = async (data: {
    fullName: string
    username: string
    email: string
    password: string
  }) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const payload = await parseResponse<{ user?: User; error?: string }>(response)
      if (!response.ok || !payload.user) {
        return payload.error || "Unable to create your account."
      }

      setUser(payload.user)
      return null
    } catch {
      return "Unable to create your account right now. Please try again."
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })
    } finally {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be inside AuthProvider")
  return ctx
}
