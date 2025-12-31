export type Poster = {
  slug: string
  name: string
  price: number
  category: string
  image: string
  description: string

  createdAt: string     // ISO date
  popularity: number    // base popularity
}
export const posters: Poster[] = [
  {
    slug: "red-sports-car",
    name: "Red Sports Car",
    price: 599,
    category: "Cars",
    image: "/posters/red-sports-car.jpg",
    description: "A sleek red sports car speeding down the highway.",
    createdAt: "2024-01-15T10:00:00Z",
    popularity: 150,
  },
  {
    slug: "mountain-landscape",
    name: "Mountain Landscape",
    price: 499,
    category: "General",
    image: "/posters/mountain-landscape.jpg",
    description: "A breathtaking view of mountains during sunrise.",
    createdAt: "2024-03-22T08:30:00Z",
    popularity: 200,
  }
]