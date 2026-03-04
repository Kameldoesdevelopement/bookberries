import { Link } from "react-router-dom";
import type { Book } from "@/data/books";
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
      <div className={`aspect-[2/3] bg-gradient-to-b ${book.cover_color} relative overflow-hidden`}>
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
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-300" />
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-display text-sm font-semibold text-foreground leading-tight mb-1 line-clamp-1">
          {book.title}
        </h3>
        <p className="font-sans text-xs text-muted-foreground mb-2">{book.author}</p>
        <div className="flex items-center justify-between">
          <span className="font-sans text-sm font-bold text-primary">
            {book.price.toLocaleString()} DZD
          </span>
          <div className="flex gap-1">
            {book.genre.slice(0, 2).map((g) => (
              <span key={g} className="genre-tag text-[10px] px-2 py-0.5">{g}</span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

export default BookCard;
