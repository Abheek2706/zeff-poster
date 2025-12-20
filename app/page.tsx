"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

import { useCart } from "@/components/cart/CartContext"
import CartButton from "@/components/cart/CartButton"
import CartDrawer from "@/components/cart/CartDrawer"

const initialPosters = [
  {
    id: 1,
    name: "Mountain Serenity",
    price: 499,
    image: "/minimalist-mountain-landscape-poster.jpg",
    description: "Minimalist landscape art",
  },
  {
    id: 2,
    name: "Abstract Waves",
    price: 499,
    image: "/abstract-wave-art-poster.jpg",
    description: "Modern abstract design",
  },
  {
    id: 3,
    name: "Urban Dreams",
    price: 449,
    image: "/urban-cityscape-poster.jpg",
    description: "Contemporary city vibes",
  },
  {
    id: 4,
    name: "Botanical Bliss",
    price: 499,
    image: "/botanical-plant-leaves-poster.jpg",
    description: "Natural botanical art",
  },
]

export default function Home() {
  const [posters, setPosters] = useState(initialPosters)
  const [activeSection, setActiveSection] = useState("home")
  const [showCart, setShowCart] = useState(false)

  const { addToCart } = useCart()

  useEffect(() => {
    const saved = localStorage.getItem("zcu-posters")
    if (saved) setPosters(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem("zcu-posters", JSON.stringify(posters))
  }, [posters])

  const handleBuyNow = (poster: any) => {
    const msg = encodeURIComponent(
      `Hello, I want to order:\n${poster.name} – ₹${poster.price}`
    )
    window.location.href = `https://api.whatsapp.com/send?phone=917319761618&text=${msg}`
  }

  const scrollToSection = (id: string) => {
    setActiveSection(id)
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen">
      {/* HEADER */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-5 text-center">
          <h1 className="text-4xl font-serif font-bold">Z.C.U Posters</h1>
          <p className="text-muted-foreground">Premium Posters for Your Space</p>
        </div>
      </header>

      {/* NAV */}
      <nav className="sticky top-0 z-40 bg-background border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex gap-6">
            <button onClick={() => scrollToSection("home")}>Home</button>
            <button onClick={() => scrollToSection("posters")}>Posters</button>
            <Link href="/about">About</Link>
            <button onClick={() => scrollToSection("contact")}>Contact</button>
          </div>

          <CartButton onClick={() => setShowCart(true)} />
        </div>
      </nav>

      {/* HERO */}
      <section id="home" className="py-20 text-center">
        <h2 className="text-5xl font-serif font-bold mb-4">Transform Your Space</h2>
        <p className="text-muted-foreground mb-6">
          Curated premium posters for every aesthetic
        </p>
        <Button onClick={() => scrollToSection("posters")}>
          Browse Collection
        </Button>
      </section>

      {/* POSTERS */}
      <section id="posters" className="py-20">
        <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {posters.map((poster) => (
            <Card key={poster.id} className="p-4">
              <img
                src={poster.image}
                alt={poster.name}
                className="w-full h-64 object-cover rounded"
              />
              <h3 className="font-semibold text-lg mt-3">{poster.name}</h3>
              <p className="text-sm text-muted-foreground">
                {poster.description}
              </p>
              <p className="text-2xl font-bold mt-2">₹{poster.price}</p>

              <div className="flex gap-2 mt-3">
                <Button className="flex-1" onClick={() => handleBuyNow(poster)}>
                  Buy Now
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() =>
                    addToCart({
                      id: poster.id,
                      name: poster.name,
                      price: poster.price,
                      image: poster.image,
                    })
                  }
                >
                  Add to Cart
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-20 text-center">
        <h2 className="text-3xl font-serif font-bold mb-4">Payment</h2>
        <p className="text-muted-foreground">
          Pay via UPI: <b>9297777321@ibl</b>
        </p>
      </section>

      {/* FOOTER */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © 2025 Z.C.U Posters. All rights reserved.
      </footer>

      {/* CART DRAWER */}
      {showCart && <CartDrawer onClose={() => setShowCart(false)} />}
    </div>
  )
}
