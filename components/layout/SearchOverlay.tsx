"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"

type Poster = {
  slug: string
  name: string
  price: number
  category: string
  image: string
}

export default function SearchOverlay({
  posters,
  onClose,
}: {
  posters: Poster[]
  onClose: () => void
}) {
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  const filtered = query.trim()
    ? posters.filter(
        p =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      )
    : []

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-background w-full max-w-2xl mx-auto mt-20 rounded-xl shadow-2xl overflow-hidden animate-slide-down"
        onClick={e => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b">
          <svg className="w-5 h-5 text-muted-foreground shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search items..."
            className="flex-1 bg-transparent outline-none text-lg"
          />
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-sm">
            ESC
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {query.trim() && filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No items found for "{query}"</p>
          )}

          {filtered.map(poster => (
            <Link
              key={poster.slug}
              href={`/posters/${poster.slug}`}
              onClick={onClose}
              className="flex items-center gap-4 px-5 py-3 hover:bg-muted/50 transition-colors"
            >
              <div className="relative w-12 h-16 rounded overflow-hidden shrink-0 bg-muted">
                <Image src={poster.image} alt={poster.name} fill className="object-cover" sizes="48px" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{poster.name}</p>
                <p className="text-sm text-muted-foreground">{poster.category}</p>
              </div>
              <p className="font-bold shrink-0">₹{poster.price}</p>
            </Link>
          ))}
        </div>

        {!query.trim() && (
          <div className="px-5 py-8 text-center text-muted-foreground">
            <p className="text-sm">Start typing to search items...</p>
          </div>
        )}
      </div>
    </div>
  )
}
