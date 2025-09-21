-- Add 'cancelled' status to bookings table
-- First, we need to see what constraint currently exists on the status column
-- and update it to include 'cancelled'

-- Update the check constraint to allow 'cancelled' status
ALTER TABLE public.bookings 
DROP CONSTRAINT IF EXISTS bookings_status_check;

ALTER TABLE public.bookings 
ADD CONSTRAINT bookings_status_check 
CHECK (status IN ('pending', 'confirmed', 'rejected', 'cancelled'));

-- Add comment to document the available statuses
COMMENT ON COLUMN public.bookings.status IS 'Booking status: pending (waiting for provider approval), confirmed (approved by provider), rejected (declined by provider), cancelled (cancelled by provider after approval)';