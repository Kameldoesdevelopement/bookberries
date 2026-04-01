
-- 1. Create enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- 2. Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Create has_role function (must exist before policies that use it)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 4. RLS on user_roles itself
CREATE POLICY "Admins can read user_roles"
ON public.user_roles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 5. Fix orders
DROP POLICY IF EXISTS "Anyone can read orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can update orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can delete orders" ON public.orders;

CREATE POLICY "Admins can read orders" ON public.orders FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete orders" ON public.orders FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 6. Fix order_items
DROP POLICY IF EXISTS "Anyone can read order items" ON public.order_items;
CREATE POLICY "Admins can read order items" ON public.order_items FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 7. Fix book_requests
DROP POLICY IF EXISTS "Anyone can read book requests" ON public.book_requests;
DROP POLICY IF EXISTS "Anyone can update book requests" ON public.book_requests;

CREATE POLICY "Admins can read book requests" ON public.book_requests FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update book requests" ON public.book_requests FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 8. Fix books (keep public read)
DROP POLICY IF EXISTS "Anyone can insert books" ON public.books;
DROP POLICY IF EXISTS "Anyone can update books" ON public.books;
DROP POLICY IF EXISTS "Anyone can delete books" ON public.books;

CREATE POLICY "Admins can insert books" ON public.books FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update books" ON public.books FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete books" ON public.books FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 9. Fix accessories (keep public read)
DROP POLICY IF EXISTS "Anyone can insert accessories" ON public.accessories;
DROP POLICY IF EXISTS "Anyone can update accessories" ON public.accessories;
DROP POLICY IF EXISTS "Anyone can delete accessories" ON public.accessories;

CREATE POLICY "Admins can insert accessories" ON public.accessories FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update accessories" ON public.accessories FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete accessories" ON public.accessories FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
