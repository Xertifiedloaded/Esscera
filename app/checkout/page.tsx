"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, MessageCircle, ArrowLeft, Lock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const [paymentMethod, setPaymentMethod] = useState<"STRIPE" | "WHATSAPP">("STRIPE")
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  })

  const shippingCost = totalPrice >= 200 ? 0 : 20
  const finalTotal = totalPrice + shippingCost
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to place an order.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    setIsProcessing(true)

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          paymentMethod,
        }),
      })

      if (res.ok) {
        if (paymentMethod === "WHATSAPP") {
          const orderSummary = items
            .map((item) => `${item.product.name} x${item.quantity} - $${item.product.price * item.quantity}`)
            .join("%0A")

          const message = `*New Order *%0A%0A*Customer:* ${formData.firstName} ${formData.lastName}%0A*Email:* ${formData.email}%0A*Phone:* ${formData.phone}%0A*Address:* ${formData.address}, ${formData.city}%0A%0A*Order:*%0A${orderSummary}%0A%0A*Total:* $${finalTotal}`

          window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
        }

        await clearCart()
        router.push("/checkout/success")
      } else {
        const data = await res.json()
        toast({
          title: "Error",
          description: data.error || "Failed to place order.",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to place order.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
            <h1 className="text-2xl font-bold text-foreground mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">Add some products to proceed to checkout.</p>
            <Link href="/shop">
              <Button className="gold-gradient text-primary-foreground">Browse Products</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <section className="py-8 bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/cart" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-foreground">Contact Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="bg-secondary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className="bg-secondary"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="bg-secondary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="bg-secondary"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-foreground">Shipping Address</h2>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="bg-secondary"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="bg-secondary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input
                          id="postalCode"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          required
                          className="bg-secondary"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        className="bg-secondary"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-foreground">Payment Method</h2>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={(value) => setPaymentMethod(value as "STRIPE" | "WHATSAPP")}
                      className="space-y-3"
                    >
                      <div
                        className={`flex items-center space-x-4 p-4 rounded-lg border cursor-pointer transition-colors ${paymentMethod === "STRIPE" ? "border-[#D4AF37] bg-[#D4AF37]/5" : "border-border"
                          }`}
                      >
                        <RadioGroupItem value="STRIPE" id="stripe" />
                        <Label htmlFor="stripe" className="flex items-center gap-3 cursor-pointer flex-1">
                          <CreditCard className="h-5 w-5 text-[#D4AF37]" />
                          <div>
                            <p className="font-medium text-foreground">Credit Card (Stripe)</p>
                            <p className="text-sm text-muted-foreground">Secure payment via Stripe</p>
                          </div>
                        </Label>
                      </div>
                      <div
                        className={`flex items-center space-x-4 p-4 rounded-lg border cursor-pointer transition-colors ${paymentMethod === "WHATSAPP" ? "border-[#D4AF37] bg-[#D4AF37]/5" : "border-border"
                          }`}
                      >
                        <RadioGroupItem value="WHATSAPP" id="whatsapp" />
                        <Label htmlFor="whatsapp" className="flex items-center gap-3 cursor-pointer flex-1">
                          <MessageCircle className="h-5 w-5 text-green-500" />
                          <div>
                            <p className="font-medium text-foreground">WhatsApp Order</p>
                            <p className="text-sm text-muted-foreground">Complete order via WhatsApp</p>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div>
                  <div className="bg-secondary p-6 rounded-lg sticky top-24">
                    <h2 className="text-xl font-semibold text-foreground mb-6">Order Summary</h2>
                    <div className="space-y-4 mb-6">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          <div className="relative w-16 h-20 rounded overflow-hidden shrink-0">
                            <Image
                              src={item.product.image || "/placeholder.svg"}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{item.product.name}</p>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-medium text-foreground">${item.product.price * item.quantity}</p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3 border-t border-border pt-4 mb-6">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal</span>
                        <span>${totalPrice}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Shipping</span>
                        <span>{shippingCost === 0 ? "Free" : `$${shippingCost}`}</span>
                      </div>
                      <div className="flex justify-between text-lg font-semibold text-foreground pt-2 border-t border-border">
                        <span>Total</span>
                        <span className="gold-text">${finalTotal}</span>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full gold-gradient text-primary-foreground py-6 text-sm tracking-widest uppercase hover:opacity-90 transition-opacity"
                    >
                      {isProcessing ? (
                        "Processing..."
                      ) : paymentMethod === "STRIPE" ? (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          Pay ${finalTotal}
                        </>
                      ) : (
                        <>
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Order via WhatsApp
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center mt-4">
                      Your payment is secured with SSL encryption
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
