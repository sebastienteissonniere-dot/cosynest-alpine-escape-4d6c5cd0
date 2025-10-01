-- Adapt database for Beds24 integration
ALTER TABLE public.reservations 
  RENAME COLUMN lodgify_id TO channel_booking_id;

ALTER TABLE public.reservations 
  ALTER COLUMN source SET DEFAULT 'beds24';

-- Update existing records source from 'lodgify' to 'beds24'
UPDATE public.reservations 
  SET source = 'beds24' 
  WHERE source = 'lodgify';

-- Add beds24_property_id column for mapping
ALTER TABLE public.reservations 
  ADD COLUMN IF NOT EXISTS channel_property_id text;

-- Update sync_status for beds24
UPDATE public.sync_status 
  SET service = 'beds24' 
  WHERE service = 'lodgify';