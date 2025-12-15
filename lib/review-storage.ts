// Client-side storage for approved/rejected reviews
export type ReviewStatus = "approved" | "rejected" | "pending"

interface ReviewStatusData {
  reviewId: string
  status: ReviewStatus
  updatedAt: string
}

const STORAGE_KEY = "flexliving_review_statuses"

export function getReviewStatus(reviewId: string): ReviewStatus {
  if (typeof window === "undefined") return "pending"

  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) return "pending"

  try {
    const statuses: ReviewStatusData[] = JSON.parse(data)
    const found = statuses.find((s) => s.reviewId === reviewId)
    return found?.status || "pending"
  } catch {
    return "pending"
  }
}

export function setReviewStatus(reviewId: string, status: ReviewStatus): void {
  if (typeof window === "undefined") return

  const data = localStorage.getItem(STORAGE_KEY)
  let statuses: ReviewStatusData[] = []

  if (data) {
    try {
      statuses = JSON.parse(data)
    } catch {
      statuses = []
    }
  }

  const existingIndex = statuses.findIndex((s) => s.reviewId === reviewId)
  const statusData: ReviewStatusData = {
    reviewId,
    status,
    updatedAt: new Date().toISOString(),
  }

  if (existingIndex >= 0) {
    statuses[existingIndex] = statusData
  } else {
    statuses.push(statusData)
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(statuses))
}

export function getAllReviewStatuses(): ReviewStatusData[] {
  if (typeof window === "undefined") return []

  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) return []

  try {
    return JSON.parse(data)
  } catch {
    return []
  }
}
