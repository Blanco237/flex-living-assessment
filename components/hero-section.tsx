"use client"

import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export function HeroSection() {
  return (
    <div className="relative h-[500px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("/modern-luxury-apartment-building-exterior.jpg")',
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-balance">Find Your Perfect Stay</h1>
        <p className="text-xl md:text-2xl mb-8 text-balance">Discover amazing properties in the heart of London</p>
      </div>
    </div>
  )
}
