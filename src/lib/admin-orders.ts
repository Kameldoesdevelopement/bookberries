import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "@/integrations/supabase/types";

export const ORDER_PAGE_SIZE = 20;
export type AdminOrder = Tables<"orders"> & { order_items: Tables<"order_items">[] };

// Keep order IDs out of oversized URLs and avoid rendering the full history on phones.
export async function loadOrderPage(client: SupabaseClient<Database>, page: number, signal: AbortSignal) {
  const start = page * ORDER_PAGE_SIZE;
  const { data, error } = await client.from("orders").select("*")
    .order("created_at", { ascending: false }).order("id", { ascending: false })
    .range(start, start + ORDER_PAGE_SIZE).abortSignal(signal);
  if (error) throw error;
  const orders = (data ?? []).slice(0, ORDER_PAGE_SIZE);
  const ids = orders.map(order => order.id);
  const items: Tables<"order_items">[] = [];
  if (ids.length) {
    for (let offset = 0; ; offset += 1000) {
      const result = await client.from("order_items").select("*").in("order_id", ids)
        .order("id").range(offset, offset + 999).abortSignal(signal);
      if (result.error) throw result.error;
      items.push(...(result.data ?? []));
      if ((result.data?.length ?? 0) < 1000) break;
    }
  }
  const itemsByOrder = new Map<string, Tables<"order_items">[]>();
  for (const item of items) {
    const group = itemsByOrder.get(item.order_id) ?? [];
    group.push(item);
    itemsByOrder.set(item.order_id, group);
  }
  return {
    orders: orders.map(order => ({ ...order, order_items: itemsByOrder.get(order.id) ?? [] })),
    hasMore: (data?.length ?? 0) > ORDER_PAGE_SIZE,
  };
}