"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type Testimonial = {
  id: string
  quote: string
  author: string
  title: string
  rating: number
  approved: boolean
  createdAt: string
}

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  useEffect(() => {
    if (testimonials.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [testimonials.length])

  const fetchTestimonials = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/testimonials")
      if (!res.ok) throw new Error("Failed to load testimonials")
      const data = await res.json()
      const approvedTestimonials = (data.testimonials || []).filter(
        (t: Testimonial) => t.approved
      )
      setTestimonials(approvedTestimonials)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <section className="py-24 lg:py-32 bg-black">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 mx-auto mb-8 rounded-full bg-gradient-to-br from-purple-500/20 to-amber-500/20 flex items-center justify-center">
              <Quote className="text-purple-400" size={28} />
            </div>
            <p className="text-gray-500">Loading testimonials...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-24 lg:py-32 bg-black">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  if (testimonials.length === 0) {
    return null
  }

  return (
    <section className="py-24 lg:py-32 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-purple-950/20 via-black to-amber-950/20" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-amber-400">
                What Our Clients Say
              </span>
            </h2>
          </div>

          <div className="relative mb-12">
            <div className="bg-zinc-950/80 backdrop-blur-sm border border-purple-400/20 rounded-2xl p-8 md:p-12 lg:p-16 shadow-2xl shadow-purple-500/10">
              <div className="relative min-h-[300px]">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={testimonial.id}
                    className={`transition-all duration-500 absolute inset-0 ${
                      currentIndex === index
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4 pointer-events-none"
                    }`}
                  >
                    <div className="mb-6">
                      <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-500/20 to-amber-500/20 flex items-center justify-center">
                        <Quote className="text-purple-400" size={24} />
                      </div>
                    </div>
                    
                    <blockquote className="text-xl md:text-2xl lg:text-3xl font-light leading-relaxed mb-8 text-gray-200">
                      &ldquo;{testimonial.quote}&rdquo;
                    </blockquote>
                    
                    <div className="flex items-center gap-1 mb-8">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`text-2xl transition-colors ${
                            i < testimonial.rating ? "text-amber-400" : "text-gray-700"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 pt-6 border-t border-purple-400/20">
                      <Avatar className="h-14 w-14 border-2 border-purple-400/30">
                        <AvatarFallback className="bg-linear-to-br from-purple-600 to-amber-500 text-white font-bold text-lg">
                          {getInitials(testimonial.author)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <cite className="not-italic">
                        <div className="text-lg font-semibold text-transparent bg-clip-text bg-linear-to-r from-purple-300 to-amber-300">
                          {testimonial.author}
                        </div>
                        <div className="text-gray-400 text-sm mt-1">
                          {testimonial.title}
                        </div>
                      </cite>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation controls */}
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 border-2 border-purple-400/30 hover:border-purple-400 hover:bg-purple-500/10 rounded-full transition-all duration-300 flex items-center justify-center group"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="text-gray-400 group-hover:text-purple-400 transition-colors" size={20} />
            </button>
            
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentIndex === index
                      ? "bg-linear-to-r from-purple-500 to-amber-500 w-8 shadow-lg shadow-purple-500/50"
                      : "bg-gray-700 hover:bg-gray-600 w-2"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <button
              onClick={nextTestimonial}
              className="w-12 h-12 border-2 border-amber-400/30 hover:border-amber-400 hover:bg-amber-500/10 rounded-full transition-all duration-300 flex items-center justify-center group"
              aria-label="Next testimonial"
            >
              <ChevronRight className="text-gray-400 group-hover:text-amber-400 transition-colors" size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}