"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import ProductCard from "@/components/product/ProductCard"
import { useCart } from "@/components/cart/CartContext"
import { useWishlist } from "@/components/wishlist/WishlistContext"

type Poster = {
  slug: string
  name: string
  price: number
  category: string
  image: string
  description: string
  createdAt: string
  popularity: number
}

export default function ProductDetailClient({
  poster,
  related,
}: {
  poster: Poster
  related: Poster[]
}) {
  const { addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const [qty, setQty] = useState(1)

  const wishlisted = isInWishlist(poster.slug)
  const originalPrice = Math.round(poster.price * 1.5)

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addToCart({
        id: poster.slug.charCodeAt(0) * 1000 + poster.slug.length,
        name: poster.name,
        price: poster.price,
        image: poster.image,
      })
    }
  }

  const handleBuyNow = () => {
    const msg = encodeURIComponent(
      `Hello, I want to order:\n${poster.name} × ${qty} – ₹${poster.price * qty}`
    )
    window.location.href = `https://api.whatsapp.com/send?phone=917319761618&text=${msg}`
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-zinc-50">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 py-4">
          <p className="text-sm text-zinc-500">
            <Link href="/" className="hover:text-zinc-900 transition">Home</Link>
            {" / "}
            <span
              className="hover:text-zinc-900 transition cursor-pointer"
              onClick={() => {
                window.location.href = `/#posters`
              }}
            >
              {poster.category}
            </span>
            {" / "}
            <span className="text-zinc-900">{poster.name}</span>
          </p>
        </div>

        {/* Product section */}
        <div className="container mx-auto px-4 pb-12">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Image */}
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-white border border-zinc-200 shadow-sm">
              <Image
                src={poster.image}
                alt={poster.name}
                fill
                priority
                className="object-contain"
              />
            </div>

            {/* Details */}
            <div className="py-4">
              <span className="inline-block bg-zinc-100 text-zinc-600 text-xs font-medium px-3 py-1 rounded-full mb-3">
                {poster.category}
              </span>

              <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
                {poster.name}
              </h1>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-zinc-900">₹{poster.price}</span>
                <span className="text-lg text-zinc-400 line-through">₹{originalPrice}</span>
                <span className="bg-emerald-100 text-emerald-700 text-sm font-semibold px-2 py-0.5 rounded">
                  33% OFF
                </span>
              </div>

              <p className="text-zinc-600 text-base leading-relaxed mb-8">
                {poster.description}
              </p>

              {/* Quantity */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-zinc-700 mb-2">Quantity</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-lg border border-zinc-300 flex items-center justify-center hover:bg-zinc-100 transition text-lg"
                  >
                    −
                  </button>
                  <span className="text-lg font-semibold w-8 text-center">{qty}</span>
                  <button
                    onClick={() => setQty(q => q + 1)}
                    className="w-10 h-10 rounded-lg border border-zinc-300 flex items-center justify-center hover:bg-zinc-100 transition text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 mb-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-zinc-900 text-white font-semibold py-3.5 rounded-lg hover:bg-zinc-800 transition"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-emerald-600 text-white font-semibold py-3.5 rounded-lg hover:bg-emerald-700 transition"
                >
                  Buy Now
                </button>
              </div>

              {/* Wishlist */}
              <button
                onClick={() => toggleWishlist(poster.slug)}
                className={`w-full py-3 rounded-lg border font-medium transition flex items-center justify-center gap-2 ${
                  wishlisted
                    ? "bg-red-50 border-red-200 text-red-600"
                    : "border-zinc-300 text-zinc-700 hover:bg-zinc-50"
                }`}
              >
                <svg
                  className={`w-5 h-5 ${wishlisted ? "fill-red-500 text-red-500" : "fill-none text-zinc-600"}`}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {wishlisted ? "Added to Wishlist" : "Add to Wishlist"}
              </button>

              {/* Features */}
              <div className="mt-8 pt-6 border-t border-zinc-200 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg">🚚</p>
                  <p className="text-xs text-zinc-500 mt-1">Free Shipping</p>
                </div>
                <div>
                  <p className="text-lg">🔄</p>
                  <p className="text-xs text-zinc-500 mt-1">Easy Returns</p>
                </div>
                <div>
                  <p className="text-lg">✅</p>
                  <p className="text-xs text-zinc-500 mt-1">Premium Quality</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="container mx-auto px-4 pb-16">
            <h2 className="text-2xl font-bold text-zinc-900 mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map(p => (
                <ProductCard key={p.slug} poster={{ ...p, isNew: false, isPopular: false }} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  )
}
