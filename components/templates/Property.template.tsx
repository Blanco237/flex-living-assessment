"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useProperty } from "@/hooks/use-properties";
import { usePropertyReviews } from "@/hooks/use-reviews";
import dynamic from "next/dynamic";
import { PublicReviewCard } from "@/components/public-review-card";
import { Badge } from "@/components/ui/badge";

const PropertyMap = dynamic(() => import("@/components/property-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] rounded-lg bg-gray-200 animate-pulse flex items-center justify-center">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
});
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Star, Calendar, Users2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { usePageTitle } from "@/hooks/use-page-title";

export default function PropertyDetailTemplate() {
  const { id } = useParams();
  const propertyId = String(id);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const { data: property, isLoading: propertyLoading } = useQuery(
    useProperty(propertyId)
  );

  const { data: approvedReviews } = useQuery(usePropertyReviews(propertyId));

  usePageTitle(property?.name)

  if (propertyLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
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
    );
  }

  const images = property.listingImages || [];
  const mainImage = images[0]?.url || "/modern-city-apartment.png";
  const gridImages = images.slice(1, 5);
  const totalPhotos = images.length;

  const averageRating = property.averageReviewRating || 0;

  const handleImageClick = () => {
    setIsImageModalOpen(true);
  };

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
          <div
            className="relative h-[500px] rounded-2xl overflow-hidden cursor-pointer"
            onClick={handleImageClick}
          >
            <Image
              src={mainImage || "/placeholder.svg"}
              alt={property.name}
              fill
              className="object-cover"
            />

            <div className="absolute top-4 left-4">
              <Badge className="bg-[#cc1f1f] font-body hover:bg-red-700 text-white border-0 rounded-full py-1 px-3">
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
                className={`relative ${
                  index === 3 ? "h-[245px]" : "h-[245px]"
                } rounded-xl overflow-hidden cursor-pointer`}
                onClick={handleImageClick}
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
                      <span className="text-lg font-semibold">
                        + {totalPhotos - 5} photos
                      </span>
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
                Apartment · {property.personCapacity} guests ·{" "}
                {property.bedroomsNumber} bedroom · {property.bathroomsNumber}{" "}
                bathroom
              </div>

              {averageRating > 0 && (
                <div className="flex items-center gap-2 mb-6">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{averageRating.toFixed(2)}</span>
                  <span className="text-blue-600 underline cursor-pointer">
                    {approvedReviews?.length || 0} reviews
                  </span>
                </div>
              )}
            </div>

            <div>
              <pre
                className={`text-gray-700 leading-relaxed whitespace-pre-wrap font-sans ${
                  !isDescriptionExpanded ? "line-clamp-4" : ""
                }`}
              >
                {property.description}
              </pre>

              <Button
                variant="ghost"
                className="mt-4 px-0 font-semibold"
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              >
                {isDescriptionExpanded ? "Show less" : "Show more"}
              </Button>
            </div>

            {approvedReviews && approvedReviews.length > 0 && (
              <div className="pt-6 border-t">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-xl font-bold">Reviews</h2>
                  <div className="flex items-center gap-2">
                    <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-semibold">
                      {averageRating.toFixed(2)} ({approvedReviews.length})
                    </span>
                  </div>
                </div>
                <div className="space-y-0">
                  {approvedReviews.slice(0, 5).map((review) => (
                    <PublicReviewCard key={review.id} review={review} />
                  ))}
                </div>
                {approvedReviews.length > 5 && (
                  <Button
                    variant="outline"
                    className="mt-6 w-fit rounded-2xl border border-gray-300 bg-transparent py-4 hover:bg-gray-50 shadow-none"
                    onClick={() => setIsReviewsModalOpen(true)}
                  >
                    Show all {approvedReviews.length} reviews
                  </Button>
                )}
              </div>
            )}

            {property.lat && property.lng && (
              <div className="pt-6 border-t isolate">
                <h2 className="text-xl font-bold mb-6">Where you'll be</h2>
                <div className="mb-4">
                  <p className="text-gray-600">
                    {property.publicAddress || property.address}
                    {property.city && `, ${property.city}`}
                    {property.country && `, ${property.country}`}
                  </p>
                </div>
                <PropertyMap
                  latitude={property.lat}
                  longitude={property.lng}
                  propertyName={property.name}
                  address={property.publicAddress || property.address}
                />
              </div>
            )}

            <Dialog
              open={isReviewsModalOpen}
              onOpenChange={setIsReviewsModalOpen}
            >
              <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    <DialogTitle className="text-2xl font-bold">
                      Reviews
                    </DialogTitle>
                    <div className="flex items-center gap-2">
                      <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                      <span className="text-lg font-semibold">
                        {averageRating?.toFixed(2) || 0} (
                        {approvedReviews?.length || 0})
                      </span>
                    </div>
                  </div>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto space-y-0 mt-4 pr-2">
                  {approvedReviews?.map((review) => (
                    <PublicReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">
                    All Photos ({images.length})
                  </DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="relative w-full h-[600px] rounded-lg overflow-hidden"
                    >
                      <Image
                        src={image.url || "/placeholder.svg"}
                        alt={`${property.name} - Photo ${index + 1}`}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24 border shadow-lg">
              <div className="text-center mb-2">
                <p className="text-sm text-gray-600">
                  Select dates and number of guests to see the total price per
                  night
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 border w-1/2 rounded-4xl px-3 py-1">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Select Dates"
                    className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    readOnly
                  />
                </div>

                <div className="flex items-center gap-2 border w-1/2 rounded-4xl px-3 py-1">
                  <Users2 className="h-5 w-5 text-gray-400" />
                  <Input
                    type="number"
                    defaultValue={1}
                    min={1}
                    max={property.personCapacity}
                    className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </div>
              <Button className="w-full font-body text-sm font-semibold py-1  bg-transparent text-black rounded-4xl border-black/10 border">
                Send Inquiry
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
