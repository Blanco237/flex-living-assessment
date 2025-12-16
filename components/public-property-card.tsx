"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Property } from "@/types"
import { Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface PublicPropertyCardProps {
  property: Property
}

export function PublicPropertyCard({ property }: PublicPropertyCardProps) {
  const imageUrl = property.listingImages?.[0]?.url || "/modern-city-apartment.png"

  const amenities = property.listingAmenities?.slice(0, 3).map((a) => a.amenityName) || []

  return (
    <Link href={`/properties/${property.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all cursor-pointer border-0">
        <div className="relative h-[320px] w-full overflow-hidden rounded-2xl">
          <Image src={imageUrl || "/placeholder.svg"} alt={property.name} fill className="object-cover" />

          <div className="absolute top-4 left-4">
            <Badge className="bg-red-600 hover:bg-red-700 text-white border-0 rounded-full px-4 py-1">
              All listings
            </Badge>
          </div>

          {property.averageReviewRating > 0 && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-slate-700 hover:bg-slate-800 text-white border-0 rounded-full px-4 py-1 flex items-center gap-1">
                {property.averageReviewRating.toFixed(2)}
                <Star className="h-3 w-3 fill-white" />
              </Badge>
            </div>
          )}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {[...Array(Math.min(5, property.listingImages?.length || 1))].map((_, i) => (
              <div key={i} className={`h-1.5 w-1.5 rounded-full ${i === 0 ? "bg-white" : "bg-white/50"}`} />
            ))}
          </div>
        </div>

        <div className="p-5 space-y-3">
          <h3 className="font-semibold text-lg line-clamp-2">{property.name}</h3>

          <div className="text-sm text-gray-600">
            {property.personCapacity} guests · {property.bedroomsNumber} bedroom
            {property.bedroomsNumber !== 1 ? "s" : ""} · {property.bathroomsNumber} bathroom
            {property.bathroomsNumber !== 1 ? "s" : ""}
          </div>

          <div className="flex flex-wrap gap-2">
            {amenities.map((amenity, index) => (
              <Badge
                key={index}
                variant="outline"
                className="rounded-full px-3 py-1 text-xs font-normal border-gray-300 bg-white"
              >
                {amenity}
              </Badge>
            ))}
          </div>
        </div>
      </Card>
    </Link>
  )
}
