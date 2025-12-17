"use server";

import axios, { AxiosError } from "axios";
import type {
  GooglePlace,
  GoogleReview,
  HostawayReview,
  Property,
  Review,
} from "@/types";
import APP_CONSTANTS from "@/lib/constants";
import { fetchProperty } from "./properties";

export async function fetchReviews(propertyId: string): Promise<Review[]> {
  try {
    const [hostaway, google] = await Promise.all([
      getHostawayReviews(propertyId),
      getGoogleReviews(propertyId),
    ]);

    return [...hostaway, ...google];
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw new Error("Failed to fetch reviews");
  }
}

async function getHostawayReviews(propertyId: string) {
  const response = await axios.get(APP_CONSTANTS.MOCKAROO.ENDPOINT || "", {
    params: {
      key: APP_CONSTANTS.MOCKAROO.KEY,
    },
  });

  const hostawayReviews: HostawayReview[] = response.data || [];

  const filteredReviews = hostawayReviews
    .filter((review) => review.listingMapId === Number.parseInt(propertyId))
    .map((review) => ({
      id: Number(review.id),
      propertyId: review.listingMapId,
      propertyName: review.listingName,
      source: "hostaway" as const,
      rating: review.rating || calculateAverageRating(review.reviewCategory),
      review: review.publicReview || "",
      guestName: review.guestName,
      submittedAt: review.submittedAt,
      categories: review.reviewCategory,
    }));

  return filteredReviews;
}

async function getGoogleReviews(propertyId: string): Promise<Review[]> {
  const property = await fetchProperty(propertyId);

  if (!property) {
    return [];
  }

  const apiKey = APP_CONSTANTS.GOOGLE_PLACES.API_KEY;
  if (!apiKey) {
    console.warn("Google Places API key not configured");
    return [];
  }

  const placeId = await findPlaceId(property, apiKey);
  if (!placeId) {
    return [];
  }

  try {
    const response = await axios.get(
      `${APP_CONSTANTS.GOOGLE_PLACES.BASE_URL}/${placeId}`,
      {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "reviews,rating,displayName",
        },
      }
    );

    const reviews: GoogleReview[] = response.data?.reviews || [];

    return reviews.map((review) => ({
      id: review.name,
      propertyId: Number(propertyId),
      propertyName: property.name,
      source: "google" as const,
      rating: review.rating || 0,
      review: review.text.text || "",
      guestName: review.authorAttribution.displayName || "Anonymous",
      submittedAt: review.publishTime,
      categories: undefined,
    }));
  } catch (error) {
    console.error('Error Getting Google Reviews', error)
    return [];
  }
}

async function findPlaceId(
  property: Property,
  apiKey: string
): Promise<string | null> {
  try {
    const searchQuery = `${property.name} ${
      property.address || property.publicAddress || ""
    } ${property.city || ""}`;

    const response = await axios.post(
      `
      ${APP_CONSTANTS.GOOGLE_PLACES.BASE_URL}:searchText`,
      {
        textQuery: searchQuery,
        locationBias: {
          circle: {
            center: {
              latitude: property.lat,
              longitude: property.lng,
            },
            radius: 500.0,
          },
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "places.displayName,places.id",
        },
      }
    );

    const places: GooglePlace[] = response.data.places;
    if (!places || places.length === 0) {
      return null;
    }
    const place = places[0];
    return place.id;
  } catch (error) {
    console.error('Error Getting Place Id', error)
    return null;
  }
}

function calculateAverageRating(categories: any[] = []): number {
  if (!categories || categories?.length === 0) return 0;
  const sum = categories.reduce(
    (acc: number, cat: any) => acc + (cat.rating || 0),
    0
  );
  return Math.round((sum / categories.length) * 10) / 10;
}
