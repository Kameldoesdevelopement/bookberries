ALTER POLICY "Anyone can create book requests"
ON public.book_requests
WITH CHECK (
  length(trim(name)) BETWEEN 2 AND 120
  AND length(trim(phone)) BETWEEN 6 AND 30
  AND length(trim(requested_title)) BETWEEN 1 AND 200
  AND length(trim(author)) <= 160
  AND length(trim(message)) <= 1000
  AND resolved = false
);

ALTER POLICY "Anyone can create orders"
ON public.orders
WITH CHECK (
  length(trim(customer_name)) BETWEEN 2 AND 120
  AND length(trim(phone)) BETWEEN 6 AND 30
  AND length(trim(wilaya)) BETWEEN 1 AND 80
  AND length(trim(delivery_type)) BETWEEN 1 AND 250
  AND total_price > 0
  AND status = 'pending'
);

ALTER POLICY "Anyone can create order items"
ON public.order_items
WITH CHECK (
  order_id IS NOT NULL
  AND book_id IS NOT NULL
  AND length(trim(title)) BETWEEN 1 AND 250
  AND quantity BETWEEN 1 AND 99
  AND price > 0
);