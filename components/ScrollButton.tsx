"use client"

import { ChevronDown } from "lucide-react"

export default function ScrollButton() {
  const handleScroll = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    })
  }

  return (
    <button
      onClick={handleScroll}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 
                 text-gray-400 hover:text-amber-400 transition-colors 
                 duration-300 animate-bounce"
      aria-label="Scroll down"
    >
      <ChevronDown size={32} />
    </button>
  )
}
