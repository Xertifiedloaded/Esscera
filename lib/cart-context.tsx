"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useAuth } from "./auth-context"

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string | null
  available: boolean
}

interface CartItem {
  id: string
  productId: string
  product: Product
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (productId: string, quantity?: number) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  totalItems: number
  totalPrice: number
  isLoading: boolean
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  const refreshCart = useCallback(async () => {
    if (!user) {
      setItems([])
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch("/api/cart")
      const data = await res.json()
      setItems(data.items || [])
    } catch {
      setItems([])
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  const addToCart = async (productId: string, quantity = 1) => {
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity }),
    })

    if (res.ok) {
      await refreshCart()
    }
  }

  const removeFromCart = async (itemId: string) => {
    const res = await fetch(`/api/cart/${itemId}`, {
      method: "DELETE",
    })

    if (res.ok) {
      setItems((prev) => prev.filter((item) => item.id !== itemId))
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId)
      return
    }

    const res = await fetch(`/api/cart/${itemId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    })

    if (res.ok) {
      setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, quantity } : item)))
    }
  }

  const clearCart = async () => {
    const res = await fetch("/api/cart", { method: "DELETE" })
    if (res.ok) {
      setItems([])
    }
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isLoading,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
