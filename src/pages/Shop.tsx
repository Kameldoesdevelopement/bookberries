import { useState, useMemo } from "react";
import { books, GENRES } from "@/data/books";
import BookCard from "@/components/BookCard";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Shop = () => {
  const [search, setSearch] = useState("");
  const [activeGenre, setActiveGenre] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return books.filter((b) => {
      const matchSearch =
        !search ||
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase());
      const matchGenre = !activeGenre || b.genre.includes(activeGenre);
      return matchSearch && matchGenre;
    });
  }, [search, activeGenre]);

  return (
    <main className="min-h-screen parchment-bg">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <h1 className="font-display text-4xl font-bold text-foreground">Browse the Shelves</h1>
          <p className="mt-2 text-muted-foreground">Find your next read among our curated collection.</p>
        </motion.div>

        {/* Search */}
        <div className="relative mx-auto mb-8 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-input bg-background py-3 pl-10 pr-4 font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Genre filters */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setActiveGenre(null)}
            className={`genre-tag ${!activeGenre ? "active" : ""}`}
          >
            All
          </button>
          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => setActiveGenre(activeGenre === g ? null : g)}
              className={`genre-tag ${activeGenre === g ? "active" : ""}`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={activeGenre || "all"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4"
            >
              {filtered.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center"
            >
              <p className="text-muted-foreground">No books found. Try a different search or filter.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default Shop;
