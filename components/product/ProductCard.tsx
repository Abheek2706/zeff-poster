"use client"

import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/components/cart/CartContext"
import { useWishlist } from "@/components/wishlist/WishlistContext"

type Props = {
  poster: {
    slug: string
    name: string
    price: number
    category: string
    image: string
    description: string
    isNew?: boolean
    isPopular?: boolean
  }
  priority?: boolean
}

export default function ProductCard({ poster, priority = false }: Props) {
  const { addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const wishlisted = isInWishlist(poster.slug)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart({
      id: poster.slug.charCodeAt(0) * 1000 + poster.slug.length,
      name: poster.name,
      price: poster.price,
      image: poster.image,
    })
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(poster.slug)
  }

  return (
    <div className="group relative bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-700 hover:shadow-lg hover:shadow-zinc-900 transition-all duration-300">
      {/* Image */}
      <Link href={`/posters/${poster.slug}`} className="block relative aspect-[3/4] overflow-hidden bg-muted">
        <Image
          src={poster.image}
          alt={poster.name}
          fill
          sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          priority={priority}
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1.5 z-10">
          {poster.isNew && (
            <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">NEW</span>
          )}
          {poster.isPopular && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">TRENDING</span>
          )}
        </div>

        {/* Wishlist heart */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-zinc-900/50 hover:bg-zinc-800/80 backdrop-blur flex items-center justify-center transition border border-zinc-700/50 shadow-sm"
        >
          <svg
            className={`w-4 h-4 transition-colors ${wishlisted ? "fill-red-500 text-red-500" : "fill-none text-zinc-600"}`}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Add to cart overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            className="w-full bg-white text-zinc-900 font-semibold text-sm py-2.5 rounded-lg hover:bg-zinc-100 transition"
          >
            Add to Cart
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-3">
        <Link href={`/posters/${poster.slug}`}>
          <h3 className="font-semibold text-sm truncate hover:text-zinc-300 text-zinc-100 transition">{poster.name}</h3>
        </Link>
        <p className="text-xs text-zinc-400 mt-0.5">{poster.category}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="font-bold text-base text-white">₹{poster.price}</span>
          <span className="text-xs text-zinc-500 line-through">₹{Math.round(poster.price * 1.5)}</span>
          <span className="text-xs text-emerald-600 font-semibold">33% OFF</span>
        </div>
      </div>
    </div>
  )
}
