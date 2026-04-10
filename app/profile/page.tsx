"use client"

import Link from "next/link"
import { useAuth } from "@/components/auth/AuthContext"
import { Button } from "@/components/ui/button"

export default function ProfilePage() {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="text-3xl font-bold text-zinc-900 mb-8">My Account</h1>

        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
          {/* Avatar header */}
          <div className="bg-gradient-to-r from-zinc-900 to-zinc-700 p-8 text-white text-center">
            <div className="w-20 h-20 rounded-full bg-white/20 mx-auto flex items-center justify-center text-3xl font-bold mb-3">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold">{user.fullName}</h2>
            <p className="text-zinc-300 text-sm">@{user.username}</p>
          </div>

          {/* Info */}
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-zinc-100">
              <span className="text-sm text-zinc-500">Full Name</span>
              <span className="font-medium">{user.fullName}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-zinc-100">
              <span className="text-sm text-zinc-500">Username</span>
              <span className="font-medium">@{user.username}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-zinc-100">
              <span className="text-sm text-zinc-500">Email</span>
              <span className="font-medium">{user.email}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-zinc-100 flex flex-col sm:flex-row gap-3">
            <Link href="/wishlist" className="flex-1">
              <Button variant="outline" className="w-full">
                ❤️ My Wishlist
              </Button>
            </Link>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => {
                logout()
                window.location.href = "/login"
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
