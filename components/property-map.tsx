"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  propertyName: string;
  address?: string;
}

export default function PropertyMap({
  latitude,
  longitude,
  propertyName,
  address,
}: PropertyMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<L.Circle | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView(
        [latitude, longitude],
        15
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);

      // Add large semi-transparent red circle overlay
      circleRef.current = L.circle([latitude, longitude], {
        radius: 300, // 300 meters radius
        fillColor: "#dc2626",
        fillOpacity: 0.2,
        color: "#dc2626",
        weight: 2,
        opacity: 0.4,
      })
        .addTo(mapRef.current)
        .bindPopup(
          `<strong>${propertyName}</strong>${address ? `<br>${address}` : ""}`
        );
    } else {
      // Update map view if coordinates change
      mapRef.current.setView([latitude, longitude], 15);
      if (circleRef.current) {
        circleRef.current.setLatLng([latitude, longitude]);
        circleRef.current.setPopupContent(
          `<strong>${propertyName}</strong>${address ? `<br>${address}` : ""}`
        );
      }
    }

    // Cleanup
    return () => {
      if (mapRef.current) {
        if (circleRef.current) {
          mapRef.current.removeLayer(circleRef.current);
          circleRef.current = null;
        }
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [latitude, longitude, propertyName, address]);


  return (
    <div
      ref={mapContainerRef}
      className="w-full h-[400px] rounded-lg overflow-hidden"
    />
  );
}
