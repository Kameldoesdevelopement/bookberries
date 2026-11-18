import { describe, expect, it, vi } from "vitest";
vi.mock("@/integrations/supabase/client", () => ({
  supabase: { auth: { onAuthStateChange: vi.fn() } },
}));
import { isRecoveryHash, shouldRouteToRecovery, validateNewPassword } from "./password-recovery";

describe("password recovery", () => {
  it("routes recovery links landing on the homepage to reset, including after the hash is consumed", () => {
    expect(shouldRouteToRecovery("/", "#type=recovery&access_token=test", false)).toBe(true);
    expect(shouldRouteToRecovery("/", "", true)).toBe(true);
    expect(shouldRouteToRecovery("/reset-password", "", true)).toBe(false);
  });
  it("routes expired email links to reset but never ordinary sessions", () => {
    expect(shouldRouteToRecovery("/", "#error_code=otp_expired", false)).toBe(true);
    expect(shouldRouteToRecovery("/", "#type=signup", false)).toBe(false);
    expect(shouldRouteToRecovery("/", "", false)).toBe(false);
  });
  it("accepts only recovery intent, not ordinary sign-in links", () => {
    expect(isRecoveryHash("#type=recovery&access_token=test")).toBe(true);
    expect(isRecoveryHash("#type=signup&access_token=test")).toBe(false);
    expect(isRecoveryHash("")).toBe(false);
  });
  it("requires matching passwords", () => {
    expect(validateNewPassword("new-password-123", "different-password")).toBe("Passwords do not match.");
    expect(validateNewPassword("new-password-123", "new-password-123")).toBe(null);
  });
  it("requires at least eight characters", () => {
    expect(validateNewPassword("1234567", "1234567")).toBe("Use at least 8 characters.");
    expect(validateNewPassword("12345678", "12345678")).toBe(null);
  });
});