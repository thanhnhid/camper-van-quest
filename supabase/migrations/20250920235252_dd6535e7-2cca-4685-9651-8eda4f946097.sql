-- Create reviews table for camper ratings and reviews
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  camper_id UUID NOT NULL,
  customer_id UUID NOT NULL,
  booking_id UUID NOT NULL UNIQUE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for reviews
CREATE POLICY "Anyone can view reviews" 
ON public.reviews 
FOR SELECT 
USING (true);

CREATE POLICY "Customers can create reviews for their completed bookings" 
ON public.reviews 
FOR INSERT 
WITH CHECK (
  customer_id IN (
    SELECT profiles.id
    FROM profiles
    WHERE profiles.user_id = auth.uid()
  ) AND
  booking_id IN (
    SELECT bookings.id
    FROM bookings
    WHERE bookings.customer_id = customer_id
    AND bookings.status = 'confirmed'
    AND bookings.end_date < CURRENT_DATE
  )
);

CREATE POLICY "Customers can update their own reviews" 
ON public.reviews 
FOR UPDATE 
USING (
  customer_id IN (
    SELECT profiles.id
    FROM profiles
    WHERE profiles.user_id = auth.uid()
  )
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_reviews_camper_id ON public.reviews(camper_id);
CREATE INDEX idx_reviews_customer_id ON public.reviews(customer_id);
CREATE INDEX idx_reviews_booking_id ON public.reviews(booking_id);