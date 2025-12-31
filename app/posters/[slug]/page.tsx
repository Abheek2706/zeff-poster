import Image from "next/image"
import { getAllPosters } from "@/lib/getPosters"
import { notFound } from "next/navigation"

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

/* ---------- SEO ---------- */
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const posters = getAllPosters()
  const poster = posters.find((p) => p.slug === slug)

  if (!poster) return {}

  return {
    title: `${poster.name} | Z.C.U Posters`,
    description: poster.description,
    openGraph: {
      images: [poster.image],
    },
  }
}

/* ---------- PAGE ---------- */
export default async function PosterPage({ params }: PageProps) {
  const { slug } = await params
  const posters = getAllPosters()
  const poster = posters.find((p) => p.slug === slug)

  if (!poster) return notFound()

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* IMAGE */}
        <div className="relative w-full aspect-[3/4] rounded overflow-hidden border bg-black">
          <Image
            src={poster.image}
            alt={poster.name}
            fill
            priority
            className="object-contain"
          />
        </div>

        {/* DETAILS */}
        <div>
          <h1 className="text-4xl font-serif font-bold">
            {poster.name}
          </h1>

          <p className="text-muted-foreground mt-2">
            Category: {poster.category}
          </p>

          <p className="text-3xl font-bold mt-4">
            ₹{poster.price}
          </p>

          <p className="mt-4 text-lg">
            {poster.description}
          </p>

          <div className="mt-6 flex gap-4">
            <a
              href={`https://api.whatsapp.com/send?phone=917319761618&text=${encodeURIComponent(
                `Hello, I want to order:\n${poster.name} – ₹${poster.price}`
              )}`}
              className="px-6 py-3 bg-black text-white rounded"
            >
              Buy via WhatsApp
            </a>

            <a
              href="/#posters"
              className="px-6 py-3 border rounded"
            >
              Back to Posters
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
