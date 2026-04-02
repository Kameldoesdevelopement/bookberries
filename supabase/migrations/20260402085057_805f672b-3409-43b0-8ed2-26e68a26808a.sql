
-- Drop restrictive admin-only policies on books
DROP POLICY IF EXISTS "Admins can delete books" ON public.books;
DROP POLICY IF EXISTS "Admins can update books" ON public.books;
DROP POLICY IF EXISTS "Admins can insert books" ON public.books;

-- Allow public delete/update/insert on books (admin password is the access gate)
CREATE POLICY "Anyone can delete books" ON public.books FOR DELETE TO public USING (true);
CREATE POLICY "Anyone can update books" ON public.books FOR UPDATE TO public USING (true);
CREATE POLICY "Anyone can insert books" ON public.books FOR INSERT TO public WITH CHECK (true);

-- Drop restrictive admin-only policies on accessories
DROP POLICY IF EXISTS "Admins can delete accessories" ON public.accessories;
DROP POLICY IF EXISTS "Admins can update accessories" ON public.accessories;
DROP POLICY IF EXISTS "Admins can insert accessories" ON public.accessories;

-- Allow public delete/update/insert on accessories
CREATE POLICY "Anyone can delete accessories" ON public.accessories FOR DELETE TO public USING (true);
CREATE POLICY "Anyone can update accessories" ON public.accessories FOR UPDATE TO public USING (true);
CREATE POLICY "Anyone can insert accessories" ON public.accessories FOR INSERT TO public WITH CHECK (true);
