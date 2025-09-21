-- Fix infinite recursion in RLS policies by using security definer functions

-- Drop the problematic policies that cause recursion
DROP POLICY IF EXISTS "Providers can view customer info for their bookings" ON public.profiles;
DROP POLICY IF EXISTS "Customers can view provider info for their bookings" ON public.profiles;
DROP POLICY IF EXISTS "Public can view names for reviews" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create security definer function to get user role without recursion
CREATE OR REPLACE FUNCTION public.get_user_role_by_user_id(_user_id uuid)
RETURNS user_role AS $$
BEGIN
  RETURN (SELECT role FROM public.profiles WHERE user_id = _user_id LIMIT 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Create function to check if user has booking relationship
CREATE OR REPLACE FUNCTION public.user_has_booking_with_profile(_profile_id uuid)
RETURNS boolean AS $$
BEGIN
  -- Check if current user is a customer with bookings for this provider
  IF EXISTS (
    SELECT 1 FROM bookings b
    JOIN campers c ON b.camper_id = c.id
    JOIN profiles customer ON b.customer_id = customer.id
    WHERE c.provider_id = _profile_id
    AND customer.user_id = auth.uid()
  ) THEN
    RETURN true;
  END IF;
  
  -- Check if current user is a provider with bookings from this customer
  IF EXISTS (
    SELECT 1 FROM bookings b
    JOIN campers c ON b.camper_id = c.id
    JOIN profiles provider ON c.provider_id = provider.id
    WHERE b.customer_id = _profile_id
    AND provider.user_id = auth.uid()
  ) THEN
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Recreate policies using security definer functions
CREATE POLICY "Users can view profiles with booking relationships"
ON public.profiles
FOR SELECT
USING (
  -- Users can view their own profile
  auth.uid() = user_id
  OR
  -- Users can view profiles they have booking relationships with
  public.user_has_booking_with_profile(profiles.id)
  OR
  -- Admins can view all profiles
  public.get_user_role_by_user_id(auth.uid()) = 'admin'::user_role
  OR
  -- Allow viewing names only for reviews (limited by application logic)
  EXISTS (SELECT 1 FROM reviews WHERE customer_id = profiles.id)
);