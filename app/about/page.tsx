import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2">
              Z.C.U Posters
            </h1>
            <p className="text-muted-foreground text-lg">
              Premium Posters for Your Space
            </p>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4">
          <ul className="flex justify-center gap-8 py-4">
            <li>
              <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Home
              </Link>
            </li>
            <li>
              <Link href="/#posters" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Posters
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-sm font-medium text-foreground">
                About
              </Link>
            </li>
            <li>
              <Link href="/#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-5xl md:text-7xl font-serif font-bold mb-6">
            About Z.C.U Posters
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Curating premium art for spaces that inspire creativity and comfort.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl md:text-4xl font-serif font-bold mb-6">
                Our Story
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Z.C.U Posters was born from a passion for transforming ordinary
                spaces into extraordinary experiences. We believe art should be
                accessible, expressive, and part of everyday living.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Each poster is curated to elevate interiors — whether modern,
                minimal, bold, or timeless.
              </p>
            </div>

            {/* IMAGE (FIXED & OPTIMIZED) */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src="/about/modern-interior.jpg"
                alt="Modern interior with posters"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h3 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">
            What We Stand For
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <h4 className="font-semibold text-lg mb-2">Quality Craftsmanship</h4>
              <p className="text-sm text-muted-foreground">
                Premium materials and high-resolution printing for lasting beauty.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <h4 className="font-semibold text-lg mb-2">Curated with Care</h4>
              <p className="text-sm text-muted-foreground">
                Designs selected to match modern and timeless aesthetics.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <h4 className="font-semibold text-lg mb-2">Customer First</h4>
              <p className="text-sm text-muted-foreground">
                We help you find art that truly feels like home.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Custom Design */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h3 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Your Vision, Our Expertise
          </h3>
          <p className="text-lg text-muted-foreground mb-8">
            Have a custom design? Send us your artwork and we’ll turn it into a
            premium poster.
          </p>
          <Link href="/#contact">
            <Button size="lg">Get in Touch</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-muted-foreground">
        <p className="text-sm">© 2025 Z.C.U Posters. All rights reserved.</p>
      </footer>
    </div>
  )
}
