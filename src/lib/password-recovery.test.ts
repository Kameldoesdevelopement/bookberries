import { describe, expect, it, vi } from "vitest";
vi.mock("@/integrations/supabase/client", () => ({
  supabase: { auth: { onAuthStateChange: vi.fn() } },
}));
import { isRecoveryHash, validateNewPassword } from "./password-recovery";

describe("password recovery", () => {
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