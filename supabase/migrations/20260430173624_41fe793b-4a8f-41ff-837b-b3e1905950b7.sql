ALTER TABLE public.book_requests ADD COLUMN IF NOT EXISTS phone text NOT NULL DEFAULT '';
ALTER TABLE public.book_requests ALTER COLUMN email DROP NOT NULL;
ALTER TABLE public.book_requests ALTER COLUMN email SET DEFAULT '';