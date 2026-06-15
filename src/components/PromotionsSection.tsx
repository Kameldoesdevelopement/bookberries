import { Link } from "react-router-dom";
import { usePromotionBooks } from "@/hooks/useBooks";
import BookCard from "@/components/BookCard";
import { motion } from "framer-motion";
import { Tag, ArrowRight } from "lucide-react";

const PromotionsSection = () => {
  const { data: promos = [], isLoading } = usePromotionBooks();

  if (!isLoading && promos.length === 0) return null;

  const featured = promos.slice(0, 5);

  return (
    <section className="py-20 bg-accent/5 border-y border-border">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-3 py-1 mb-4">
            <Tag className="h-3.5 w-3.5 text-accent-foreground" />
            <span className="font-sans text-xs font-semibold text-accent-foreground uppercase tracking-wider">
              On Sale
            </span>
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Current Promotions
          </h2>
          <p className="mt-3 text-muted-foreground">
            Save on a curated selection of titles — for a limited time.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
              {featured.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
            {promos.length > 5 && (
              <div className="mt-10 text-center">
                <Link
                  to="/promotions"
                  className="inline-flex items-center gap-2 font-sans text-sm font-medium text-primary hover:gap-3 transition-all"
                >
                  See all promotions <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default PromotionsSection;
