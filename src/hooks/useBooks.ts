import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Book } from "@/data/books";

export const useBooks = () => {
  return useQuery<Book[]>({
    queryKey: ["books"],
    queryFn: async () => {
      const { data, error } = await supabase.from("books").select("*").order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
};

export const useBook = (id: string | undefined) => {
  return useQuery<Book | null>({
    queryKey: ["book", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase.from("books").select("*").eq("id", id!).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
};

export const useTrendingBooks = () => {
  return useQuery<Book[]>({
    queryKey: ["books", "trending"],
    queryFn: async () => {
      const { data, error } = await supabase.from("books").select("*").eq("is_trending", true);
      if (error) throw error;
      return data;
    },
  });
};

export const usePromotionBooks = () => {
  return useQuery<Book[]>({
    queryKey: ["books", "promotions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("is_promotion", true)
        .not("promo_price", "is", null)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).filter((b) => (b.promo_price ?? 0) > 0 && (b.promo_price ?? 0) < b.price);
    },
  });
};
