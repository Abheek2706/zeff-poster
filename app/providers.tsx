"use client"

import { CartProvider } from "@/components/cart/CartContext"
import { AuthProvider } from "@/components/auth/AuthContext"
import { WishlistProvider } from "@/components/wishlist/WishlistContext"
import AuthGuard from "@/components/auth/AuthGuard"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthGuard>
        <CartProvider>
          <WishlistProvider>
            {children}
          </WishlistProvider>
        </CartProvider>
      </AuthGuard>
    </AuthProvider>
  )
}
