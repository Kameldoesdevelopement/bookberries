import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { hasRecoveryIntent, shouldRouteToRecovery } from "@/lib/password-recovery";

export default function RecoveryRedirect() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const routeToReset = (intent = hasRecoveryIntent()) => {
      if (shouldRouteToRecovery(location.pathname, window.location.hash, intent)) {
        navigate({ pathname: "/reset-password", search: window.location.search, hash: window.location.hash }, { replace: true });
      }
    };
    routeToReset();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") routeToReset(true);
    });
    return () => subscription.unsubscribe();
  }, [location.pathname, navigate]);

  return null;
}