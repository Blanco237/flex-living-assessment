import { createClient } from "@supabase/supabase-js"
import APP_CONSTANTS from "./constants"

const supabaseUrl = APP_CONSTANTS.SUPABASE.URL || ""
const supabaseAnonKey = APP_CONSTANTS.SUPABASE.KEY || ""

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Matches the new `approved_reviews` table schema
export type ReviewApproval = {
  id: number
  review_id: number
}
