"use client"

import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems, isLoading } = useCart()
  const { user } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]" />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">

        <section className="relative py-16 bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-[#D4AF37] text-sm tracking-[0.3em] uppercase mb-4">Your Selection</p>
            <h1 className="text-4xl font-bold text-foreground">Shopping Cart</h1>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {!user ? (
              <div className="text-center py-16">
                <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
                <h2 className="text-2xl font-semibold text-foreground mb-4">Please login to view your cart</h2>
                <p className="text-muted-foreground mb-8">
                  Sign in to add items to your cart and complete your purchase.
                </p>
                <Link href="/login">
                  <Button className="gold-gradient text-primary-foreground px-8 py-6 text-sm tracking-widest uppercase hover:opacity-90 transition-opacity">
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
                <h2 className="text-2xl font-semibold text-foreground mb-4">Your cart is empty</h2>
                <p className="text-muted-foreground mb-8">
                  Discover our exquisite collection and find your signature scent.
                </p>
                <Link href="/shop">
                  <Button className="gold-gradient text-primary-foreground px-8 py-6 text-sm tracking-widest uppercase hover:opacity-90 transition-opacity">
                    Explore Collection
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-6 p-6 bg-secondary rounded-lg">
                      <div className="relative w-24 h-32 shrink-0 rounded overflow-hidden">
                        <Image
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-xs text-[#D4AF37] tracking-widest uppercase">{item.product.category}</p>
                          <h3 className="text-lg font-semibold text-foreground">{item.product.name}</h3>
                          <p className="text-muted-foreground">${item.product.price}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-border rounded">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2 hover:bg-background/50 transition-colors"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-4 py-2 min-w-12 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 hover:bg-background/50 transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="flex items-center gap-4">
                            <p className="font-semibold text-foreground">${item.product.price * item.quantity}</p>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-secondary p-6 rounded-lg sticky top-24">
                    <h2 className="text-xl font-semibold text-foreground mb-6">Order Summary</h2>

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal ({totalItems} items)</span>
                        <span>${totalPrice}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Shipping</span>
                        <span>{totalPrice >= 200 ? "Free" : "$20"}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Gift Wrapping</span>
                        <span>Complimentary</span>
                      </div>
                    </div>

                    <div className="border-t border-border pt-4 mb-6">
                      <div className="flex justify-between text-lg font-semibold text-foreground">
                        <span>Total</span>
                        <span className="gold-text">${totalPrice >= 200 ? totalPrice : totalPrice + 20}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Link href="/checkout" className="block">
                        <Button className="w-full gold-gradient text-primary-foreground py-6 text-sm tracking-widest uppercase hover:opacity-90 transition-opacity">
                          Proceed to Checkout
                        </Button>
                      </Link>
                      <Link href="/shop" className="block">
                        <Button
                          variant="outline"
                          className="w-full border-border text-foreground py-6 text-sm tracking-widest uppercase hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors bg-transparent"
                        >
                          Continue Shopping
                        </Button>
                      </Link>
                    </div>

                    <p className="text-xs text-muted-foreground text-center mt-4">Free shipping on orders over $200</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
