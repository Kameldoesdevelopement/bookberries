import { describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { loadBooks } from "./catalog";

describe("complete bookstore catalog", () => {
  it("includes newly added books beyond the first 1,000 rows", async () => {
    const rows = Array.from({ length: 1018 }, (_, i) => ({ id: `book-${i}` }));
    const chain = {
      select: vi.fn(() => chain), order: vi.fn(() => chain),
      range: vi.fn(async (start: number, end: number) => ({ data: rows.slice(start, end + 1), error: null })),
    };
    const client = { from: vi.fn(() => chain) } as unknown as SupabaseClient<Database>;
    const books = await loadBooks(client);
    expect(books).toHaveLength(1018);
    expect(books.at(-1)?.id).toBe("book-1017");
    expect(chain.range).toHaveBeenCalledWith(1000, 1499);
  });

  it("reports a failed page instead of returning an incomplete catalog", async () => {
    const error = { message: "Connection failed" };
    const chain = {
      select: vi.fn(() => chain), order: vi.fn(() => chain),
      range: vi.fn().mockResolvedValueOnce({ data: Array.from({ length: 500 }, (_, i) => ({ id: `${i}` })), error: null })
        .mockResolvedValueOnce({ data: null, error }),
    };
    const client = { from: vi.fn(() => chain) } as unknown as SupabaseClient<Database>;
    await expect(loadBooks(client)).rejects.toEqual(error);
  });
});