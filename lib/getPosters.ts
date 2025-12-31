import fs from "fs"
import path from "path"

/* ---------- MANUAL PRICE MAP ---------- */
const PRICE_MAP: Record<string, number> = {
  // Cars
  "bmw": 149,
  "car": 149,
  "porche": 149,
  "nfs": 149,
  "formula": 149,
  "f1": 149,

  // Superheroes / Movies
  "avengers": 149,
  "batman": 149,
  "spiderman": 149,
  "daredevil": 149,
  "deadpool": 149,
  "supergirl": 149,
  "superheroes": 199,
  "bumblebee": 199,
  "prime": 199,

  // Series / Quotes
  "stranger-things": 149,
  "i-am-choosen": 149,
  "hope": 149,
  "why-not-me": 149,

  // Art / Fantasy
  "dragon-got": 149,
  "avatar": 199,
  "skull": 149,
  "starboy": 149,
  "loki": 149,
  "lokiking": 149,
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
      price: PRICE_MAP[slug] ?? 149,
      image: `/posters/${file}`,
      description: "Premium wall poster",
      createdAt: new Date().toISOString(),
      popularity: 0,
    }
  })
}
