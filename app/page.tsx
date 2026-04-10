import { getAllPosters } from "@/lib/getPosters"
import HomeWrapper from "./HomeWrapper"

export default function Home() {
  const posters = getAllPosters()
  return <HomeWrapper posters={posters} />
}
