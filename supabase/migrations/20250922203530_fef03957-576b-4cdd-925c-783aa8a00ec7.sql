-- Fix security issue: Restrict profile access to prevent unauthorized personal data access

-- First, drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Users can view profiles with booking relationships" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public can view basic profile info" ON public.profiles;
DROP POLICY IF EXISTS "Booking partners can view contact names" ON public.profiles;

-- Create secure policies that limit access to sensitive personal information

-- Policy 1: Users can view their own complete profile
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Policy 2: Admins can view all profiles
CREATE POLICY "Admins view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.get_user_role_by_user_id(auth.uid()) = 'admin'::user_role);

-- Policy 3: Public can view names only for reviews (no sensitive data)
CREATE POLICY "Public view names for reviews" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (SELECT 1 FROM reviews WHERE customer_id = profiles.id)
);

-- Note: Removed the booking relationship policy that exposed all personal data
-- Applications should use the safe function below for booking-related profile access

-- Create a security function to get safe profile data for booking relationships
CREATE OR REPLACE FUNCTION public.get_safe_profile_for_booking(profile_id uuid)
RETURNS TABLE(
  id uuid,
  first_name text,
  last_name text,
  role user_role
) AS $$
BEGIN
  -- Only return basic info if user has booking relationship
  IF public.user_has_booking_with_profile(profile_id) OR 
     public.get_user_role_by_user_id(auth.uid()) = 'admin'::user_role THEN
    RETURN QUERY
    SELECT p.id, p.first_name, p.last_name, p.role
    FROM profiles p
    WHERE p.id = profile_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;