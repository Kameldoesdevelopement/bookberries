import { Link } from "react-router-dom";
import type { Book } from "@/data/books";
import { isOnPromotion } from "@/data/books";
import { motion } from "framer-motion";

interface BookCardProps {
  book: Book;
}

const BookCard = ({ book }: BookCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.4 }}
  >
    <Link to={`/book/${book.id}`} className="book-card block group">
      {/* Cover */}
      <div className="aspect-[2/3] relative overflow-hidden bg-secondary">
        {isOnPromotion(book) && (
          <span className="absolute top-2 left-2 z-10 rounded-sm bg-accent text-accent-foreground font-sans text-[10px] font-bold uppercase tracking-[0.14em] px-2 py-1">
            Sale
          </span>
        )}
        {book.image_url ? (
          <img src={book.image_url} alt={book.title} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className={`w-full h-full bg-gradient-to-b ${book.cover_color}`}>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <div className={`w-12 h-0.5 ${book.cover_accent} mb-4 opacity-60`} />
              <h3 className="font-display text-lg font-bold text-primary-foreground leading-tight mb-2">
                {book.title}
              </h3>
              <p className="font-sans text-xs text-primary-foreground/70">
                {book.author}
              </p>
              <div className={`w-8 h-0.5 ${book.cover_accent} mt-4 opacity-40`} />
            </div>
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-300" />
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-display text-[15px] font-semibold text-foreground leading-snug mb-1 line-clamp-1">
          {book.title}
        </h3>
        <p className="font-sans text-[11px] uppercase tracking-[0.1em] text-muted-foreground mb-3 line-clamp-1">{book.author}</p>
        <div className="flex items-center justify-between gap-2 border-t border-border/70 pt-3">
          <div className="flex items-baseline gap-1.5">
            <span className="font-sans text-sm font-bold text-primary">
              {(isOnPromotion(book) ? (book.promo_price as number) : book.price).toLocaleString()} DZD
            </span>
            {isOnPromotion(book) && (
              <span className="font-sans text-[10px] text-muted-foreground line-through">
                {book.price.toLocaleString()}
              </span>
            )}
          </div>
          <div className="hidden gap-1 sm:flex">
            {book.genre.slice(0, 1).map((g) => (
              <span key={g} className="genre-tag text-[10px] px-2 py-0.5">{g}</span>
            ))}
          </div>
        </div>
      </div>
    </Link>

  </motion.div>
);

export default BookCard;
