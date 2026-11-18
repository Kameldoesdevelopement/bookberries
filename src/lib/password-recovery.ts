import { supabase } from "@/integrations/supabase/client";

export const isRecoveryHash = (hash: string) =>
  new URLSearchParams(hash.replace(/^#/, "")).get("type") === "recovery";

export const shouldRouteToRecovery = (pathname: string, hash: string, intent: boolean) => {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  return pathname !== "/reset-password" && (
    intent || isRecoveryHash(hash) || params.get("error_code") === "otp_expired"
  );
};

// Capture recovery intent before the auth client consumes the URL fragment.
let recoveryIntent = typeof window !== "undefined" && isRecoveryHash(window.location.hash);
supabase.auth.onAuthStateChange((event) => {
  if (event === "PASSWORD_RECOVERY") recoveryIntent = true;
  if (event === "SIGNED_OUT") recoveryIntent = false;
});
export const hasRecoveryIntent = () => recoveryIntent;

export const validateNewPassword = (password: string, confirmation: string) => {
  if (password.length < 8) return "Use at least 8 characters.";
  if (password !== confirmation) return "Passwords do not match.";
  return null;
};