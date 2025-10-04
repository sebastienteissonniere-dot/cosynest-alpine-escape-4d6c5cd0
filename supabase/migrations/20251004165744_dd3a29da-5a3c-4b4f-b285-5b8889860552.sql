-- Create table for school holidays
CREATE TABLE public.school_holidays (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  zone text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  description text NOT NULL,
  holiday_type text NOT NULL,
  academic_year text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX idx_school_holidays_dates ON public.school_holidays(start_date, end_date);
CREATE INDEX idx_school_holidays_zone ON public.school_holidays(zone);

-- Enable RLS
ALTER TABLE public.school_holidays ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read holidays
CREATE POLICY "Anyone can view school holidays"
ON public.school_holidays
FOR SELECT
USING (true);

-- Only authenticated users can insert/update holidays (for sync function)
CREATE POLICY "Authenticated users can manage holidays"
ON public.school_holidays
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create table for booking settings
CREATE TABLE public.booking_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_zone text NOT NULL DEFAULT 'A',
  auto_detect_zone boolean DEFAULT false,
  data_source text DEFAULT 'api',
  apply_on_overlap boolean DEFAULT false,
  allow_with_surcharge boolean DEFAULT false,
  surcharge_percentage numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.booking_settings ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read settings
CREATE POLICY "Anyone can view booking settings"
ON public.booking_settings
FOR SELECT
USING (true);

-- Only authenticated users can manage settings
CREATE POLICY "Authenticated users can manage settings"
ON public.booking_settings
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Insert default settings
INSERT INTO public.booking_settings (school_zone, auto_detect_zone, data_source, apply_on_overlap)
VALUES ('A', false, 'api', false);

-- Create table for manual exceptions
CREATE TABLE public.booking_exceptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  start_date date NOT NULL,
  end_date date NOT NULL,
  reason text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.booking_exceptions ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read exceptions
CREATE POLICY "Anyone can view booking exceptions"
ON public.booking_exceptions
FOR SELECT
USING (true);

-- Only authenticated users can manage exceptions
CREATE POLICY "Authenticated users can manage exceptions"
ON public.booking_exceptions
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_school_holidays_updated_at
BEFORE UPDATE ON public.school_holidays
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_booking_settings_updated_at
BEFORE UPDATE ON public.booking_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();