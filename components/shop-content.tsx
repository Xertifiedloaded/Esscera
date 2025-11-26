
"use client"

import { useState } from "react"

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


function ProductCard({ product }: { product: Product }) {
  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square bg-gray-100 flex items-center justify-center">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400">No Image</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-3">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-[#D4AF37] font-bold">${product.price}</span>
          <span className={`text-xs ${product.available ? 'text-green-600' : 'text-red-600'}`}>
            {product.available ? 'Available' : 'Out of Stock'}
          </span>
        </div>
      </div>
    </div>
  )
}

export function ShopContent({ products, categories }: ShopContentProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filteredProducts = activeCategory ? products.filter((p) => p.category === activeCategory) : products

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Horizontal Scrollable Categories */}
        <div className="mb-12">
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
            <div className="flex items-center gap-2 min-w-max pb-2">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm tracking-wide uppercase whitespace-nowrap rounded-full transition-all ${
                  activeCategory === null
                    ? "bg-[#D4AF37] text-white shadow-md"
                    : "border border-gray-300 text-gray-600 hover:border-[#D4AF37] hover:text-[#D4AF37]"
                }`}
              >
                All Products
              </button>
              
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm tracking-wide uppercase whitespace-nowrap rounded-full transition-all ${
                    activeCategory === category
                      ? "bg-[#D4AF37] text-white shadow-md"
                      : "border border-gray-300 text-gray-600 hover:border-[#D4AF37] hover:text-[#D4AF37]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          {/* Active Category Indicator */}
          {activeCategory && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-[#D4AF37]">{activeCategory}</span> products
                <button 
                  onClick={() => setActiveCategory(null)}
                  className="ml-2 text-xs underline hover:text-[#D4AF37] transition-colors"
                >
                  Clear filter
                </button>
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No products found in this category.</p>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  )
}