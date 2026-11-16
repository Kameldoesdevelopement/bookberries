ALTER TABLE public.books ADD COLUMN is_published boolean NOT NULL DEFAULT true;
ALTER TABLE public.accessories ADD COLUMN is_published boolean NOT NULL DEFAULT true;
DROP POLICY "Books are publicly readable" ON public.books;
DROP POLICY "Accessories are publicly readable" ON public.accessories;
CREATE POLICY "Published books are readable" ON public.books FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY "Admins can read all books" ON public.books FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Published accessories are readable" ON public.accessories FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY "Admins can read all accessories" ON public.accessories FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));