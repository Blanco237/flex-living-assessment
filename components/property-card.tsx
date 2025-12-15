"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Property, PropertyPerformance } from "@/types"
import { getPropertyTypeLabel } from "@/lib/property-utils"
import { Star, BedDouble, Users, MapPin, TrendingUp, TrendingDown, Minus } from "lucide-react"
import Image from "next/image"

interface PropertyCardProps {
  property: Property
  performance?: PropertyPerformance
  onViewReviews: (property: Property) => void
}

export function PropertyCard({ property, performance, onViewReviews }: PropertyCardProps) {
  const imageUrl = property.listingImages?.[0]?.url || "/modern-city-apartment.png"

  const getTrendIcon = () => {
    if (!performance) return null
    switch (performance.trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getTrendColor = () => {
    if (!performance) return "secondary"
    switch (performance.trend) {
      case "up":
        return "default"
      case "down":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full overflow-hidden">
        <Image src={imageUrl || "/placeholder.svg"} alt={property.name} fill className="object-cover" />
        <div className="absolute top-3 right-3 flex gap-2">
          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
            {getPropertyTypeLabel(property.propertyTypeId)}
          </Badge>
          {property.averageReviewRating > 0 && (
            <Badge variant="default" className="bg-white/90 backdrop-blur-sm text-gray-900 gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              {property.averageReviewRating}
            </Badge>
          )}
        </div>
      </div>

      <CardHeader>
        <CardTitle className="text-lg line-clamp-1">{property.name}</CardTitle>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span className="line-clamp-1">
            {property.city}, {property.country}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <BedDouble className="h-4 w-4" />
            <span>{property.bedroomsNumber} bed</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{property.personCapacity} guests</span>
          </div>
        </div>

        {performance && (
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="text-sm">
              <span className="text-muted-foreground">Performance:</span>
            </div>
            <Badge variant={getTrendColor()} className="gap-1">
              {getTrendIcon()}
              {performance.percentageChange > 0 ? "+" : ""}
              {performance.percentageChange}%
            </Badge>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div>
            <span className="text-2xl font-bold">£{property.price}</span>
            <span className="text-sm text-muted-foreground">/night</span>
          </div>
          <Button onClick={() => onViewReviews(property)} variant="default">
            View Reviews
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
