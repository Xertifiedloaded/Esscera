"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle } from "lucide-react"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubmitted(true)
      setEmail("")
    }
  }
  return (
    <section className="py-24 lg:py-32 bg-background relative overflow-hidden">

      <div className="absolute top-0 left-0 w-96 h-96 gold-gradient opacity-5 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 gold-gradient opacity-5 blur-3xl rounded-full translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-gold text-sm tracking-[0.3em] uppercase mb-4 block">Stay Connected</span>
          <h2 className="text-4xl md:text-5xl font-light mb-6">
            Join the <span className="gold-text font-semibold">Inner Circle</span>
          </h2>
          <p className="text-muted-foreground mb-10 leading-relaxed">
            Be the first to discover new fragrances, exclusive offers, and behind-the-scenes stories from the world of
            Lumière.
          </p>

          {isSubmitted ? (
            <div className="flex items-center justify-center gap-3 text-gold">
              <CheckCircle size={24} />
              <span className="text-lg">Welcome to the Lumière family. Check your inbox for a special gift.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-card border-border focus:border-gold h-12 px-4"
              />
              <Button
                type="submit"
                className="bg-gold hover:bg-gold-dark text-background font-medium tracking-widest uppercase px-8 h-12 transition-all duration-300"
              >
                Subscribe
              </Button>
            </form>
          )}

          <p className="text-xs text-muted-foreground mt-6">
            By subscribing, you agree to our Privacy Policy and consent to receive updates.
          </p>
        </div>
      </div>
    </section>
  )
}
