DROP POLICY IF EXISTS "Admins can read orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can delete orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can read order items" ON public.order_items;

CREATE POLICY "Anyone can read orders" ON public.orders FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can update orders" ON public.orders FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete orders" ON public.orders FOR DELETE TO anon, authenticated USING (true);

CREATE POLICY "Anyone can read order items" ON public.order_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can delete order items" ON public.order_items FOR DELETE TO anon, authenticated USING (true);