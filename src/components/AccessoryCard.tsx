import type { Accessory } from "@/hooks/useAccessories";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

import accBookmarks from "@/assets/acc-bookmarks.jpg";
import accKeychains from "@/assets/acc-keychains.jpg";
import accReadingLamp from "@/assets/acc-reading-lamp.jpg";
import accMetalBookmarks from "@/assets/acc-metal-bookmarks.jpg";
import accStickyTabs from "@/assets/acc-sticky-tabs.jpg";
import accNotebookSet from "@/assets/acc-notebook-set.jpg";

const localImageMap: Record<string, string> = {
  "Bookmarks Set": accBookmarks,
  "Book Keychains": accKeychains,
  "Reading Lamp": accReadingLamp,
  "Metal Bookmarks": accMetalBookmarks,
  "Sticky Index Tabs": accStickyTabs,
  "Artistic Notebook Diary Set": accNotebookSet,
};

interface AccessoryCardProps {
  accessory: Accessory;
}

const AccessoryCard = ({ accessory }: AccessoryCardProps) => {
  const { addToCart } = useCart();

  const imageUrl = accessory.image_url || localImageMap[accessory.name];

  const handleAdd = () => {
    addToCart({
      id: accessory.id,
      title: accessory.name,
      author: "Accessory",
      price: accessory.price,
      description: accessory.description,
      genre: [accessory.category],
      cover_color: "from-emerald-700 to-emerald-900",
      cover_accent: "bg-emerald-200",
      is_trending: false,
      created_at: accessory.created_at,
      image_url: accessory.image_url,
    });
    toast.success(`"${accessory.name}" added to cart`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      className="book-card block group"
    >
      <div className="aspect-square bg-muted relative overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={accessory.name} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-4 text-center bg-secondary">
            <h3 className="font-display text-lg font-bold text-foreground leading-tight">{accessory.name}</h3>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display text-sm font-semibold text-foreground leading-tight mb-1 line-clamp-1">{accessory.name}</h3>
        <p className="font-sans text-xs text-muted-foreground mb-2">{accessory.category}</p>
        <div className="flex items-center justify-between">
          <span className="font-sans text-sm font-bold text-primary">{accessory.price.toLocaleString()} DZD</span>
          <button
            onClick={handleAdd}
            className="flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs font-sans font-medium text-primary-foreground transition-colors hover:bg-primary/85"
          >
            <ShoppingCart className="h-3 w-3" />
            Add
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AccessoryCard;
