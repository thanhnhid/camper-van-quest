-- Add new columns for motorhome specifications
ALTER TABLE public.campers 
ADD COLUMN beds INTEGER,
ADD COLUMN drivers_license TEXT,
ADD COLUMN fuel_consumption TEXT,
ADD COLUMN engine_power TEXT,
ADD COLUMN drive_type TEXT,
ADD COLUMN emission_class TEXT,
ADD COLUMN dimensions_length NUMERIC,
ADD COLUMN dimensions_width NUMERIC,
ADD COLUMN dimensions_height NUMERIC,
ADD COLUMN trailer_coupling BOOLEAN DEFAULT false,
ADD COLUMN empty_weight NUMERIC,
ADD COLUMN max_weight NUMERIC,
ADD COLUMN payload NUMERIC;