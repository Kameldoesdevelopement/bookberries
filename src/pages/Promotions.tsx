import { usePromotionBooks } from "@/hooks/useBooks";
import BookCard from "@/components/BookCard";
import { motion } from "framer-motion";
import { Tag } from "lucide-react";

const Promotions = () => {
  const { data: books = [], isLoading } = usePromotionBooks();

  return (
    <main className="min-h-screen parchment-bg">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-3 py-1 mb-4">
            <Tag className="h-3.5 w-3.5 text-accent-foreground" />
            <span className="font-sans text-xs font-semibold text-accent-foreground uppercase tracking-wider">
              Limited Time
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Promotions
          </h1>
          <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
            Hand-picked books on sale right now. Grab them before they're gone.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No promotions right now — check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Promotions;
