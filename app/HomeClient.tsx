"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import ProductCard from "@/components/product/ProductCard"
import { useCart } from "@/components/cart/CartContext"

const ITEMS_PER_LOAD = 12
const NEW_DAYS = 7
const POPULAR_THRESHOLD = 80

const HERO_SLIDES = [
  {
    title: "Transform Your Space",
    subtitle: "Premium designs curated for your walls",
    cta: "Shop Now",
    href: "#posters",
    image: "/images/cyberpunk/hero_1.png",
  },
  {
    title: "New Arrivals",
    subtitle: "Fresh designs dropped this week",
    cta: "Explore",
    href: "#new-arrivals",
    image: "/images/cyberpunk/hero_2.png",
  },
  {
    title: "Trending Collection",
    subtitle: "The designs everyone is talking about",
    cta: "See Trending",
    href: "#trending",
    image: "/images/cyberpunk/hero_3.png",
  },
]

export default function HomeClient({ posters }: { posters: any[] }) {
  const { addToCart } = useCart()
  const [heroIdx, setHeroIdx] = useState(0)

  /* ---------- Hero auto-rotate ---------- */
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIdx(prev => (prev + 1) % HERO_SLIDES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  /* ---------- Popularity ---------- */
  const [popularityMap, setPopularityMap] = useState<Record<string, number>>({})
  useEffect(() => {
    const stored = localStorage.getItem("zeff-popularity")
    if (stored) setPopularityMap(JSON.parse(stored))
  }, [])
  useEffect(() => {
    localStorage.setItem("zeff-popularity", JSON.stringify(popularityMap))
  }, [popularityMap])

  /* ---------- Compute posters ---------- */
  const today = new Date()
  const computedPosters = useMemo(() => {
    return posters.map(p => {
      const createdAt = new Date(p.createdAt)
      const diffDays = (today.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
      const popularity = popularityMap[p.slug] ?? p.popularity
      return { ...p, isNew: diffDays <= NEW_DAYS, isPopular: popularity >= POPULAR_THRESHOLD, popularity }
    })
  }, [posters, popularityMap])

  const trendingPosters = useMemo(() =>
    [...computedPosters].sort((a, b) => b.popularity - a.popularity).slice(0, 8),
    [computedPosters]
  )

  const newArrivals = useMemo(() =>
    [...computedPosters]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8),
    [computedPosters]
  )

  /* ---------- Categories ---------- */
  const categories = useMemo(() => {
    const cats = [...new Set(posters.map(p => p.category))]
    return cats.map(cat => ({
      name: cat,
      count: posters.filter(p => p.category === cat).length,
    }))
  }, [posters])

  /* ---------- Full grid filters ---------- */
  const [activeCategory, setActiveCategory] = useState("All")
  const [sortBy, setSortBy] = useState("newest")
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD)
  const loaderRef = useRef<HTMLDivElement | null>(null)

  const gridPosters = useMemo(() => {
    let list = activeCategory === "All"
      ? computedPosters
      : computedPosters.filter(p => p.category === activeCategory)

    if (sortBy === "newest") list = [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    if (sortBy === "popular") list = [...list].sort((a, b) => b.popularity - a.popularity)
    if (sortBy === "price-low") list = [...list].sort((a, b) => a.price - b.price)
    if (sortBy === "price-high") list = [...list].sort((a, b) => b.price - a.price)

    return list
  }, [computedPosters, activeCategory, sortBy])

  useEffect(() => { setVisibleCount(ITEMS_PER_LOAD) }, [activeCategory, sortBy])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisibleCount(prev => Math.min(prev + ITEMS_PER_LOAD, gridPosters.length))
      },
      { rootMargin: "300px" }
    )
    if (loaderRef.current) observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [gridPosters.length])

  const slide = HERO_SLIDES[heroIdx]

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* ═══════════════ HERO CAROUSEL ═══════════════ */}
      <section className="relative overflow-hidden group">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          {HERO_SLIDES.map((slide, i) => (
             <Image
                key={i}
                src={slide.image}
                alt={slide.title}
                fill
                priority={i === 0}
                className={`object-cover object-center transition-opacity duration-1000 ${i === heroIdx ? "opacity-100" : "opacity-0"}`}
             />
          ))}
          {/* Dark Overlay for Text Readability */}
          <div className="absolute inset-0 bg-black/50 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        </div>

        <div className="relative py-28 md:py-40 text-center text-white z-10">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 tracking-tight drop-shadow-xl animate-fade-in uppercase">
             {slide.title}
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl font-light opacity-90 mb-8 max-w-lg mx-auto drop-shadow-md">
             {slide.subtitle}
          </p>
          <a
            href={slide.href}
            className="inline-block bg-white text-zinc-900 font-bold px-10 py-4 rounded-full hover:bg-zinc-100 hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
             {slide.cta}
          </a>
        </div>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIdx(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${i === heroIdx ? "bg-white scale-125" : "bg-white/50"}`}
            />
          ))}
        </div>
      </section>

      {/* ═══════════════ CATEGORY GRID ═══════════════ */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {categories.map(cat => (
              <button
                key={cat.name}
                onClick={() => {
                  setActiveCategory(cat.name)
                  document.getElementById("posters")?.scrollIntoView({ behavior: "smooth" })
                }}
                className="group bg-zinc-900 rounded-xl p-4 border border-zinc-800 hover:border-zinc-600 hover:shadow-lg transition-all text-center"
              >
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-zinc-800 flex items-center justify-center text-2xl group-hover:bg-zinc-700 transition">
                  {cat.name.toLowerCase().includes("car") && "🏎️"}
                  {cat.name.toLowerCase().includes("anime") && "⛩️"}
                  {cat.name.toLowerCase().includes("sport") && "⚽"}
                  {cat.name.toLowerCase().includes("movie") || cat.name.toLowerCase().includes("series") && "🎬"}
                  {cat.name.toLowerCase().includes("music") && "🎵"}
                  {(cat.name.toLowerCase().includes("merch") || cat.name.toLowerCase().includes("apparel") || cat.name.toLowerCase().includes("dress")) && "👕"}
                  {(cat.name.toLowerCase().includes("footwear") || cat.name.toLowerCase().includes("shoe")) && "👟"}
                  {cat.name.toLowerCase().includes("poster") && "🖼️"}
                  {(cat.name.toLowerCase().includes("keyring") || cat.name.toLowerCase().includes("keychain")) && "🔑"}
                  {cat.name.toLowerCase().includes("sticker") && "🏷️"}
                  {cat.name === "General" && "🛍️"}
                  {!["car", "anime", "sport", "movie", "series", "music", "merch", "apparel", "dress", "footwear", "shoe", "poster", "keyring", "keychain", "sticker", "general"].some(k => cat.name.toLowerCase().includes(k)) && "✨"}
                </div>
                <p className="font-semibold text-sm text-zinc-100">{cat.name}</p>
                <p className="text-xs text-zinc-400">{cat.count} items</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ TRENDING ═══════════════ */}
      <section id="trending" className="py-12 bg-black border-y border-zinc-900">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">🔥 Trending Now</h2>
            <button
               onClick={() => {
                 setSortBy("popular")
                 setActiveCategory("All")
                 document.getElementById("posters")?.scrollIntoView({ behavior: "smooth" })
               }}
               className="text-sm font-medium text-zinc-400 hover:text-zinc-200 transition"
             >
               View All →
             </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {trendingPosters.map((p, i) => (
              <ProductCard key={p.slug} poster={p} priority={i < 4} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ NEW ARRIVALS ═══════════════ */}
      <section id="new-arrivals" className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">✨ New Arrivals</h2>
            <button
               onClick={() => {
                 setSortBy("newest")
                 setActiveCategory("All")
                 document.getElementById("posters")?.scrollIntoView({ behavior: "smooth" })
               }}
               className="text-sm font-medium text-zinc-400 hover:text-zinc-200 transition"
             >
               View All →
             </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {newArrivals.map(p => (
              <ProductCard key={p.slug} poster={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ ALL POSTERS (Filterable) ═══════════════ */}
      <section id="posters" className="py-12 bg-black border-t border-zinc-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-white">All Items</h2>

            <div className="flex flex-wrap items-center gap-3">
              {/* Category pills */}
              <div className="flex flex-wrap gap-2">
                {["All", ...categories.map(c => c.name)].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                      cat === activeCategory
                        ? "bg-white text-zinc-900"
                        : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="border border-zinc-800 rounded-lg px-3 py-1.5 text-sm bg-zinc-900 text-zinc-100 outline-none focus:border-zinc-500 transition-colors"
              >
                <option value="newest">Newest</option>
                <option value="popular">Popular</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {gridPosters.slice(0, visibleCount).map((poster, idx) => (
              <ProductCard key={poster.slug} poster={poster} priority={idx < 4} />
            ))}
          </div>

          {gridPosters.length === 0 && (
            <div className="text-center py-20 text-zinc-500">
              <p className="text-lg">No items found in this category.</p>
            </div>
          )}

          <div ref={loaderRef} className="h-10" />
        </div>
      </section>

      {/* ═══════════════ PROMO BANNER ═══════════════ */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-2xl p-8 md:p-12 text-white text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-2">Bulk Discount Offer 🔥</h3>
            <p className="text-zinc-300 mb-1">Buy 5 Items @ ₹475 (Save ₹20) &nbsp;|&nbsp; Buy 10 Items @ ₹930 (Save ₹60)</p>
            <p className="text-zinc-400 text-sm">Above 10 items: each additional item at just ₹93!</p>
          </div>
        </div>
      </section>
    </div>
  )
}
