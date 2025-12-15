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
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-2">Z.C.U Posters</h1>
            <p className="text-muted-foreground text-lg">Premium Posters for Your Space</p>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4">
          <ul className="flex justify-center gap-8 py-4">
            <li>
              <Link
                href="/"
                className="text-sm font-medium transition-colors hover:text-foreground text-muted-foreground"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/#posters"
                className="text-sm font-medium transition-colors hover:text-foreground text-muted-foreground"
              >
                Posters
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-sm font-medium transition-colors hover:text-foreground text-foreground"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/#contact"
                className="text-sm font-medium transition-colors hover:text-foreground text-muted-foreground"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-balance">About Z.C.U Posters</h2>
          <p className="text-lg md:text-xl text-muted-foreground text-pretty">
            Curating premium art for spaces that inspire creativity and comfort.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl md:text-4xl font-serif font-bold mb-6">Our Story</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Z.C.U Posters was born from a passion for transforming ordinary spaces into extraordinary experiences.
                  We believe that art shouldn't be confined to galleries—it should be accessible to everyone who wants
                  to create a beautiful, inspiring environment.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Every poster in our collection is carefully curated to bring elegance, character, and personality to
                  your home or office. From minimalist landscapes to bold abstract designs, we offer something for every
                  aesthetic.
                </p>
              </div>
              <div className="aspect-[4/3] relative overflow-hidden rounded-lg bg-muted">
                <img
                  src="/modern-interior-design-with-posters-on-wall.jpg"
                  alt="Modern interior with posters"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">What We Stand For</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-primary"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-lg mb-2">Quality Craftsmanship</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Premium materials and precise printing techniques ensure every poster is a work of art.
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-primary"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-lg mb-2">Curated with Care</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Each design is thoughtfully selected to complement modern aesthetics and timeless styles.
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-primary"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-lg mb-2">Customer First</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your satisfaction is our priority. We're here to help you find the perfect piece.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Design Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-3xl md:text-4xl font-serif font-bold mb-6">Your Vision, Our Expertise</h3>
            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              Have a unique design in mind? We specialize in custom poster printing. Send us your artwork and we'll
              bring it to life with professional quality printing.
            </p>
            <Link href="/#contact">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="text-sm">© 2025 Z.C.U Posters. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
