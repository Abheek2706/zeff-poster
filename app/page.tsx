import { getAllPosters } from "@/lib/getPosters"
import HomeClient from "./HomeClient"

export default function Page() {
  const posters = getAllPosters()
  return <HomeClient posters={posters} />
}
