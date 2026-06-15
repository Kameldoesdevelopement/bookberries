import { useParams, useNavigate } from "react-router-dom";
import { useAccessories } from "@/hooks/useAccessories";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import AccessoryCard from "@/components/AccessoryCard";

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

const AccessoryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { data: accessories = [], isLoading } = useAccessories();

  const accessory = accessories.find((a) => a.id === id);
  const related = accessories.filter((a) => a.id !== id).slice(0, 4);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center parchment-bg">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!accessory) {
    return (
      <div className="min-h-screen flex items-center justify-center parchment-bg">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-foreground mb-4">Accessory not found</h1>
          <Button variant="warm" onClick={() => navigate("/shop")}>Back to Shop</Button>
        </div>
      </div>
    );
  }

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
      is_promotion: false,
      promo_price: null,
      created_at: accessory.created_at,
      image_url: accessory.image_url,
    });
    toast.success(`"${accessory.name}" added to cart`);
  };

  return (
    <main className="min-h-screen parchment-bg">
      <div className="container mx-auto px-4 py-12">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 font-sans text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />Back
        </button>

        <div className="grid gap-12 md:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex justify-center">
            <div className="aspect-square w-full max-w-sm rounded-lg overflow-hidden shadow-xl bg-muted">
              {imageUrl ? (
                <img src={imageUrl} alt={accessory.name} className="w-full h-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center p-8 text-center bg-secondary">
                  <h2 className="font-display text-2xl font-bold text-foreground">{accessory.name}</h2>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex flex-col justify-center">
            <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">{accessory.name}</h1>
            <p className="mt-2 font-sans text-lg text-muted-foreground">{accessory.category}</p>
            {accessory.description && (
              <p className="mt-6 text-foreground/80 leading-relaxed">{accessory.description}</p>
            )}
            <div className="mt-8 flex items-center gap-6">
              <span className="font-display text-3xl font-bold text-primary">{accessory.price.toLocaleString()} DZD</span>
              <Button variant="warm" size="lg" onClick={handleAdd} className="gap-2">
                <ShoppingCart className="h-4 w-4" />Add to Cart
              </Button>
            </div>
          </motion.div>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-2xl font-bold text-foreground mb-8">More Accessories</h2>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
              {related.map((a) => <AccessoryCard key={a.id} accessory={a} />)}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default AccessoryDetails;
