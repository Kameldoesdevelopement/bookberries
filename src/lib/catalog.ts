import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "@/integrations/supabase/types";

const CATALOG_PAGE_SIZE = 500;

export async function loadBooks(client: SupabaseClient<Database>, signal?: AbortSignal) {
  const books: Tables<"books">[] = [];
  for (let offset = 0; ; offset += CATALOG_PAGE_SIZE) {
    let query = client.from("books").select("*")
      .order("created_at", { ascending: true }).order("id", { ascending: true })
      .range(offset, offset + CATALOG_PAGE_SIZE - 1);
    if (signal) query = query.abortSignal(signal);
    const { data, error } = await query;
    if (error) throw error;
    books.push(...(data ?? []));
    if ((data?.length ?? 0) < CATALOG_PAGE_SIZE) return books;
  }
}