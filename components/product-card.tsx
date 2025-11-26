"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { ShoppingBag } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string | null
  available: boolean
}

interface ProductCardProps {
  product: Product
  featured?: boolean
  compact?: boolean
  wide?: boolean
}

export function ProductCard({ product, featured, compact, wide }: ProductCardProps) {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [showComingSoon, setShowComingSoon] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    if (!product.available) {
      e.preventDefault()
      setShowComingSoon(true)
    }
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!product.available) return

    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to add items to your cart.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    setIsAdding(true)
    try {
      await addToCart(product.id)
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to add item to cart.",
        variant: "destructive",
      })
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <>
      <Link
        href={product.available ? `/shop/${product.id}` : "#"}
        onClick={handleClick}
        className={cn(
          "group block h-full",
          !product.available && "cursor-not-allowed"
        )}
      >
        <div
          className={cn(
            "relative h-full overflow-hidden rounded-xl bg-card border border-border transition-all duration-500 hover:border-purple-400/50 hover:shadow-xl hover:shadow-purple-500/10",
            !product.available && "opacity-50",
            featured && "bg-gradient-to-br from-purple-500/5 to-amber-500/5"
          )}
        >
          {/* Image Container */}
          <div
            className={cn(
              "relative overflow-hidden bg-secondary",
              featured ? "h-2/3" : compact ? "h-32" : wide ? "h-48" : "aspect-3/4"
            )}
          >
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className={cn(
                "object-cover transition-transform duration-700",
                product.available ? "group-hover:scale-110" : "grayscale"
              )}
            />

            {/* Coming Soon Overlay */}
            {!product.available && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                <span className="text-sm tracking-widest uppercase text-muted-foreground">
                  Coming Soon
                </span>
              </div>
            )}

            {/* Gradient Overlay on Hover */}
            {product.available && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            )}

            {/* Quick Add Button */}
            {product.available && !compact && (
              <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <Button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className={cn(
                    "w-full bg-gradient-to-r from-purple-600 to-amber-500 hover:from-purple-700 hover:to-amber-600 text-white shadow-lg shadow-purple-500/50",
                    featured && "py-6 text-base"
                  )}
                  size={featured ? "lg" : "default"}
                >
                  <ShoppingBag className={cn("mr-2", featured ? "h-5 w-5" : "h-4 w-4")} />
                  {isAdding ? "Adding..." : "Add to Cart"}
                </Button>
              </div>
            )}
          </div>

          {/* Content */}
          <div
            className={cn(
              "p-4 space-y-2",
              featured && "p-6 space-y-3",
              compact && "p-3 space-y-1"
            )}
          >
            <p
              className={cn(
                "text-xs tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-400",
                compact && "text-[10px]"
              )}
            >
              {product.category}
            </p>

            <h3
              className={cn(
                "font-semibold text-foreground transition-colors group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-amber-400",
                featured ? "text-2xl" : compact ? "text-sm line-clamp-1" : "text-lg"
              )}
            >
              {product.name}
            </h3>

            {!compact && (
              <p
                className={cn(
                  "text-muted-foreground line-clamp-2",
                  featured ? "text-base" : "text-sm"
                )}
              >
                {product.description}
              </p>
            )}

            <div className="flex items-center justify-between pt-2">
              <span
                className={cn(
                  "font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-400",
                  featured ? "text-2xl" : compact ? "text-base" : "text-xl"
                )}
              >
                ${product.price}
              </span>

              {compact && product.available && (
                <Button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-purple-400 hover:text-amber-400 hover:bg-purple-400/10"
                >
                  <ShoppingBag className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </Link>

      <Dialog open={showComingSoon} onOpenChange={setShowComingSoon}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-center">
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-400">
                Coming Soon
              </span>
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-muted-foreground">
              <span className="text-foreground font-medium">{product.name}</span> is currently unavailable. Please
              check back soon for availability.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}