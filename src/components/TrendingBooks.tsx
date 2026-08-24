import BookCard from "@/components/BookCard";
import { useTrendingBooks } from "@/hooks/useBooks";
import { motion } from "framer-motion";

const TrendingBooks = () => {
  const { data: trending = [], isLoading } = useTrendingBooks();

  return (
    <section className="py-20 parchment-bg">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Trending Now
          </h2>
          <p className="mt-3 text-muted-foreground">
            What readers across Algeria are picking up this season.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
            {trending.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TrendingBooks;
