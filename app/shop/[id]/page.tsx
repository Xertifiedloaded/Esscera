import { notFound } from "next/navigation"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { prisma } from "@/lib/prisma"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { ProductCard } from "@/components/product-card"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params
  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) return { title: "Product Not Found" }

  return {
    title: `${product.name} | LUXE PARFUM`,
    description: product.seoMeta || product.description,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = await prisma.product.findUnique({ where: { id } })

  if (!product) {
    notFound()
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      id: { not: product.id },
      category: product.category,
    },
    take: 3,
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="relative">
                <div className="aspect-3/4 relative rounded-lg overflow-hidden bg-secondary">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              <div className="flex flex-col justify-center space-y-8">
                <div className="space-y-4">
                  <p className="text-[#D4AF37] text-sm tracking-[0.3em] uppercase">{product.category}</p>
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground">{product.name}</h1>
                  <p className="text-3xl gold-text font-semibold">${product.price}</p>
                </div>

                <p className="text-muted-foreground leading-relaxed text-lg">{product.description}</p>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground uppercase tracking-wide">Size:</span>
                    <div className="flex gap-2">
                      {["50ml", "100ml", "200ml"].map((size) => (
                        <button
                          key={size}
                          className="px-4 py-2 border border-border text-sm hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors rounded"
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <AddToCartButton product={product} />

                <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border">
                  <div className="text-center">
                    <p className="text-sm text-[#D4AF37] font-medium">Free Shipping</p>
                    <p className="text-xs text-muted-foreground mt-1">On orders over $200</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-[#D4AF37] font-medium">Gift Wrapping</p>
                    <p className="text-xs text-muted-foreground mt-1">Complimentary</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-[#D4AF37] font-medium">Easy Returns</p>
                    <p className="text-xs text-muted-foreground mt-1">30-day policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="py-16 bg-secondary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">You May Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}
