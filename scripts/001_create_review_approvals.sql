-- Create review_approvals table to track approved/rejected reviews
CREATE TABLE IF NOT EXISTS review_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id TEXT NOT NULL UNIQUE,
  property_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_review_approvals_property_id ON review_approvals(property_id);
CREATE INDEX IF NOT EXISTS idx_review_approvals_review_id ON review_approvals(review_id);

-- Enable RLS
ALTER TABLE review_approvals ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (since we're using server-side code)
CREATE POLICY "Allow all operations" ON review_approvals FOR ALL USING (true);
