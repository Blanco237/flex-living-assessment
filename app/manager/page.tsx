"use client"

import { useState } from "react"
import { useProperties, usePropertyPerformance } from "@/hooks/use-properties"
import { PropertyCard } from "@/components/property-card"
import { PropertyFilters } from "@/components/property-filters"
import { filterProperties } from "@/lib/property-utils"
import type { Property } from "@/types"
import { useRouter } from "next/navigation"
import { Loader2, LogOut } from "lucide-react"
import { clearManagerAuth } from "@/lib/manager-auth"
import { Button } from "@/components/ui/button"

export default function ManagerDashboard() {
  const router = useRouter()
  const { data: properties, isLoading: propertiesLoading } = useProperties()
  const { data: performance } = usePropertyPerformance()

  const [propertyType, setPropertyType] = useState("all")
  const [minRating, setMinRating] = useState(0)

  const handleViewReviews = (property: Property) => {
    router.push(`/manager/reviews/${property.id}`)
  }

  const handleLogout = () => {
    clearManagerAuth()
    router.push("/manager/login")
    router.refresh()
  }

  if (propertiesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const filteredProperties = properties
    ? filterProperties(properties, {
        propertyType: propertyType === "all" ? undefined : propertyType,
        minRating: minRating || undefined,
      })
    : []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold">Manager Dashboard</h1>
            <Button variant="outline" onClick={handleLogout} size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
          <p className="text-muted-foreground">Manage properties and review performance</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <PropertyFilters
            propertyType={propertyType}
            minRating={minRating}
            onPropertyTypeChange={setPropertyType}
            onMinRatingChange={setMinRating}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => {
            const propertyPerformance = performance?.find((p) => p.propertyId === property.id)
            return (
              <PropertyCard
                key={property.id}
                property={property}
                performance={propertyPerformance}
                onViewReviews={handleViewReviews}
              />
            )
          })}
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
