import { describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { loadOrderPage, ORDER_PAGE_SIZE } from "./admin-orders";

function mockClient(orderResult: object, itemResult: object) {
  const chains = [orderResult, itemResult].map(result => {
    const chain: Record<string, ReturnType<typeof vi.fn>> = {};
    for (const method of ["select", "order", "range", "in"]) chain[method] = vi.fn(() => chain);
    chain.abortSignal = vi.fn(async () => result);
    return chain;
  });
  const client = { from: vi.fn((table: string) => chains[table === "orders" ? 0 : 1]) };
  return { client: client as unknown as SupabaseClient<Database>, chains };
}

describe("mobile order loading", () => {
  it("bounds item URLs to the displayed page and keeps older orders accessible", async () => {
    const data = Array.from({ length: ORDER_PAGE_SIZE + 1 }, (_, i) => ({ id: `order-${i}` }));
    const { client, chains } = mockClient({ data, error: null }, {
      data: [{ id: "item-1", order_id: "order-0", title: "Book" }], error: null,
    });
    const result = await loadOrderPage(client, 1, new AbortController().signal);
    expect(chains[0].range).toHaveBeenCalledWith(20, 40);
    expect(chains[1].in).toHaveBeenCalledWith("order_id", data.slice(0, 20).map(order => order.id));
    expect(result.orders).toHaveLength(20);
    expect(result.orders[0].order_items[0].title).toBe("Book");
    expect(result.hasMore).toBe(true);
  });

  it("surfaces failed item loads instead of showing incomplete orders", async () => {
    const error = { message: "Network unavailable" };
    const { client } = mockClient({ data: [{ id: "order-0" }], error: null }, { data: null, error });
    await expect(loadOrderPage(client, 0, new AbortController().signal)).rejects.toEqual(error);
  });

  it("does not fetch items for an empty page", async () => {
    const { client, chains } = mockClient({ data: [], error: null }, { data: [], error: null });
    const result = await loadOrderPage(client, 0, new AbortController().signal);
    expect(chains[1].in).not.toHaveBeenCalled();
    expect(result).toEqual({ orders: [], hasMore: false });
  });
});