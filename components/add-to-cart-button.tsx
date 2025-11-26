"use client"

import { useState } from "react"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Check, Minus, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface Product {
  id: string
  name: string
  price: number
  available: boolean
}

interface AddToCartButtonProps {
  product: Product
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToCart = async () => {
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

    setIsLoading(true)
    try {
      await addToCart(product.id, quantity)
      setAdded(true)
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      })
      setTimeout(() => setAdded(false), 2000)
    } catch {
      toast({
        title: "Error",
        description: "Failed to add item to cart.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!product.available) {
    return (
      <Button disabled className="w-full py-6 text-sm tracking-widest uppercase bg-muted text-muted-foreground">
        Currently Unavailable
      </Button>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground uppercase tracking-wide">Quantity:</span>
        <div className="flex items-center border border-border rounded">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="p-2 hover:bg-secondary transition-colors"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
          <button onClick={() => setQuantity((q) => q + 1)} className="p-2 hover:bg-secondary transition-colors">
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Button
        onClick={handleAddToCart}
        disabled={isLoading}
        className={`w-full py-6 text-sm tracking-widest uppercase transition-all ${
          added ? "bg-green-600 hover:bg-green-600" : "gold-gradient hover:opacity-90"
        } text-primary-foreground`}
      >
        {isLoading ? (
          "Adding..."
        ) : added ? (
          <>
            <Check className="h-4 w-4 mr-2" />
            Added to Cart
          </>
        ) : (
          <>
            <ShoppingBag className="h-4 w-4 mr-2" />
            Add to Cart - ${product.price * quantity}
          </>
        )}
      </Button>
    </div>
  )
}
