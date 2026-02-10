"use client"

import { createContext, useContext, useEffect, useState, useMemo } from "react"

export type CartItem = {
  id: number
  name: string
  price: number
  image: string
  quantity: number
}

type CartContextType = {
  cart: CartItem[]
  addToCart: (item: Omit<CartItem, "quantity">) => void
  removeFromCart: (id: number) => void
  updateQty: (id: number, qty: number) => void
  clearCart: () => void
  total: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  // Load cart
  useEffect(() => {
    const saved = localStorage.getItem("zeff-cart")
    if (saved) setCart(JSON.parse(saved))
  }, [])

  // Save cart
  useEffect(() => {
    localStorage.setItem("zeff-cart", JSON.stringify(cart))
  }, [cart])

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === item.id)
      if (existing) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((p) => p.id !== id))
  }

  const updateQty = (id: number, qty: number) => {
    if (qty <= 0) removeFromCart(id)
    else
      setCart((prev) =>
        prev.map((p) => (p.id === id ? { ...p, quantity: qty } : p))
      )
  }

  const clearCart = () => setCart([])

  const total = useMemo(() => {
    const totalQty = cart.reduce((sum, i) => sum + i.quantity, 0)
    let totalAmount = 0
    let remainingQty = totalQty

    if (totalQty > 10) {
      // If more than 10, first 10 is 930
      // For every poster above 10, price is 93 (same profit margin as 10 posters)
      totalAmount = 930 + (totalQty - 10) * 93
    } else {
      // Standard Bundle Logic for <= 10
      const setsOf10 = Math.floor(remainingQty / 10)
      remainingQty -= setsOf10 * 10
      totalAmount += setsOf10 * 930

      const setsOf5 = Math.floor(remainingQty / 5)
      remainingQty -= setsOf5 * 5
      totalAmount += setsOf5 * 475

      totalAmount += remainingQty * 99
    }

    return totalAmount
  }, [cart])

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQty, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be inside CartProvider")
  return ctx
}
