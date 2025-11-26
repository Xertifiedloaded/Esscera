import type React from "react";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/lib/cart-context";
import { AuthProvider } from "@/lib/auth-context";

import { openSans, nunito, bebas, montserrat } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "ESSCERA | Exclusive Luxury Fragrances",
  description:
    "Discover the art of luxury perfumery. Exclusive fragrances crafted for the discerning connoisseur.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`
          ${montserrat.variable}
          ${openSans.variable}
          ${nunito.variable}
          ${bebas.variable}
          font-sans antialiased bg-background text-foreground
        `}
      >
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster />
          </CartProvider>
        </AuthProvider>

        <Analytics />
      </body>
    </html>
  );
}
