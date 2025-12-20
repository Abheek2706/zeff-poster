"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "./CartContext"

export default function CartButton({ onClick }: { onClick: () => void }) {
  const { cart } = useCart()
  const count = cart.reduce((s, i) => s + i.quantity, 0)

  return (
    <Button variant="outline" onClick={onClick} className="relative">
      🛒 Cart
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-primary text-white text-xs px-2 rounded-full">
          {count}
        </span>
      )}
    </Button>
  )
}
