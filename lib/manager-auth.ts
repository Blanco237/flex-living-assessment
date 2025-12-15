const AUTH_KEY = "manager_auth"
const AUTH_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

interface AuthData {
  authenticated: boolean
  timestamp: number
}

export function setManagerAuth() {
  const authData: AuthData = {
    authenticated: true,
    timestamp: Date.now(),
  }
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_KEY, JSON.stringify(authData))
  }
}

export function clearManagerAuth() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_KEY)
  }
}

export function isManagerAuthenticated(): boolean {
  if (typeof window === "undefined") return false

  const authDataStr = localStorage.getItem(AUTH_KEY)
  if (!authDataStr) return false

  try {
    const authData: AuthData = JSON.parse(authDataStr)
    const now = Date.now()
    const elapsed = now - authData.timestamp

    // Check if 24 hours have passed
    if (elapsed > AUTH_DURATION) {
      clearManagerAuth()
      return false
    }

    return authData.authenticated
  } catch {
    clearManagerAuth()
    return false
  }
}
