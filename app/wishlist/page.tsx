import { getAllPosters } from "@/lib/getPosters"
import WishlistClient from "./WishlistClient"

export const metadata = {
  title: "My Wishlist | zeff.store",
}

export default function WishlistPage() {
  const posters = getAllPosters()
  return <WishlistClient allPosters={posters} />
}
