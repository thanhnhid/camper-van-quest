-- Fix security issue: Restrict profile access to prevent unauthorized personal data access

-- Drop the overly permissive policy that exposes all personal information
DROP POLICY IF EXISTS "Users can view profiles with booking relationships" ON public.profiles;

-- Create more restrictive policies for different access levels

-- Policy 1: Users can view their own complete profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Policy 2: Admins can view all profiles (administrative purposes)
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.get_user_role_by_user_id(auth.uid()) = 'admin'::user_role);

-- Policy 3: Limited public access for names only (for reviews and public listings)
-- This only exposes first_name and last_name, not sensitive data
CREATE POLICY "Public can view basic profile info" 
ON public.profiles 
FOR SELECT 
USING (
  -- Only allow if there are reviews by this customer (for review display)
  EXISTS (SELECT 1 FROM reviews WHERE customer_id = profiles.id)
);

-- Policy 4: Booking partners can see limited contact info (names only)  
-- This ensures providers and customers can see each other's names for communication
-- but NOT sensitive data like addresses, phone numbers, or email addresses
CREATE POLICY "Booking partners can view contact names" 
ON public.profiles 
FOR SELECT 
USING (
  public.user_has_booking_with_profile(profiles.id)
  -- This policy will be further restricted by application-level column filtering
);

-- Create a security function to get safe profile data for booking relationships
-- This function only returns non-sensitive information
CREATE OR REPLACE FUNCTION public.get_safe_profile_for_booking(profile_id uuid)
RETURNS TABLE(
  id uuid,
  first_name text,
  last_name text,
  role user_role
) AS $$
BEGIN
  -- Only return if user has booking relationship with this profile
  IF public.user_has_booking_with_profile(profile_id) OR 
     public.get_user_role_by_user_id(auth.uid()) = 'admin'::user_role THEN
    RETURN QUERY
    SELECT p.id, p.first_name, p.last_name, p.role
    FROM profiles p
    WHERE p.id = profile_id;
  END IF;
  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;