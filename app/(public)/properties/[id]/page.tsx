"use client"

import { use, useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useReviews, useAllReviewStatuses } from "@/hooks/use-reviews"
import { PublicReviewCard } from "@/components/public-review-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { Property } from "@/types"
import { Star, Calendar, Users2 } from "lucide-react"
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
  const { data: statuses } = useAllReviewStatuses(id)
  const [approvedReviews, setApprovedReviews] = useState<typeof allReviews>([])

  useEffect(() => {
    if (allReviews && statuses) {
      const approved = allReviews.filter((review) => {
        const statusRecord = statuses.find((s) => s.reviewId === review.id)
        return statusRecord?.status === "approved"
      })
      setApprovedReviews(approved)
    }
  }, [allReviews, statuses])

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

  const images = property.listingImages || []
  const mainImage = images[0]?.url || "/modern-city-apartment.png"
  const gridImages = images.slice(1, 5)
  const totalPhotos = images.length

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

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-8">
          <div className="relative h-[500px] rounded-2xl overflow-hidden">
            <Image src={mainImage || "/placeholder.svg"} alt={property.name} fill className="object-cover" />

            <div className="absolute top-4 left-4">
              <Badge className="bg-red-600 hover:bg-red-700 text-white border-0 rounded-full px-4 py-1">
                All listings
              </Badge>
            </div>

            {averageRating > 0 && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-slate-700 hover:bg-slate-800 text-white border-0 rounded-full px-4 py-1 flex items-center gap-1">
                  {averageRating.toFixed(2)}
                  <Star className="h-3 w-3 fill-white" />
                </Badge>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {gridImages.map((image, index) => (
              <div
                key={index}
                className={`relative ${index === 3 ? "h-[245px]" : "h-[245px]"} rounded-xl overflow-hidden`}
              >
                <Image
                  src={image.url || "/placeholder.svg"}
                  alt={`${property.name} ${index + 2}`}
                  fill
                  className="object-cover"
                />

                {index === 3 && totalPhotos > 5 && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Button variant="secondary" className="gap-2">
                      <span className="text-lg font-semibold">+ {totalPhotos - 5} photos</span>
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{property.name}</h1>

              <div className="text-gray-600 mb-4">
                Apartment · {property.personCapacity} guests · {property.bedroomsNumber} bedroom ·{" "}
                {property.bathroomsNumber} bathroom
              </div>

              {averageRating > 0 && (
                <div className="flex items-center gap-2 mb-6">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{averageRating.toFixed(2)}</span>
                  <span className="text-blue-600 underline cursor-pointer">{approvedReviews?.length || 0} reviews</span>
                </div>
              )}
            </div>

            <div>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>

              <Button variant="ghost" className="mt-4 px-0 font-semibold">
                Show more
              </Button>
            </div>

            {approvedReviews && approvedReviews.length > 0 && (
              <div className="pt-6 border-t">
                <h2 className="text-xl font-bold mb-6">Guest Reviews</h2>
                <div className="grid gap-4">
                  {approvedReviews.map((review) => (
                    <PublicReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24 border shadow-lg">
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600 mb-4">
                  Select dates and number of guests to see the total price per night
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 border rounded-lg p-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Select Dates"
                    className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    readOnly
                  />
                </div>

                <div className="flex items-center gap-2 border rounded-lg p-3">
                  <Users2 className="h-5 w-5 text-gray-400" />
                  <Input
                    type="number"
                    defaultValue={1}
                    min={1}
                    max={property.personCapacity}
                    className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>

                <Button className="w-full h-12 text-base font-semibold">Send Inquiry</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
