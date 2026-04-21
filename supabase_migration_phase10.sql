-- Phase 10: Revocable License Digital Signatures

ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS owner_signature TEXT,
ADD COLUMN IF NOT EXISTS gardener_signature TEXT,
ADD COLUMN IF NOT EXISTS license_agreed_at TIMESTAMPTZ;

-- Note: If there is a check constraint on status, it will need to be dropped or altered to allow 'awaiting_signature'.
-- Assuming standard text column for now.
