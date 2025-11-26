"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export function ContactForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Message Sent",
      description: "Thank you for contacting us. We will respond shortly.",
    })

    setIsSubmitting(false)
    ;(e.target as HTMLFormElement).reset()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-foreground">
            First Name
          </Label>
          <Input
            id="firstName"
            name="firstName"
            required
            className="bg-background border-border focus:border-[#D4AF37] focus:ring-[#D4AF37]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-foreground">
            Last Name
          </Label>
          <Input
            id="lastName"
            name="lastName"
            required
            className="bg-background border-border focus:border-[#D4AF37] focus:ring-[#D4AF37]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          className="bg-background border-border focus:border-[#D4AF37] focus:ring-[#D4AF37]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject" className="text-foreground">
          Subject
        </Label>
        <Input
          id="subject"
          name="subject"
          required
          className="bg-background border-border focus:border-[#D4AF37] focus:ring-[#D4AF37]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-foreground">
          Message
        </Label>
        <Textarea
          id="message"
          name="message"
          rows={5}
          required
          className="bg-background border-border focus:border-[#D4AF37] focus:ring-[#D4AF37]"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full gold-gradient text-primary-foreground py-6 text-sm tracking-widest uppercase hover:opacity-90 transition-opacity"
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  )
}
