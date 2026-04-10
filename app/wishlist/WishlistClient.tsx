"use client"

import { useWishlist } from "@/components/wishlist/WishlistContext"
import ProductCard from "@/components/product/ProductCard"
import Link from "next/link"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

export default function WishlistClient({ allPosters }: { allPosters: any[] }) {
  const { wishlist } = useWishlist()

  const wishlisted = allPosters.filter(p => wishlist.includes(p.slug))

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">My Wishlist</h1>
            <p className="text-zinc-500 mt-1">
              {wishlisted.length} {wishlisted.length === 1 ? "item" : "items"} saved
            </p>
          </div>
          <Link
            href="/"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition"
          >
            ← Continue Shopping
          </Link>
        </div>

        {wishlisted.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-zinc-200">
            <div className="text-6xl mb-4">💔</div>
            <h2 className="text-xl font-bold text-zinc-800 mb-2">Your wishlist is empty</h2>
            <p className="text-zinc-500 mb-6">Start adding items you love!</p>
            <Link
              href="/"
              className="inline-block bg-zinc-900 text-white font-semibold px-6 py-3 rounded-lg hover:bg-zinc-800 transition"
            >
              Browse Items
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {wishlisted.map(poster => (
              <ProductCard
                key={poster.slug}
                poster={{ ...poster, isNew: false, isPopular: false }}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
