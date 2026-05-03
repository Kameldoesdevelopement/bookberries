-- Lock down order creation so it can only happen via the create-order edge function (service role).
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can create order items" ON public.order_items;