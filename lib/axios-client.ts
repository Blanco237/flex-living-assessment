import axios, { type AxiosError } from "axios"
import { generateAccessToken } from "@/actions/auth"

const HOSTAWAY_BASE_URL = "https://api.hostaway.com/v1"
const ACCOUNT_ID = "61148"

interface TokenData {
  token: string
  expiresAt: number
}

async function getAccessToken(): Promise<string> {
  // Check if we have a valid stored token
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("hostaway_token")
    if (stored) {
      const tokenData: TokenData = JSON.parse(stored)
      if (Date.now() < tokenData.expiresAt) {
        return tokenData.token
      }
    }
  }

  // Generate new token by calling accessToken endpoint
  const tokenData = await generateAccessToken()

  // Store token with expiry
  if (typeof window !== "undefined") {
    localStorage.setItem("hostaway_token", JSON.stringify(tokenData))
  }

  return tokenData.token
}

export const apiClient = axios.create({
  baseURL: HOSTAWAY_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

apiClient.interceptors.request.use(
  async (config) => {
    // Check if Authorization header is already present
    if (!config.headers.Authorization) {
      const token = await getAccessToken()
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config

    // If 403 error, clear stored token and retry
    if (error.response?.status === 403 && originalRequest) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("hostaway_token")
      }

      // Get new token and retry request
      const token = await getAccessToken()
      originalRequest.headers.Authorization = `Bearer ${token}`

      return apiClient(originalRequest)
    }

    return Promise.reject(error)
  },
)

export function buildQueryUrl(endpoint: string, params?: Record<string, any>) {
  const url = new URL(endpoint, HOSTAWAY_BASE_URL)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value))
      }
    })
  }
  return url.toString()
}

export const HOSTAWAY_ACCOUNT_ID = ACCOUNT_ID
