import Image from "next/image"
import Link from "next/link"
import { getAllPosters } from "@/lib/getPosters"
import { notFound } from "next/navigation"
import ProductDetailClient from "./ProductDetailClient"

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
    title: `${poster.name} | zeff.store`,
    description: poster.description,
    openGraph: { images: [poster.image] },
  }
}

/* ---------- PAGE ---------- */
export default async function PosterPage({ params }: PageProps) {
  const { slug } = await params
  const posters = getAllPosters()
  const poster = posters.find((p) => p.slug === slug)

  if (!poster) return notFound()

  // Related posters (same category, excluding current)
  const related = posters
    .filter(p => p.category === poster.category && p.slug !== poster.slug)
    .slice(0, 4)

  return (
    <ProductDetailClient poster={poster} related={related} />
  )
}
