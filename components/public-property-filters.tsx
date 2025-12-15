"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

interface PublicPropertyFiltersProps {
  propertyType: string
  maxPrice: number
  amenities: string[]
  onPropertyTypeChange: (value: string) => void
  onMaxPriceChange: (value: number) => void
  onAmenitiesChange: (amenities: string[]) => void
}

export function PublicPropertyFilters({
  propertyType,
  maxPrice,
  onPropertyTypeChange,
  onMaxPriceChange,
}: PublicPropertyFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
      <div className="space-y-2">
        <Label htmlFor="public-property-type">Property Type</Label>
        <Select value={propertyType} onValueChange={onPropertyTypeChange}>
          <SelectTrigger id="public-property-type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="apartment">Apartment</SelectItem>
            <SelectItem value="house">House</SelectItem>
            <SelectItem value="studio">Studio</SelectItem>
            <SelectItem value="villa">Villa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="max-price">Max Price: £{maxPrice}/night</Label>
        <Slider
          id="max-price"
          min={50}
          max={500}
          step={10}
          value={[maxPrice]}
          onValueChange={(values) => onMaxPriceChange(values[0])}
          className="mt-2"
        />
      </div>

      <div className="space-y-2">
        <Label>Sort By</Label>
        <Select defaultValue="price-low">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
