"use client"

import { createContext, useContext, useEffect, useState } from "react"

type WishlistContextType = {
  wishlist: string[] // array of poster slugs
  addToWishlist: (slug: string) => void
  removeFromWishlist: (slug: string) => void
  toggleWishlist: (slug: string) => void
  isInWishlist: (slug: string) => boolean
}

const WishlistContext = createContext<WishlistContextType | null>(null)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("zeff-wishlist")
    if (saved) setWishlist(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem("zeff-wishlist", JSON.stringify(wishlist))
  }, [wishlist])

  const addToWishlist = (slug: string) => {
    setWishlist(prev => (prev.includes(slug) ? prev : [...prev, slug]))
  }

  const removeFromWishlist = (slug: string) => {
    setWishlist(prev => prev.filter(s => s !== slug))
  }

  const toggleWishlist = (slug: string) => {
    setWishlist(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    )
  }

  const isInWishlist = (slug: string) => wishlist.includes(slug)

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error("useWishlist must be inside WishlistProvider")
  return ctx
}
