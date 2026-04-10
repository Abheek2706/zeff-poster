import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-zinc-800">
      {/* Header */}
      <header className="border-b border-zinc-900 bg-black/50 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 text-white">
              zeff.store
            </h1>
            <p className="text-zinc-400 text-lg font-light">
              Premium Items for Your Space
            </p>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900">
        <div className="container mx-auto px-4">
          <ul className="flex justify-center gap-8 py-4">
            <li>
              <Link href="/" className="text-sm font-medium text-zinc-400 hover:text-white transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/#posters" className="text-sm font-medium text-zinc-400 hover:text-white transition">
                All Items
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-sm font-medium text-white">
                About
              </Link>
            </li>
            <li>
              <Link href="/#contact" className="text-sm font-medium text-zinc-400 hover:text-white transition">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 to-zinc-950 -z-10" />
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-5xl md:text-7xl font-black mb-6 text-white tracking-tighter">
            About zeff.store
          </h2>
          <p className="text-lg md:text-xl text-zinc-400 font-light">
            Curating premium apparel, art, and accessories for a bold new generation.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-black border-y border-zinc-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl md:text-4xl font-black mb-6 text-white uppercase tracking-tight">
                Our Story
              </h3>
              <p className="text-zinc-400 leading-relaxed mb-4">
                zeff.store was born from a passion for standing out and owning your aesthetic. 
                We believe what you wear and what you display should be an extension of your boldest self.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                From premium streetwear to high-quality accessories and striking art pieces, every single product is curated to elevate your style to the next level.
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
          <h3 className="text-3xl md:text-4xl font-black text-white text-center mb-12 uppercase tracking-tight">
            What We Stand For
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition">
              <h4 className="font-bold text-lg text-white mb-2">Quality Craftsmanship</h4>
              <p className="text-sm text-zinc-400">
                Premium materials and high-resolution printing for products built to last.
              </p>
            </Card>

            <Card className="p-6 text-center bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition">
              <h4 className="font-bold text-lg text-white mb-2">Curated with Edge</h4>
              <p className="text-sm text-zinc-400">
                Designs selected to match modern, bold, and unapologetic aesthetics.
              </p>
            </Card>

            <Card className="p-6 text-center bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition">
              <h4 className="font-bold text-lg text-white mb-2">Customer First</h4>
              <p className="text-sm text-zinc-400">
                We make sure every piece you buy feels unique and premium.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Custom Design */}
      <section className="py-20 bg-black border-t border-zinc-900">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h3 className="text-3xl md:text-4xl font-black text-white mb-6 uppercase tracking-tight">
            Your Vision, Our Canvas
          </h3>
          <p className="text-lg text-zinc-400 mb-8 font-light">
            Have a custom design idea? Send us your artwork and we’ll turn it into premium merch or apparel.
          </p>
          <Link href="/#contact">
            <Button size="lg" className="bg-white text-black hover:bg-zinc-200 font-bold rounded-full px-8 py-6">Get in Touch</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8 text-center text-zinc-500 bg-zinc-950">
        <p className="text-sm">© 2026 zeff.store. All rights reserved.</p>
      </footer>
    </div>
  )
}
