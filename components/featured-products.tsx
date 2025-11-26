import { prisma } from "@/lib/prisma"
import { ProductCard } from "./product-card"

export async function FeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { available: true },
    take: 3,
    orderBy: { createdAt: "desc" },
  })

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <p className="text-[#D4AF37] text-sm tracking-[0.3em] uppercase">Curated Selection</p>
          <h2 className="text-4xl font-bold text-foreground">Featured Fragrances</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Each creation is a masterpiece of olfactory art, blending the finest ingredients from around the world.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
