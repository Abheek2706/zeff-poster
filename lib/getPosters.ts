import fs from "fs"
import path from "path"

/* ---------- MANUAL PRICE MAP ---------- */
const PRICE_MAP: Record<string, number> = {
  // Cars
  "bmw": 99,
  "car": 99,
  "porche": 99,
  "nfs": 99,
  "formula": 99,
  "f1": 99,

  // Superheroes / Movies
  "avengers": 99,
  "batman": 99,
  "spiderman": 99,
  "daredevil": 99,
  "deadpool": 99,
  "supergirl": 99,
  "superheroes": 99,
  "bumblebee": 99,
  "prime": 99,

  // Series / Quotes
  "stranger-things": 99,
  "i-am-choosen": 99,
  "hope": 99,
  "why-not-me": 99,

  // Art / Fantasy
  "dragon-got": 99,
  "avatar": 99,
  "skull": 99,
  "starboy": 99,
  "loki": 99,
  "lokiking": 99,
}

/* ---------- MANUAL CATEGORY MAP ---------- */
const CATEGORY_MAP: Record<string, string> = {
  // Cars
  "bmw": "Cars",
  "car": "Cars",
  "porche": "Cars",
  "nfs": "Cars",
  "formula": "Cars",
  "f1": "Cars",

  // Superheroes
  "avengers": "Superhero",
  "batman": "Superhero",
  "spiderman": "Superhero",
  "daredevil": "Superhero",
  "deadpool": "Superhero",
  "supergirl": "Superhero",
  "superheroes": "Superhero",
  "bumblebee": "Superhero",
  "prime": "Superhero",

  // Series / Pop Culture
  "stranger-things": "Series",
  "loki": "Series",
  "lokiking": "Series",

  // Quotes / Motivation
  "i-am-choosen": "Quotes",
  "hope": "Quotes",
  "why-not-me": "Quotes",

  // Art / Fantasy
  "dragon-got": "Fantasy",
  "avatar": "Fantasy",
  "skull": "Art",
  "starboy": "Art",
}

/* ---------- helpers ---------- */

function cleanName(filename: string) {
  return filename
    .replace(/\.[^/.]+$/, "")
    .replace(/[_-]+/g, " ")
    .trim()
    .replace(/\b\w/g, (l) => l.toUpperCase())
}

function createSlug(filename: string) {
  return filename
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

/* ---------- main ---------- */

export function getAllPosters() {
  const postersDir = path.join(process.cwd(), "public/posters")
  const files = fs
    .readdirSync(postersDir)
    .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))

  return files.map((file, index) => {
    const slug = createSlug(file)

    return {
      id: index + 1,
      index,
      slug,
      name: cleanName(file),
      category: CATEGORY_MAP[slug] ?? "General",
      price: PRICE_MAP[slug] ?? 99,
      image: `/posters/${file}`,
      description: "Premium wall poster",
      createdAt: new Date().toISOString(),
      popularity: 0,
    }
  })
}
