import BookCard from "@/components/BookCard";
import SectionHeading from "@/components/SectionHeading";
import { useTrendingBooks } from "@/hooks/useBooks";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const TrendingBooks = () => {
  const { data: trending = [], isLoading } = useTrendingBooks();

  return (
    <section className="py-20 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="This season"
            title="Trending Now"
            description="What readers across Algeria are picking up right now."
          />
          <Link
            to="/shop"
            className="mb-10 hidden items-center gap-2 font-sans text-sm font-medium text-primary transition-all hover:gap-3 sm:inline-flex"
          >
            Browse all books <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="aspect-[2/3] animate-pulse rounded-md bg-muted" />
              ))
            : trending.map((book) => <BookCard key={book.id} book={book} />)}
        </div>
      </div>
    </section>
  );
};

export default TrendingBooks;
