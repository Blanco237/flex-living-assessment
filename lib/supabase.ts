import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type ReviewApproval = {
  id: string
  review_id: string
  property_id: string
  status: "approved" | "rejected"
  created_at: string
  updated_at: string
}
