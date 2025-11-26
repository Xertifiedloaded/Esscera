"use client"

import { useState } from "react"
import { ProductCard } from "./product-card"

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string | null
  available: boolean
}

interface ShopContentProps {
  products: Product[]
  categories: string[]
}

export function ShopContent({ products, categories }: ShopContentProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filteredProducts = activeCategory ? products.filter((p) => p.category === activeCategory) : products

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-6 py-2 text-sm tracking-widest uppercase rounded-full transition-colors ${
              activeCategory === null
                ? "bg-[#D4AF37] text-primary-foreground"
                : "border border-border text-muted-foreground hover:border-[#D4AF37] hover:text-[#D4AF37]"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 text-sm tracking-widest uppercase rounded-full transition-colors ${
                activeCategory === category
                  ? "bg-[#D4AF37] text-primary-foreground"
                  : "border border-border text-muted-foreground hover:border-[#D4AF37] hover:text-[#D4AF37]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found in this category.</p>
          </div>
        )}
      </div>
    </section>
  )
}
