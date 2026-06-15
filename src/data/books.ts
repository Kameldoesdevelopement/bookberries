import type { Tables } from "@/integrations/supabase/types";

export type Book = Tables<"books">;

export const isOnPromotion = (book: Pick<Book, "is_promotion" | "promo_price" | "price">) =>
  !!book.is_promotion && typeof book.promo_price === "number" && book.promo_price > 0 && book.promo_price < book.price;

export const getEffectivePrice = (book: Pick<Book, "is_promotion" | "promo_price" | "price">) =>
  isOnPromotion(book) ? (book.promo_price as number) : book.price;

export const GENRES = [
  "Literary Fiction & Classics",
  "Romance",
  "Mystery",
  "Crime",
  "Thriller",
  "Suspense",
  "Horror",
  "Fantasy",
  "Science Fiction",
  "Historical Fiction",
  "Dystopian",
  "Poetry",
  "Short Stories",
  "Biography",
  "Autobiography",
  "History",
  "Religion & Spirituality",
  "Psychology",
  "Self-Help",
  "Personal Development",
  "Business",
  "Economics",
  "Marketing",
  "Finance",
  "Health & Wellness",
  "Cooking",
  "Education",
  "Politics",
  "Science",
  "French Books",
  "Arabic Books",
  "Young Adult Romance",
  "Philosophy",
  "Dark Academia",
  "Manga",
] as const;

export const WILAYAS = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra",
  "Béchar", "Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret",
  "Tizi Ouzou", "Alger", "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda",
  "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem",
  "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh", "Illizi",
  "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt",
  "El Oued", "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla",
  "Naâma", "Aïn Témouchent", "Ghardaïa", "Relizane",
  "Timimoun", "Bordj Badji Mokhtar", "Ouled Djellal", "Béni Abbès",
  "In Salah", "In Guezzam", "Touggourt", "Djanet", "El M'Ghair", "El Meniaa",
];
