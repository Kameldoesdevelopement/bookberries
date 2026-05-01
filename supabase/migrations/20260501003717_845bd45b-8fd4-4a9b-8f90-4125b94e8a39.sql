-- Drop the privilege-escalation-prone bootstrap function
DROP FUNCTION IF EXISTS public.claim_admin_if_first();

-- Lock down EXECUTE on SECURITY DEFINER helpers so they're only callable
-- from inside RLS policies / other definer functions, not directly by
-- signed-in users via PostgREST.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_current_user_admin() FROM PUBLIC, anon;
-- Keep is_current_user_admin callable by authenticated users (the Admin page uses it via RPC)
GRANT EXECUTE ON FUNCTION public.is_current_user_admin() TO authenticated;