import { fetchProperties } from "@/actions/properties";
import { fetchReviews } from "@/actions/reviews";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const properties = await fetchProperties();
    const reviews = await Promise.all(
      properties.map((property) => fetchReviews(String(property.id)))
    );
    
    return NextResponse.json({
      status: "success",
      result: reviews?.flat() || []
    })
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
