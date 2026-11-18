import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Lock, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recovering, setRecovering] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) navigate("/admin");
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || (!recovering && !password)) {
      toast.error("Please enter email and password.");
      return;
    }
    setLoading(true);
    setErrorMessage("");
    try {
      if (recovering) {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) { setErrorMessage(error.message); return; }
        setSent(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) { setErrorMessage(error.message); return; }
        navigate("/admin", { replace: true });
      }
    } catch {
      setErrorMessage("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-input bg-background px-4 py-3 font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <main className="min-h-screen parchment-bg flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-sm w-full px-4"
      >
        <div className="rounded-lg border border-border bg-card p-8">
          <div className="text-center mb-6">
            <Lock className="mx-auto h-10 w-10 text-primary mb-3" />
            <h1 className="font-display text-2xl font-bold text-foreground mb-1">
              {recovering ? "Forgot Password" : "Admin Sign In"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {recovering ? "Get a password reset link by email." : "Sign in to access the dashboard."}
            </p>
          </div>
          {sent ? <p role="status" className="text-sm text-muted-foreground">If an account exists for this email, a reset link will be sent. Check your inbox and spam folder.</p> : <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              aria-label="Email address"
              required
              autoComplete="email"
              className={inputClass}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {!recovering && <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                aria-label="Password"
                required
                className={inputClass + " pr-10"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>}
            {errorMessage && <p role="alert" className="text-sm text-destructive">{errorMessage}</p>}
            <Button variant="warm" className="w-full" type="submit" disabled={loading}>
              {loading ? "Please wait..." : recovering ? "Send Reset Link" : "Sign In"}
            </Button>
          </form>}
          <Button variant="link" className="mt-3 w-full" disabled={loading} onClick={() => { setRecovering(!recovering); setSent(false); setErrorMessage(""); setPassword(""); }}>
            {recovering ? "Back to Sign In" : "Forgot password?"}
          </Button>
        </div>
      </motion.div>
    </main>
  );
};

export default Auth;
