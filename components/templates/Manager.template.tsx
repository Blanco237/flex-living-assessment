"use client";

import { useState } from "react";
import { useProperties, usePropertyPerformance } from "@/hooks/use-properties";
import { PropertyCard } from "@/components/property-card";
import { Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "nextjs-toploader/app";

export default function ManagerTemplate() {
  const router = useRouter();
  const { data: properties, isLoading: propertiesLoading } = useQuery(
    useProperties()
  );
  const { data: performance } = useQuery(usePropertyPerformance());



  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/manager/login");
    router.refresh();
  };

  if (propertiesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold">Manager Dashboard</h1>
            <Button variant="outline" onClick={handleLogout} size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
          <p className="text-muted-foreground">
            Manage properties and review performance
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties?.map((property) => {
            const propertyPerformance = performance?.find(
              (p) => p.propertyId === property.id
            );
            return (
              <PropertyCard
                key={property.id}
                property={property}
                performance={propertyPerformance}
              />
            );
          })}
        </div>

        {properties?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No properties found matching your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
