import { useParams, Link, useNavigate } from "react-router-dom";
import { useBook, useBooks } from "@/hooks/useBooks";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import BookCard from "@/components/BookCard";
import { getEffectivePrice, isOnPromotion } from "@/data/books";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { data: book, isLoading } = useBook(id);
  const { data: allBooks = [] } = useBooks();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center parchment-bg">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center parchment-bg">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-foreground mb-4">Book not found</h1>
          <Button variant="warm" asChild><Link to="/shop">Back to Shop</Link></Button>
        </div>
      </div>
    );
  }

  const related = allBooks.filter((b) => b.id !== book.id && b.genre.some((g) => book.genre.includes(g))).slice(0, 4);

  const handleAdd = () => {
    addToCart(book);
    toast.success(`"${book.title}" added to cart`);
  };

  return (
    <main className="min-h-screen parchment-bg">
      <div className="container mx-auto px-4 py-12">
        <button onClick={() => navigate(-1)} className="mb-8 flex items-center gap-2 font-sans text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />Back
        </button>

        <div className="grid gap-12 md:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex justify-center">
            {book.image_url ? (
              <div className="aspect-[2/3] w-full max-w-sm rounded-lg overflow-hidden shadow-xl">
                <img src={book.image_url} alt={book.title} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className={`aspect-[2/3] w-full max-w-sm rounded-lg bg-gradient-to-b ${book.cover_color} overflow-hidden shadow-xl`}>
                <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                  <div className={`w-16 h-0.5 ${book.cover_accent} mb-6 opacity-60`} />
                  <h2 className="font-display text-2xl font-bold text-primary-foreground leading-tight mb-3">{book.title}</h2>
                  <p className="font-sans text-sm text-primary-foreground/70">{book.author}</p>
                  <div className={`w-10 h-0.5 ${book.cover_accent} mt-6 opacity-40`} />
                </div>
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex flex-col justify-center">
            <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">{book.title}</h1>
            <p className="mt-2 font-sans text-lg text-muted-foreground">{book.author}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {book.genre.map((g) => (<Link key={g} to={`/shop?genre=${g}`} className="genre-tag">{g}</Link>))}
            </div>
            <p className="mt-6 text-foreground/80 leading-relaxed">{book.description}</p>
            <div className="mt-8 flex items-center gap-6">
              <span className="font-display text-3xl font-bold text-primary">{book.price.toLocaleString()} DZD</span>
              <Button variant="warm" size="lg" onClick={handleAdd} className="gap-2">
                <ShoppingCart className="h-4 w-4" />Add to Cart
              </Button>
            </div>
          </motion.div>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-2xl font-bold text-foreground mb-8">You might also like</h2>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
              {related.map((b) => (<BookCard key={b.id} book={b} />))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default BookDetails;
