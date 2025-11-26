import { prisma } from "@/lib/prisma"
import ProductHeaderClient from "./ProductHeaderName"
import ScrollButton from "./ScrollButton"

export default async function HeroSection() {
  const products = await prisma.product.findMany({
    where: { available: true },
    take: 4,
    orderBy: { createdAt: "desc" },
  })

  return (
    <section className="relative h-screen overflow-hidden bg-black">
      <div className="absolute inset-0">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-60">
          <source src="/videos/video1.MP4" type="video/mp4" />
        </video>
      </div>

      <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/70" />
      <div className="absolute inset-0 bg-linear-to-r from-black/50 via-transparent to-transparent" />

      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="relative z-10 container mx-auto px-4 lg:px-8 h-full flex items-center justify-center">
        <div className="max-w-7xl w-full text-center md:text-left">
          <ProductHeaderClient products={products} />
        </div>
      </div>

      <ScrollButton />
    </section>
  )
}