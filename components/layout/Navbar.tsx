"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/components/auth/AuthContext"
import { useCart } from "@/components/cart/CartContext"
import { useWishlist } from "@/components/wishlist/WishlistContext"
import CartDrawer from "@/components/cart/CartDrawer"

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cart } = useCart()
  const { wishlist } = useWishlist()
  const [showCart, setShowCart] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0)

  return (
    <>
      <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-zinc-900 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left: hamburger + logo */}
            <div className="flex items-center gap-4">
              {/* Mobile hamburger */}
              <button
                className="md:hidden text-zinc-300 hover:text-white transition"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-white drop-shadow-md">zeff.store</span>
              </Link>
            </div>

            {/* Center: nav links (desktop) */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm font-medium text-zinc-400 hover:text-white transition">Home</Link>
              <Link href="/#posters" className="text-sm font-medium text-zinc-400 hover:text-white transition">All Items</Link>
              <Link href="/#trending" className="text-sm font-medium text-zinc-400 hover:text-white transition">Trending</Link>
              <Link href="/#new-arrivals" className="text-sm font-medium text-zinc-400 hover:text-white transition">New Arrivals</Link>
              <Link href="/about" className="text-sm font-medium text-zinc-400 hover:text-white transition">About</Link>
            </div>

            {/* Right: icons */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 hover:bg-zinc-800 rounded-full transition"
                title="Search"
              >
                <svg className="w-5 h-5 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </button>

              {/* Wishlist */}
              <Link href="/wishlist" className="p-2 hover:bg-zinc-800 rounded-full transition relative" title="Wishlist">
                <svg className="w-5 h-5 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={() => setShowCart(true)}
                className="p-2 hover:bg-zinc-800 rounded-full transition relative"
                title="Cart"
              >
                <svg className="w-5 h-5 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <path d="M3 6h18"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </button>

              {/* User */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-2 hover:bg-zinc-800 rounded-full transition"
                  title="Account"
                >
                  <svg className="w-5 h-5 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </button>

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-zinc-900 rounded-xl shadow-xl border border-zinc-800 py-2 z-50 animate-slide-down">
                      {user ? (
                        <>
                          <div className="px-4 py-3 border-b border-zinc-800">
                            <p className="font-semibold text-sm text-zinc-100">{user.fullName}</p>
                            <p className="text-xs text-zinc-400">{user.email}</p>
                          </div>
                          <Link href="/profile" onClick={() => setShowUserMenu(false)} className="block px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition">
                            My Profile
                          </Link>
                          <Link href="/wishlist" onClick={() => setShowUserMenu(false)} className="block px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition">
                            Wishlist
                          </Link>
                          <button
                            onClick={() => { logout(); setShowUserMenu(false) }}
                            className="block w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-zinc-800 transition"
                          >
                            Logout
                          </button>
                        </>
                      ) : (
                        <>
                          <Link href="/login" onClick={() => setShowUserMenu(false)} className="block px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition">
                            Sign In
                          </Link>
                          <Link href="/register" onClick={() => setShowUserMenu(false)} className="block px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition">
                            Create Account
                          </Link>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-zinc-900 bg-black">
            <div className="container mx-auto px-4 py-3 space-y-1">
              <Link href="/" onClick={() => setShowMobileMenu(false)} className="block py-2 text-sm font-medium text-zinc-300 hover:text-white">Home</Link>
              <Link href="/#posters" onClick={() => setShowMobileMenu(false)} className="block py-2 text-sm font-medium text-zinc-300 hover:text-white">All Items</Link>
              <Link href="/#trending" onClick={() => setShowMobileMenu(false)} className="block py-2 text-sm font-medium text-zinc-300 hover:text-white">Trending</Link>
              <Link href="/#new-arrivals" onClick={() => setShowMobileMenu(false)} className="block py-2 text-sm font-medium text-zinc-300 hover:text-white">New Arrivals</Link>
              <Link href="/about" onClick={() => setShowMobileMenu(false)} className="block py-2 text-sm font-medium text-zinc-300 hover:text-white">About</Link>
              <Link href="/wishlist" onClick={() => setShowMobileMenu(false)} className="block py-2 text-sm font-medium text-zinc-300 hover:text-white">Wishlist</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Search overlay (lazy) */}
      {showSearch && (
        <SearchOverlayWrapper onClose={() => setShowSearch(false)} />
      )}

      {/* Cart drawer */}
      {showCart && <CartDrawer onClose={() => setShowCart(false)} />}
    </>
  )
}

/* Wrapper to lazy-load posters for search */
function SearchOverlayWrapper({ onClose }: { onClose: () => void }) {
  // We import SearchOverlay dynamically since it needs poster data
  const [SearchOverlay, setComp] = useState<React.ComponentType<any> | null>(null)
  const [posters, setPosters] = useState<any[]>([])

  useState(() => {
    import("@/components/layout/SearchOverlay").then(m => setComp(() => m.default))
    fetch("/api/posters")
      .then(r => r.json())
      .then(setPosters)
      .catch(() => {
        // Fallback: load from static import
        import("@/lib/posters").then(m => setPosters(m.posters))
      })
  })

  if (!SearchOverlay) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/60 flex items-start justify-center pt-20" onClick={onClose}>
        <div className="bg-white rounded-xl p-8 text-center">Loading...</div>
      </div>
    )
  }

  return <SearchOverlay posters={posters} onClose={onClose} />
}
