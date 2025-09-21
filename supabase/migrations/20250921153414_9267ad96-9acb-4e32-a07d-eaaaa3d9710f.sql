-- Enable deletion of bookings by appropriate roles

-- Admins can delete all bookings
CREATE POLICY "Admins can delete all bookings"
ON public.bookings
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'::user_role
  )
);

-- Customers can delete their own bookings
CREATE POLICY "Customers can delete their own bookings"
ON public.bookings
FOR DELETE
USING (
  customer_id IN (
    SELECT profiles.id FROM profiles
    WHERE profiles.user_id = auth.uid()
  )
);

-- Providers can delete bookings for their campers
CREATE POLICY "Providers can delete bookings for their campers"
ON public.bookings
FOR DELETE
USING (
  camper_id IN (
    SELECT campers.id FROM campers
    WHERE campers.provider_id IN (
      SELECT profiles.id FROM profiles
      WHERE profiles.user_id = auth.uid() AND profiles.role = 'provider'::user_role
    )
  )
);
