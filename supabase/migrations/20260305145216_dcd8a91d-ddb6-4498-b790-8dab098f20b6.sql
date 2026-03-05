
-- Add image_url to books table
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS image_url text DEFAULT '';

-- Create accessories table
CREATE TABLE public.accessories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  price integer NOT NULL,
  image_url text DEFAULT '',
  category text NOT NULL DEFAULT 'General',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on accessories
ALTER TABLE public.accessories ENABLE ROW LEVEL SECURITY;

-- RLS policies for accessories
CREATE POLICY "Accessories are publicly readable" ON public.accessories FOR SELECT USING (true);
CREATE POLICY "Anyone can insert accessories" ON public.accessories FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update accessories" ON public.accessories FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete accessories" ON public.accessories FOR DELETE USING (true);
