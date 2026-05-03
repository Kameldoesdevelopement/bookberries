CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

GRANT USAGE ON SCHEMA private TO authenticated;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated;

ALTER POLICY "Admins can insert accessories"
ON public.accessories
WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can update accessories"
ON public.accessories
USING (private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can delete accessories"
ON public.accessories
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can read book requests"
ON public.book_requests
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can update book requests"
ON public.book_requests
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can delete book requests"
ON public.book_requests
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can insert books"
ON public.books
WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can update books"
ON public.books
USING (private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can delete books"
ON public.books
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can read order items"
ON public.order_items
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can delete order items"
ON public.order_items
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can read orders"
ON public.orders
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can update orders"
ON public.orders
USING (private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can delete orders"
ON public.orders
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can read user_roles"
ON public.user_roles
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can manage user_roles"
ON public.user_roles
USING (private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT private.has_role(auth.uid(), 'admin'::public.app_role);
$$;

GRANT EXECUTE ON FUNCTION public.is_current_user_admin() TO authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;