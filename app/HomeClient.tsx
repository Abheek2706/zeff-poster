"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useCart } from "@/components/cart/CartContext"
import CartButton from "@/components/cart/CartButton"
import CartDrawer from "@/components/cart/CartDrawer"

const ITEMS_PER_LOAD = 12
const NEW_DAYS = 7
const POPULAR_THRESHOLD = 80

export default function HomeClient({ posters }: { posters: any[] }) {
  const { addToCart } = useCart()
  const [showCart, setShowCart] = useState(false)

  /* ---------------- Popularity Tracking ---------------- */
  const [popularityMap, setPopularityMap] = useState<Record<string, number>>({})

  useEffect(() => {
    const stored = localStorage.getItem("zcu-popularity")
    if (stored) setPopularityMap(JSON.parse(stored))
  }, [])

  useEffect(() => {
    localStorage.setItem("zcu-popularity", JSON.stringify(popularityMap))
  }, [popularityMap])

  const handleAddToCart = (poster: any) => {
    addToCart(poster)

    setPopularityMap(prev => ({
      ...prev,
      [poster.slug]: (prev[poster.slug] ?? poster.popularity) + 1,
    }))
  }

  /* ---------------- Filters & Sorting ---------------- */
  const categories = ["All", ...new Set(posters.map(p => p.category))]
  const [activeCategory, setActiveCategory] = useState("All")
  const [sortBy, setSortBy] = useState("newest")

  /* ---------------- Infinite Scroll ---------------- */
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD)
  const loaderRef = useRef<HTMLDivElement | null>(null)

  const today = new Date()

  /* ---------------- Derived Posters ---------------- */
  const computedPosters = useMemo(() => {
    let list =
      activeCategory === "All"
        ? posters
        : posters.filter(p => p.category === activeCategory)

    list = list.map(p => {
      const createdAt = new Date(p.createdAt)
      const diffDays =
        (today.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)

      const popularity =
        popularityMap[p.slug] ?? p.popularity

      return {
        ...p,
        isNew: diffDays <= NEW_DAYS,
        isPopular: popularity >= POPULAR_THRESHOLD,
        popularity,
      }
    })

    if (sortBy === "newest") {
      list.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      )
    }

    if (sortBy === "popular") {
      list.sort((a, b) => b.popularity - a.popularity)
    }

    if (sortBy === "price-low") {
      list.sort((a, b) => a.price - b.price)
    }

    if (sortBy === "price-high") {
      list.sort((a, b) => b.price - a.price)
    }

    return list
  }, [posters, activeCategory, sortBy, popularityMap])

  /* ---------------- Observer ---------------- */
  useEffect(() => {
    setVisibleCount(ITEMS_PER_LOAD)
  }, [activeCategory, sortBy])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount(prev =>
            Math.min(prev + ITEMS_PER_LOAD, computedPosters.length)
          )
        }
      },
      { rootMargin: "300px" }
    )

    if (loaderRef.current) observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [computedPosters.length])

  const handleBuyNow = (poster: any) => {
    const msg = encodeURIComponent(
      `Hello, I want to order:\n${poster.name} – ₹${poster.price}`
    )
    window.location.href =
      `https://api.whatsapp.com/send?phone=917319761618&text=${msg}`
  }

  return (
    <div className="min-h-screen">
      {/* HEADER */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-5 text-center">
          <h1 className="text-4xl font-serif font-bold">Z.C.U Posters</h1>
          <p className="text-muted-foreground">
            Premium Posters for Your Space
          </p>
        </div>
      </header>

      {/* NAV */}
      <nav className="sticky top-0 z-40 bg-background border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between">
          <div className="flex gap-6">
            <a href="#home">Home</a>
            <a href="#posters">Posters</a>
            <Link href="/about">About</Link>
            <a href="#contact">Contact</a>
          </div>
          <CartButton onClick={() => setShowCart(true)} />
        </div>
      </nav>

      {/* HERO */}
      <section id="home" className="py-20 text-center">
        <h2 className="text-5xl font-serif font-bold mb-4">
          Transform Your Space
        </h2>
        <Button asChild>
          <a href="#posters">Browse Collection</a>
        </Button>
      </section>

      {/* FILTERS */}
      <section id="posters" className="pb-6">
        <div className="container mx-auto px-4 flex flex-wrap gap-3 justify-between">
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={cat === activeCategory ? "default" : "outline"}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="newest">Newest</option>
            <option value="popular">Popular</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
          </select>
        </div>
      </section>

      {/* GRID */}
      <section className="pb-20">
        <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {computedPosters.slice(0, visibleCount).map((poster, idx) => (
            <Card key={poster.slug} className="p-4 hover:shadow-lg transition">
              <div className="relative w-full h-64 rounded overflow-hidden">
                <Link href={`/posters/${poster.slug}`}>
                  <Image
                    src={poster.image}
                    alt={poster.name}
                    fill
                    sizes="(max-width:640px) 100vw,
                           (max-width:1024px) 50vw,
                           25vw"
                    className="object-cover"
                    priority={idx < 4}
                    placeholder="blur"
                    blurDataURL="/placeholder.jpg"
                  />
                </Link>

                {/* BADGES */}
                <div className="absolute top-2 left-2 flex gap-2">
                  {poster.isNew && (
                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                      NEW
                    </span>
                  )}
                  {poster.isPopular && (
                    <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
                      POPULAR
                    </span>
                  )}
                </div>
              </div>

              <span className="inline-block mt-2 text-xs px-2 py-1 rounded bg-muted">
                {poster.category}
              </span>

              <Link href={`/posters/${poster.slug}`}>
                {/* <h3 className="font-semibold mt-2 hover:underline">
                  {poster.name}
                </h3> */}
              </Link>

              <p className="text-sm text-muted-foreground">
                {poster.description}
              </p>

              <p className="text-2xl font-bold mt-2">₹{poster.price}</p>

              <div className="flex gap-2 mt-3">
                <Button className="flex-1" onClick={() => handleBuyNow(poster)}>
                  Buy Now
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleAddToCart(poster)}
                >
                  Add to Cart
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div ref={loaderRef} className="h-10" />
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-20 text-center">
        <p>
          Pay via UPI: <b>9297777321@ibl</b>
        </p>
      </section>

      {showCart && <CartDrawer onClose={() => setShowCart(false)} />}
    </div>
  )
}
