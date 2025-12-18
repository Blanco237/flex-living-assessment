"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Property } from "@/types";
import { Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "nextjs-toploader/app";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from "@/components/ui/carousel";

interface PublicPropertyCardProps {
  property: Property;
}

export function PublicPropertyCard({ property }: PublicPropertyCardProps) {
  const router = useRouter();
  const images =
    property.listingImages?.map((img) => img.url).filter(Boolean) ||
    ["/modern-city-apartment.png"];

  const amenities =
    property.listingAmenities?.slice(0, 3).map((a) => a.amenityName) || [];

  const hasMultipleImages = images.length > 1;

  return (
    <Card
      className="overflow-hidden transition-all cursor-pointer border-none py-0 shadow-none hover:shadow-lg hover:-translate-y-1 bg-transparent group"
      onClick={() => router.push(`/properties/${property.id}`)}
    >
      <div className="relative h-[320px] w-full overflow-hidden rounded-3xl" onClick={(e) => e.stopPropagation()}>
        <Carousel className="w-full h-full">
          <CarouselContent className="h-full ml-0">
            {images.map((image, index) => (
              <CarouselItem key={index} className="pl-0 h-full relative">
                 <div className="relative w-full h-full">
                  <Image
                    src={image}
                    alt={`${property.name} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="absolute top-4 left-4 z-10">
            <Badge className="bg-[#cc1f1f] font-body hover:bg-red-700 text-white border-0 rounded-full py-1 px-3">
              All listings
            </Badge>
          </div>

          {property.averageReviewRating > 0 && (
            <div className="absolute top-4 right-4 z-10">
              <Badge className="bg-slate-700 hover:bg-slate-800 text-white border-0 rounded-full px-4 py-1 flex items-center gap-1">
                {property.averageReviewRating.toFixed(2)}
                <Star className="h-3 w-3 fill-white" />
              </Badge>
            </div>
          )}

          {hasMultipleImages && (
            <>
              <CarouselPrevious className="left-3 bg-white/90 hover:bg-white text-slate-800 border-none opacity-0 disabled:opacity-0 group-hover:opacity-100 group-hover:disabled:opacity-50 transition-opacity duration-200" />
              <CarouselNext className="right-3 bg-white/90 hover:bg-white text-slate-800 border-none opacity-0 disabled:opacity-0 group-hover:opacity-100 group-hover:disabled:opacity-50 transition-opacity duration-200" />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <CarouselDots />
              </div>
            </>
          )}
        </Carousel>
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
