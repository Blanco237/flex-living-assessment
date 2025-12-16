"use client"

import { useState } from "react"
import { useProperties } from "@/hooks/use-properties"
import { PublicPropertyCard } from "@/components/public-property-card"
import { filterProperties } from "@/lib/property-utils"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HeroSection } from "@/components/hero-section"

export default function HomePage() {
  const { data: properties, isLoading } = useProperties()

  const [propertyType, setPropertyType] = useState("all")
  const [maxPrice, setMaxPrice] = useState(500)
  const [amenities, setAmenities] = useState<string[]>([])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const filteredProperties = properties
    ? filterProperties(properties, {
        propertyType: propertyType === "all" ? undefined : propertyType,
      }).filter((p) => p.price <= maxPrice)
    : []

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            FlexLiving
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/manager">
              <Button variant="outline">Manager Dashboard</Button>
            </Link>
          </div>
        </div>
      </nav>

      <HeroSection />

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">Our top properties</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {filteredProperties.map((property) => (
            <PublicPropertyCard key={property.id} property={property} />
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No properties found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}
