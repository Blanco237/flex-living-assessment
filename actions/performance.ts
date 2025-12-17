"use server";

import dayjs from "dayjs";

import { fetchProperties } from "./properties";
import { fetchReservations } from "./reservations";
import type { PropertyPerformance } from "@/types";
import { groupBy } from "@/lib/utils";

export async function fetchPerformance(): Promise<PropertyPerformance[]> {
  try {
    const now = dayjs();
    const currentMonthStart = now.startOf("month");
    const previousMonthStart = currentMonthStart.subtract(1, "month");
    const currentMonthKey = currentMonthStart.format("YYYY-MM");
    const previousMonthKey = previousMonthStart.format("YYYY-MM");

    const [properties, reservations] = await Promise.all([
      fetchProperties(),
      fetchReservations({ arrivalStartDate: previousMonthStart.format() }),
    ]);

    const reservationsByListingId = groupBy(
      reservations,
      (reservation) => reservation.listingMapId
    );

    const performance: PropertyPerformance[] = properties.map((property) => {
      const propertyReservations = reservationsByListingId[property.id] ?? [];

      const reservationsByMonth = groupBy(propertyReservations, (reservation) =>
        dayjs(reservation.arrivalDate).format("YYYY-MM")
      );

      const currentPeriodReservations =
        reservationsByMonth[currentMonthKey] ?? [];
      const previousPeriodReservations =
        reservationsByMonth[previousMonthKey] ?? [];

      const currentRevenue = currentPeriodReservations.reduce(
        (sum, reservation) => sum + (reservation.totalPrice || 0),
        0
      );
      const previousRevenue = previousPeriodReservations.reduce(
        (sum, reservation) => sum + (reservation.totalPrice || 0),
        0
      );

      const percentageChange =
        previousRevenue === 0
          ? 100
          : ((currentRevenue - previousRevenue) / previousRevenue) * 100;

      const trend: PropertyPerformance["trend"] =
        percentageChange > 0 ? "up" : percentageChange < 0 ? "down" : "stable";

      return {
        propertyId: property.id,
        currentMonthRevenue: currentRevenue,
        previousMonthRevenue: previousRevenue,
        percentageChange: Math.round(Math.abs(percentageChange)),
        trend,
      };
    });

    return performance;
  } catch (error) {
    console.error("Error calculating performance:", error);
    throw new Error("Failed to calculate performance");
  }
}
