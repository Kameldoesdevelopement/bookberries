import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Accessory = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  created_at: string;
};

export const useAccessories = () => {
  return useQuery<Accessory[]>({
    queryKey: ["accessories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("accessories").select("*").order("created_at", { ascending: true });
      if (error) throw error;
      return data as Accessory[];
    },
  });
};
