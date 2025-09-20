-- Allow providers to view bookings for their own campers
CREATE POLICY "Providers can view bookings for their campers" 
ON public.bookings 
FOR SELECT 
USING (
  camper_id IN (
    SELECT id FROM public.campers 
    WHERE provider_id IN (
      SELECT id FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'provider'
    )
  )
);

-- Allow providers to update booking status for their own campers
CREATE POLICY "Providers can update bookings for their campers" 
ON public.bookings 
FOR UPDATE 
USING (
  camper_id IN (
    SELECT id FROM public.campers 
    WHERE provider_id IN (
      SELECT id FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'provider'
    )
  )
);