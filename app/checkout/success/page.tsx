import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react"

export const metadata = {
  title: "Order Confirmed | ESSCERA",
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <section className="py-24">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto rounded-full bg-green-500/10 flex items-center justify-center mb-6">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-4">Thank You!</h1>
              <p className="text-xl text-muted-foreground">Your order has been confirmed</p>
            </div>

            <div className="bg-secondary p-8 rounded-lg mb-8">
              <p className="text-muted-foreground mb-4">
                We&apos;ve received your order and will begin processing it shortly. You will receive an email
                confirmation with your order details.
              </p>
              <div className="border-t border-border pt-4 mt-4">
                <p className="text-sm text-muted-foreground">
                  Order Number:{" "}
                  <span className="text-foreground font-medium">#LP{Date.now().toString().slice(-8)}</span>
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href="/shop">
                  <Button
                    variant="outline"
                    className="w-full border-border hover:border-[#D4AF37] hover:text-[#D4AF37] bg-transparent"
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Continue Shopping
                  </Button>
                </Link>
                <Link href="/">
                  <Button className="w-full gold-gradient text-primary-foreground">
                    Back to Home
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">Your order is protected by</p>
              <div className="flex justify-center gap-8">
                <div className="text-center">
                  <p className="text-sm font-medium text-[#D4AF37]">Secure Payment</p>
                  <p className="text-xs text-muted-foreground">256-bit SSL</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-[#D4AF37]">Easy Returns</p>
                  <p className="text-xs text-muted-foreground">30-day policy</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-[#D4AF37]">Gift Wrapping</p>
                  <p className="text-xs text-muted-foreground">Complimentary</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
