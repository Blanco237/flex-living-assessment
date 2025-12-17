"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Property } from "@/types";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "nextjs-toploader/app";

interface PublicPropertyCardProps {
  property: Property;
}

export function PublicPropertyCard({ property }: PublicPropertyCardProps) {
  const router = useRouter();
  const images =
    property.listingImages?.map((img) => img.url).filter(Boolean) ||
    ["/modern-city-apartment.png"];
  const [currentImage, setCurrentImage] = useState(0);

  const amenities =
    property.listingAmenities?.slice(0, 3).map((a) => a.amenityName) || [];

  const hasMultipleImages = images.length > 1;

  const goToPrev = (event: React.MouseEvent) => {
    event.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = (event: React.MouseEvent) => {
    event.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % images.length);
  };


  return (
    <Card
      className="overflow-hidden transition-all cursor-pointer border-none py-0 shadow-none hover:shadow-lg hover:-translate-y-1 bg-transparent"
      onClick={() => router.push(`/properties/${property.id}`)}
    >
      <div className="relative h-[320px] w-full overflow-hidden rounded-3xl group">
        <Image
          src={images[currentImage] || "/placeholder.svg"}
          alt={property.name}
          fill
          className="object-cover"
        />

        <div className="absolute top-4 left-4">
          <Badge className="bg-[#cc1f1f] font-body hover:bg-red-700 text-white border-0 rounded-full py-1 px-3">
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

        {hasMultipleImages && (
          <>
            <button
              type="button"
              onClick={goToPrev}
              className="cursor-pointer absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-sm hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={goToNext}
              className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-sm hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {images.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                i === currentImage ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="p-5 space-y-3">
        <h3 className="font-semibold text-lg line-clamp-2">{property.name}</h3>

        <div className="text-sm text-gray-600">
          {property.personCapacity} guests · {property.bedroomsNumber} bedroom
          {property.bedroomsNumber !== 1 ? "s" : ""} ·{" "}
          {property.bathroomsNumber} bathroom
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
  );
}
