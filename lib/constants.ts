export const AUTH_DURATION = 2 * 60 * 60 * 1000; // 2 hours

const APP_CONSTANTS = {
  HOSTAWAY: {
    BASE_URL: "https://api.hostaway.com/v1",
    ACCOUNT_ID: process.env.HOSTAWAY_ACCOUNT_ID,
    API_KEY: process.env.HOSTAWAY_API_KEY
  },
  MANAGEMENT_ACCESS_SECRET: process.env.ACCESS_SECRET,
  SUPABASE: {
    URL: process.env.SUPABASE_URL,
    KEY: process.env.SUPABASE_ANON_KEY
  },
  AUTH_DURATION,
  MOCKAROO: {
    ENDPOINT: process.env.MOCKAROO_ENDPOINT,
    KEY: process.env.MOCKAROO_KEY
  },
  GOOGLE_PLACES: {
    API_KEY: process.env.GOOGLE_PLACES_API_KEY,
    BASE_URL: "https://places.googleapis.com/v1/places",
  }
};

export default APP_CONSTANTS