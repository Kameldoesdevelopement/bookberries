import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Lock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { hasRecoveryIntent, validateNewPassword } from "@/lib/password-recovery";

const ResetPassword = () => {
  const [status, setStatus] = useState<"checking" | "ready" | "invalid" | "done">("checking");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const verify = async () => {
      try {
        const { data, error: authError } = await supabase.auth.getUser();
        if (active) setStatus(!authError && data.user && hasRecoveryIntent() ? "ready" : "invalid");
      } catch {
        if (active) setStatus("invalid");
      }
    };
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setTimeout(() => { if (active) void verify(); }, 0);
    });
    void verify();
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateNewPassword(password, confirmation);
    if (validation) { setError(validation); return; }
    setBusy(true);
    setError("");
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) { setError(updateError.message); return; }
      setPassword(""); setConfirmation("");
      await supabase.auth.signOut();
      setStatus("done");
    } catch {
      setError("Unable to reset your password. Please try again.");
    } finally { setBusy(false); }
  };

  const inputClass = "w-full rounded-lg border border-input bg-background px-4 py-3 font-sans text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-12 parchment-bg">
      <div className="w-full max-w-sm rounded-lg border border-border bg-card p-8">
        {status === "done" ? <CheckCircle className="mx-auto mb-3 h-10 w-10 text-primary" /> : <Lock className="mx-auto mb-3 h-10 w-10 text-primary" />}
        <h1 className="mb-5 text-center font-display text-2xl font-bold text-foreground">{status === "done" ? "Password updated" : "Reset Password"}</h1>
        {status === "checking" && <p className="text-center text-muted-foreground" role="status">Checking reset link...</p>}
        {status === "invalid" && <><p className="mb-5 text-sm text-muted-foreground" role="alert">This reset link is invalid or expired. Request a new link to continue.</p><Button variant="warm" className="w-full" asChild><Link to="/auth">Back to Sign In</Link></Button></>}
        {status === "done" && <><p className="mb-5 text-sm text-muted-foreground">Sign in with your new password.</p><Button variant="warm" className="w-full" asChild><Link to="/auth">Sign In</Link></Button></>}
        {status === "ready" && <form onSubmit={submit} className="space-y-4">
          <div><label htmlFor="new-password" className="mb-2 block text-sm text-foreground">New password</label><input id="new-password" type="password" autoComplete="new-password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} className={inputClass} /></div>
          <div><label htmlFor="confirm-password" className="mb-2 block text-sm text-foreground">Confirm new password</label><input id="confirm-password" type="password" autoComplete="new-password" required minLength={8} value={confirmation} onChange={e => setConfirmation(e.target.value)} className={inputClass} /></div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button variant="warm" type="submit" disabled={busy} className="w-full">{busy ? "Updating..." : "Save New Password"}</Button>
        </form>}
      </div>
    </main>
  );
};
export default ResetPassword;