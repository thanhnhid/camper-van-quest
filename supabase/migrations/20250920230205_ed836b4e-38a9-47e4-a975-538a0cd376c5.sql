-- Change default status for new campers to 'approved' so customers can immediately see them
ALTER TABLE public.campers ALTER COLUMN status SET DEFAULT 'approved';

-- Update any existing pending campers to approved (if any exist)
UPDATE public.campers SET status = 'approved' WHERE status = 'pending';