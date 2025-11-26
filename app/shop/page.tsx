import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ShopContent } from "@/components/shop-content"
import { prisma } from "@/lib/prisma"

export const metadata = {
  title: "Shop | ESSCERA",
  description: "Explore our exclusive collection of luxury fragrances.",
}

async function getProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  })
  return products
}

export default async function ShopPage() {
  const products = await getProducts()
  const categories = [...new Set(products.map((p) => p.category))]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <section className="relative py-24 bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-[#D4AF37] text-sm tracking-[0.3em] uppercase mb-4">The Collection</p>
            <h1 className="text-5xl font-bold text-foreground mb-6">Our Fragrances</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each scent is a masterpiece, meticulously crafted to evoke emotions and create lasting impressions.
            </p>
          </div>
        </section>
        <ShopContent products={products} categories={categories} />
      </main>
      <Footer />
    </div>
  )
}
