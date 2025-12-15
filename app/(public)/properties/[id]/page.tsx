"use client"

import { use, useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useReviews } from "@/hooks/use-reviews"
import { getAllReviewStatuses } from "@/lib/review-storage"
import { PublicReviewCard } from "@/components/public-review-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Property } from "@/types"
import { getPropertyTypeLabel } from "@/lib/property-utils"
import { Star, BedDouble, Users, Bath, MapPin, ArrowLeft, Wifi } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Loader2 } from "lucide-react"

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  const { data: property, isLoading: propertyLoading } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const response = await fetch("/api/properties")
      if (!response.ok) throw new Error("Failed to fetch properties")
      const data = await response.json()
      const properties: Property[] = data.result
      return properties.find((p) => p.id === Number.parseInt(id))
    },
  })

  const { data: allReviews } = useReviews(id)
  const [approvedReviews, setApprovedReviews] = useState<typeof allReviews>([])

  useEffect(() => {
    if (allReviews) {
      const statuses = getAllReviewStatuses()
      const approved = allReviews.filter((review) => {
        const status = statuses.find((s) => s.reviewId === review.id)
        return status?.status === "approved"
      })
      setApprovedReviews(approved)
    }
  }, [allReviews])

  if (propertyLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Property not found</h1>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  const mainImage = property.listingImages?.[0]?.url || "/modern-city-apartment.png"
  const averageRating = approvedReviews?.length
    ? approvedReviews.reduce((acc, r) => acc + r.rating, 0) / approvedReviews.length
    : property.averageReviewRating

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            FlexLiving
          </Link>
          <Link href="/manager">
            <Button variant="outline">Manager Dashboard</Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Properties
          </Button>
        </Link>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="relative h-[400px] w-full">
            <Image src={mainImage || "/placeholder.svg"} alt={property.name} fill className="object-cover" />
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-lg py-2 px-4">
                {getPropertyTypeLabel(property.propertyTypeId)}
              </Badge>
            </div>
          </div>

          <div className="p-8">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{property.name}</h1>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                  <span className="text-lg">{property.publicAddress}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">£{property.price}</div>
                <div className="text-muted-foreground">per night</div>
              </div>
            </div>

            <div className="flex items-center gap-6 py-6 border-y">
              <div className="flex items-center gap-2">
                <BedDouble className="h-5 w-5 text-muted-foreground" />
                <span className="text-lg">
                  {property.bedroomsNumber} Bedroom{property.bedroomsNumber !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="h-5 w-5 text-muted-foreground" />
                <span className="text-lg">
                  {property.bathroomsNumber} Bathroom{property.bathroomsNumber !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span className="text-lg">Up to {property.personCapacity} guests</span>
              </div>
              {averageRating > 0 && (
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-medium">{averageRating.toFixed(1)}</span>
                </div>
              )}
            </div>

            <div className="py-6">
              <h2 className="text-xl font-bold mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{property.description}</p>
            </div>

            {property.listingAmenities && property.listingAmenities.length > 0 && (
              <div className="py-6 border-t">
                <h2 className="text-xl font-bold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.listingAmenities.slice(0, 6).map((amenity) => (
                    <div key={amenity.id} className="flex items-center gap-2">
                      <Wifi className="h-4 w-4 text-muted-foreground" />
                      <span>{amenity.amenityName}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {approvedReviews && approvedReviews.length > 0 && (
              <div className="py-6 border-t">
                <h2 className="text-xl font-bold mb-6">Guest Reviews ({approvedReviews.length})</h2>
                <div className="grid gap-4">
                  {approvedReviews.map((review) => (
                    <PublicReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </div>
            )}

            <div className="pt-6 border-t">
              <Button size="lg" className="w-full md:w-auto px-12">
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
