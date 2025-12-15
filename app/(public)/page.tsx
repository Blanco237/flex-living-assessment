"use client"

import { useState } from "react"
import { useProperties } from "@/hooks/use-properties"
import { HeroSection } from "@/components/hero-section"
import { PublicPropertyCard } from "@/components/public-property-card"
import { PublicPropertyFilters } from "@/components/public-property-filters"
import { filterProperties } from "@/lib/property-utils"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

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
    <div className="min-h-screen">
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
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-80 shrink-0">
            <PublicPropertyFilters
              propertyType={propertyType}
              maxPrice={maxPrice}
              amenities={amenities}
              onPropertyTypeChange={setPropertyType}
              onMaxPriceChange={setMaxPrice}
              onAmenitiesChange={setAmenities}
            />
          </aside>

          <main className="flex-1">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Available Properties</h2>
              <p className="text-muted-foreground">{filteredProperties.length} properties found</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <PublicPropertyCard key={property.id} property={property} />
              ))}
            </div>

            {filteredProperties.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No properties found matching your filters.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
