"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from "./CartContext"
import CheckoutButton from "../checkout/CheckoutButton"

export default function CartDrawer({ onClose }: { onClose: () => void }) {
  const { cart, updateQty, removeFromCart, total, clearCart } = useCart()

  const checkout = () => {
    const items = cart
      .map(
        (i) => `• ${i.name} x${i.quantity} = ₹${i.price * i.quantity}`
      )
      .join("\n")

    const msg = encodeURIComponent(
      `Hello, I want to order:\n\n${items}\n\nTotal: ₹${total}`
    )

    window.location.href = `https://api.whatsapp.com/send?phone=917319761618&text=${msg}`
    clearCart()
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-end">
      <Card className="w-full max-w-md h-full p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>

        {cart.length === 0 && <p>Your cart is empty.</p>}

        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex gap-3 items-center">
              <img src={item.image} className="w-16 h-20 object-cover rounded" />
              <div className="flex-1">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm">₹{item.price}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Button size="sm" onClick={() => updateQty(item.id, item.quantity - 1)}>-</Button>
                  <span>{item.quantity}</span>
                  <Button size="sm" onClick={() => updateQty(item.id, item.quantity + 1)}>+</Button>
                </div>
              </div>
              <Button size="sm" variant="destructive" onClick={() => removeFromCart(item.id)}>
                ✕
              </Button>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <>
            <div className="border-t mt-6 pt-4 flex justify-between font-bold">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <CheckoutButton />
          </>
        )}

        <Button variant="outline" className="w-full mt-3" onClick={onClose}>
          Close
        </Button>
      </Card>
    </div>
  )
}
