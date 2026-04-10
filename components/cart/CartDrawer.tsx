"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from "./CartContext"
import CheckoutButton from "../checkout/CheckoutButton"
import Image from "next/image"

export default function CartDrawer({ onClose }: { onClose: () => void }) {
  const { cart, updateQty, removeFromCart, total, clearCart } = useCart()

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0)

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex justify-end" onClick={onClose}>
      <div
        className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-slide-right"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-bold text-zinc-900">
            Shopping Bag <span className="text-zinc-500 font-normal text-sm">({cartCount})</span>
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-zinc-100 rounded-full transition">
            <svg className="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.length === 0 && (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🛒</div>
              <p className="text-zinc-500 text-sm">Your bag is empty</p>
              <button onClick={onClose} className="mt-4 text-sm font-medium text-zinc-900 underline">
                Continue Shopping
              </button>
            </div>
          )}

          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="flex gap-3 bg-zinc-50 rounded-lg p-3">
                <div className="relative w-16 h-20 rounded overflow-hidden shrink-0 bg-zinc-200">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-zinc-900 truncate">{item.name}</p>
                  <p className="text-sm font-bold text-zinc-800 mt-1">₹{item.price}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQty(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-full border border-zinc-300 flex items-center justify-center text-sm hover:bg-zinc-100 transition"
                    >
                      −
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-full border border-zinc-300 flex items-center justify-center text-sm hover:bg-zinc-100 transition"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="self-start p-1 text-zinc-400 hover:text-red-500 transition"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-6 py-4 border-t border-zinc-200 space-y-3 shrink-0 bg-white">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Subtotal ({cartCount} items)</span>
              <span className="font-bold text-zinc-900">₹{total}</span>
            </div>
            <CheckoutButton />
            <button
              onClick={() => {
                const items = cart
                  .map(i => `• ${i.name} x${i.quantity} = ₹${i.price * i.quantity}`)
                  .join("\n")
                const msg = encodeURIComponent(`Hello, I want to order:\n\n${items}\n\nTotal: ₹${total}`)
                window.location.href = `https://api.whatsapp.com/send?phone=917319761618&text=${msg}`
                clearCart()
              }}
              className="w-full py-2.5 border border-zinc-300 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition flex items-center justify-center gap-2"
            >
              💬 Order via WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
