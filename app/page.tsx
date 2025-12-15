"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

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
  const [isAdmin, setIsAdmin] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showAddPosterModal, setShowAddPosterModal] = useState(false)
  const [password, setPassword] = useState("")
  const [newPoster, setNewPoster] = useState({ name: "", price: "", image: "", description: "" })
  const [activeSection, setActiveSection] = useState("home")

  // Load posters from localStorage on mount
  useEffect(() => {
    const savedPosters = localStorage.getItem("zcu-posters")
    if (savedPosters) {
      setPosters(JSON.parse(savedPosters))
    }
  }, [])

  // Save posters to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("zcu-posters", JSON.stringify(posters))
  }, [posters])

  // Keyboard shortcut for admin access
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        e.preventDefault()
        setShowPasswordModal(true)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handlePasswordSubmit = () => {
    if (password === "tigr1602!?") {
      setIsAdmin(true)
      setShowPasswordModal(false)
      setPassword("")
    } else {
      alert("Incorrect password")
      setPassword("")
    }
  }

  const handleAddPoster = () => {
    if (newPoster.name && newPoster.price && newPoster.image) {
      const poster = {
        id: Date.now(),
        name: newPoster.name,
        price: Number.parseFloat(newPoster.price),
        image: newPoster.image,
        description: newPoster.description,
      }
      setPosters([...posters, poster])
      setNewPoster({ name: "", price: "", image: "", description: "" })
      setShowAddPosterModal(false)
    }
  }

  const handleBuyNow = (poster) => {
    const message = encodeURIComponent(`Hello, I want to order: ${poster.name} – ₹${poster.price}`)
    window.location.href = `https://api.whatsapp.com/send?phone=917319761618&text=${message}`
  }

  const handleCustomPoster = () => {
    const message = encodeURIComponent(
      "Hello Z.C.U Posters, I want to order a CUSTOM poster. I will attach my design image and details here.",
    )
    window.location.href = `https://api.whatsapp.com/send?phone=917319761618&text=${message}`
  }

  const scrollToSection = (section) => {
    setActiveSection(section)
    const element = document.getElementById(section)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-5 md:py-6">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-1">Z.C.U Posters</h1>
            <p className="text-muted-foreground text-sm md:text-base">Premium Posters for Your Space</p>
          </div>
        </div>
      </header>

      <nav className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4">
          <ul className="flex justify-center gap-6 md:gap-8 py-3">
            <li>
              <button
                onClick={() => scrollToSection("home")}
                className={`text-sm font-medium transition-colors hover:text-foreground relative ${
                  activeSection === "home" ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                Home
                {activeSection === "home" && <span className="absolute -bottom-3 left-0 right-0 h-0.5 bg-primary" />}
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection("posters")}
                className={`text-sm font-medium transition-colors hover:text-foreground relative ${
                  activeSection === "posters" ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                Posters
                {activeSection === "posters" && <span className="absolute -bottom-3 left-0 right-0 h-0.5 bg-primary" />}
              </button>
            </li>
            <li>
              <Link
                href="/about"
                className="text-sm font-medium transition-colors hover:text-foreground text-muted-foreground"
              >
                About
              </Link>
            </li>
            <li>
              <button
                onClick={() => scrollToSection("contact")}
                className={`text-sm font-medium transition-colors hover:text-foreground relative ${
                  activeSection === "contact" ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                Contact
                {activeSection === "contact" && <span className="absolute -bottom-3 left-0 right-0 h-0.5 bg-primary" />}
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <section id="home" className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4 text-balance">Transform Your Space</h2>
          <p className="text-base md:text-lg text-muted-foreground mb-6 text-pretty max-w-xl mx-auto">
            Discover our curated collection of premium posters, designed to elevate any room with timeless elegance.
          </p>
          <Button
            size="default"
            onClick={() => scrollToSection("posters")}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Browse Collection
          </Button>
        </div>
      </section>

      <section id="posters" className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-2">Our Collection</h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Handpicked designs to complement every aesthetic
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {posters.map((poster) => (
              <Card key={poster.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="aspect-[3/4] relative overflow-hidden bg-muted">
                  <img
                    src={poster.image || "/placeholder.svg"}
                    alt={poster.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{poster.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{poster.description || "Premium quality print"}</p>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-2xl font-serif font-bold">₹{poster.price}</p>
                    <span className="text-xs text-muted-foreground">Free Delivery</span>
                  </div>
                  <Button onClick={() => handleBuyNow(poster)} className="w-full" size="sm">
                    Buy Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="p-6 md:p-8 text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-7 h-7 text-primary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"
                  />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-3">Have Your Own Design?</h2>
              <p className="text-sm md:text-base text-muted-foreground mb-5 text-pretty">
                We can bring your unique vision to life. Send us your custom poster design and we'll create a premium
                print just for you.
              </p>
              <Button onClick={handleCustomPoster} variant="outline">
                Send Custom Design on WhatsApp
              </Button>
            </Card>
          </div>
        </div>
      </section>

      <section id="contact" className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-2">Payment Options</h2>
              <p className="text-muted-foreground text-sm md:text-base">Quick and secure payment methods</p>
            </div>
            <Card className="p-6 md:p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="font-semibold text-lg mb-4">Pay via UPI</h3>
                  <div className="bg-muted/50 p-4 rounded-lg inline-block mb-4">
                    <p className="text-xl md:text-2xl font-mono font-bold text-primary">9297777321@ibl</p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-lg">
                    <img src="/upi-qr-code-payment.jpg" alt="UPI QR Code" className="w-48 h-48" />
                  </div>
                </div>
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                  <p className="text-center text-sm text-foreground">
                    After payment, please send the screenshot on WhatsApp for order confirmation
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <footer className="border-t py-8 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-3">
            <h3 className="text-xl font-serif font-bold">Z.C.U Posters</h3>
            <p className="text-sm text-muted-foreground">Premium Posters for Your Space</p>
            <div className="flex justify-center gap-6 text-sm">
              <button
                onClick={() => scrollToSection("home")}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("posters")}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Posters
              </button>
              <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </button>
            </div>
            <p className="text-xs text-muted-foreground pt-3 border-t">© 2025 Z.C.U Posters. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {isAdmin && (
        <button
          onClick={() => setShowAddPosterModal(true)}
          className="fixed bottom-6 right-6 w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center text-2xl font-bold z-50"
        >
          +
        </button>
      )}

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-md p-8 shadow-2xl animate-in zoom-in duration-200">
            <h3 className="text-2xl font-semibold mb-6">Admin Access</h3>
            <div className="space-y-6">
              <div>
                <Label htmlFor="password" className="text-base">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
                  placeholder="Enter admin password"
                  className="mt-2"
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={handlePasswordSubmit} className="flex-1">
                  Submit
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPasswordModal(false)
                    setPassword("")
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {showAddPosterModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-md p-8 shadow-2xl animate-in zoom-in duration-200">
            <h3 className="text-2xl font-semibold mb-6">Add New Poster</h3>
            <div className="space-y-6">
              <div>
                <Label htmlFor="poster-name" className="text-base">
                  Poster Name
                </Label>
                <Input
                  id="poster-name"
                  value={newPoster.name}
                  onChange={(e) => setNewPoster({ ...newPoster, name: e.target.value })}
                  placeholder="Enter poster name"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="poster-price" className="text-base">
                  Price (₹)
                </Label>
                <Input
                  id="poster-price"
                  type="number"
                  value={newPoster.price}
                  onChange={(e) => setNewPoster({ ...newPoster, price: e.target.value })}
                  placeholder="Enter price"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="poster-image" className="text-base">
                  Image URL
                </Label>
                <Input
                  id="poster-image"
                  value={newPoster.image}
                  onChange={(e) => setNewPoster({ ...newPoster, image: e.target.value })}
                  placeholder="Enter image URL"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="poster-description" className="text-base">
                  Description
                </Label>
                <Input
                  id="poster-description"
                  value={newPoster.description}
                  onChange={(e) => setNewPoster({ ...newPoster, description: e.target.value })}
                  placeholder="Enter description"
                  className="mt-2"
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={handleAddPoster} className="flex-1">
                  Add Poster
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddPosterModal(false)
                    setNewPoster({ name: "", price: "", image: "", description: "" })
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
