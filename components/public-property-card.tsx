"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Property } from "@/types"
import { getPropertyTypeLabel } from "@/lib/property-utils"
import { Star, BedDouble, Users, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface PublicPropertyCardProps {
  property: Property
}

export function PublicPropertyCard({ property }: PublicPropertyCardProps) {
  const imageUrl = property.listingImages?.[0]?.url || "/modern-city-apartment.png"

  return (
    <Link href={`/properties/${property.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
        <div className="relative h-56 w-full overflow-hidden">
          <Image src={imageUrl || "/placeholder.svg"} alt={property.name} fill className="object-cover" />
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
              {getPropertyTypeLabel(property.propertyTypeId)}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">{property.name}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin className="h-3 w-3" />
              <span className="line-clamp-1">
                {property.city}, {property.country}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <BedDouble className="h-4 w-4" />
              <span>{property.bedroomsNumber} bed</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{property.personCapacity} guests</span>
            </div>
            {property.averageReviewRating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{property.averageReviewRating}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div>
              <span className="text-2xl font-bold">£{property.price}</span>
              <span className="text-sm text-muted-foreground">/night</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
