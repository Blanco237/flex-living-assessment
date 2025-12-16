"use server"

interface TokenData {
  token: string
  expiresAt: number
}

export async function generateAccessToken(): Promise<TokenData> {
  const clientId = process.env.HOSTAWAY_CLIENT_ID || "demo_client"
  const clientSecret = process.env.HOSTAWAY_CLIENT_SECRET || "demo_secret"

  try {
    // In production, this would call the real accessToken endpoint
    // POST /accessToken with clientId and clientSecret
    // For now, using the provided API key as fallback
    const token = process.env.HOSTAWAY_API_KEY || "f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152"

    // Return token with 24hr expiry
    const tokenData: TokenData = {
      token,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    }

    return tokenData
  } catch (error) {
    console.error("Failed to generate access token:", error)
    throw new Error("Authentication failed")
  }
}
