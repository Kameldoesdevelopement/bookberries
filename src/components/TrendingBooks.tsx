import BookCard from "@/components/BookCard";
import { books } from "@/data/books";
import { motion } from "framer-motion";

const TrendingBooks = () => {
  const trending = books.filter((b) => b.isTrending);

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

        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
          {trending.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingBooks;
