import { describe, expect, it } from "vitest";

describe("deployed checkout CORS", () => {
  it("allows Vercel checkout headers sent by the browser SDK", async () => {
    const headers = [
      "authorization", "apikey", "content-type", "x-client-info",
      "x-supabase-client-platform", "x-supabase-client-platform-version",
      "x-supabase-client-runtime", "x-supabase-client-runtime-version",
    ];
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-order`, {
      method: "OPTIONS",
      headers: {
        Origin: "https://bookberries.vercel.app",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": headers.join(","),
      },
    });
    expect(response.ok).toBe(true);
    const origin = response.headers.get("access-control-allow-origin");
    expect(["*", "https://bookberries.vercel.app"]).toContain(origin);
    const allowed = response.headers.get("access-control-allow-headers")?.toLowerCase().split(",").map(h => h.trim()) ?? [];
    for (const header of headers) expect(allowed).toContain(header);
  }, 20000);
});