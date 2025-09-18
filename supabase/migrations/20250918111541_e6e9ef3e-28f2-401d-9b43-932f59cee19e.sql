-- Create storage bucket for camper images
INSERT INTO storage.buckets (id, name, public) VALUES ('camper-images', 'camper-images', true);

-- Create campers table
CREATE TABLE public.campers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price_per_day DECIMAL(10,2) NOT NULL,
  location TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  features TEXT[],
  images TEXT[],
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on campers table
ALTER TABLE public.campers ENABLE ROW LEVEL SECURITY;

-- Create policies for campers
CREATE POLICY "Providers can view their own campers" 
ON public.campers 
FOR SELECT 
USING (provider_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid() AND role = 'provider'));

CREATE POLICY "Providers can insert their own campers" 
ON public.campers 
FOR INSERT 
WITH CHECK (provider_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid() AND role = 'provider'));

CREATE POLICY "Providers can update their own campers" 
ON public.campers 
FOR UPDATE 
USING (provider_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid() AND role = 'provider'));

CREATE POLICY "Providers can delete their own campers" 
ON public.campers 
FOR DELETE 
USING (provider_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid() AND role = 'provider'));

CREATE POLICY "Customers can view approved campers" 
ON public.campers 
FOR SELECT 
USING (status = 'approved');

CREATE POLICY "Admins can view all campers" 
ON public.campers 
FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update all campers" 
ON public.campers 
FOR UPDATE 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- Create storage policies for camper images
CREATE POLICY "Providers can upload camper images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'camper-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Providers can update their camper images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'camper-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Providers can delete their camper images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'camper-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Public can view camper images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'camper-images');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_campers_updated_at
BEFORE UPDATE ON public.campers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add terms_accepted column to profiles
ALTER TABLE public.profiles ADD COLUMN terms_accepted BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN terms_accepted_at TIMESTAMP WITH TIME ZONE;