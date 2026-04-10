"use client"

import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import HomeClient from "./HomeClient"

export default function HomeWrapper({ posters }: { posters: any[] }) {
  return (
    <>
      <Navbar />
      <HomeClient posters={posters} />
      <Footer />
    </>
  )
}
