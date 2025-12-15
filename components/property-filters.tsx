"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PropertyFiltersProps {
  propertyType: string
  minRating: number
  onPropertyTypeChange: (value: string) => void
  onMinRatingChange: (value: number) => void
}

export function PropertyFilters({
  propertyType,
  minRating,
  onPropertyTypeChange,
  onMinRatingChange,
}: PropertyFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="space-y-2 min-w-[200px]">
        <Label htmlFor="property-type">Property Type</Label>
        <Select value={propertyType} onValueChange={onPropertyTypeChange}>
          <SelectTrigger id="property-type">
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

      <div className="space-y-2 min-w-[200px]">
        <Label htmlFor="min-rating">Minimum Rating</Label>
        <Select value={minRating.toString()} onValueChange={(v) => onMinRatingChange(Number.parseFloat(v))}>
          <SelectTrigger id="min-rating">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">All Ratings</SelectItem>
            <SelectItem value="3">3+ Stars</SelectItem>
            <SelectItem value="4">4+ Stars</SelectItem>
            <SelectItem value="4.5">4.5+ Stars</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
