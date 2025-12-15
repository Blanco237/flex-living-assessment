"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { isManagerAuthenticated } from "@/lib/manager-auth"
import { Loader2 } from "lucide-react"

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const isLoginPage = pathname === "/manager/login"

  useEffect(() => {
    // Skip auth check on login page
    if (isLoginPage) return

    // Check authentication
    if (!isManagerAuthenticated()) {
      router.push("/manager/login")
    }
  }, [router, isLoginPage])

  // Show loading state while checking auth on protected pages
  if (!isLoginPage && typeof window !== "undefined" && !isManagerAuthenticated()) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return <>{children}</>
}
