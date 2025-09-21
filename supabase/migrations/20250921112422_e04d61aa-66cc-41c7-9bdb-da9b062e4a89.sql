-- Add new fields to campers table for enhanced camper details
ALTER TABLE public.campers 
ADD COLUMN gas_type TEXT,
ADD COLUMN insurance_included BOOLEAN DEFAULT false,
ADD COLUMN security_deposit NUMERIC DEFAULT 0,
ADD COLUMN cleaning_fee NUMERIC DEFAULT 0,
ADD COLUMN cancellation_fee NUMERIC DEFAULT 0,
ADD COLUMN variable_pricing JSONB DEFAULT '{}',
ADD COLUMN additional_offers TEXT[] DEFAULT '{}';

-- Create wishlist table for customers
CREATE TABLE public.wishlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL,
  camper_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(customer_id, camper_id)
);

-- Enable RLS on wishlist table
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- Create policies for wishlist table
CREATE POLICY "Users can view their own wishlist items" 
ON public.wishlists 
FOR SELECT 
USING (customer_id IN ( SELECT profiles.id
   FROM profiles
  WHERE (profiles.user_id = auth.uid())));

CREATE POLICY "Users can create their own wishlist items" 
ON public.wishlists 
FOR INSERT 
WITH CHECK (customer_id IN ( SELECT profiles.id
   FROM profiles
  WHERE (profiles.user_id = auth.uid())));

CREATE POLICY "Users can delete their own wishlist items" 
ON public.wishlists 
FOR DELETE 
USING (customer_id IN ( SELECT profiles.id
   FROM profiles
  WHERE (profiles.user_id = auth.uid())));

-- Add comments for better documentation
COMMENT ON COLUMN public.campers.gas_type IS 'Type of gas used (e.g., Propane, Butane)';
COMMENT ON COLUMN public.campers.insurance_included IS 'Whether insurance is included in the base price';
COMMENT ON COLUMN public.campers.security_deposit IS 'Security deposit amount in EUR';
COMMENT ON COLUMN public.campers.cleaning_fee IS 'Final cleaning cost in EUR';
COMMENT ON COLUMN public.campers.cancellation_fee IS 'Cancellation fee in EUR';
COMMENT ON COLUMN public.campers.variable_pricing IS 'JSON object with duration/season based pricing';
COMMENT ON COLUMN public.campers.additional_offers IS 'Array of additional offers like bike rack, tent, bed linen';
COMMENT ON TABLE public.wishlists IS 'Customer wishlist for saving favorite campers';