import { Link } from "react-router-dom";
import { usePromotionBooks } from "@/hooks/useBooks";
import BookCard from "@/components/BookCard";
import SectionHeading from "@/components/SectionHeading";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { isOnPromotion } from "@/data/books";

const PromotionsSection = () => {
  const { data: promos = [], isLoading } = usePromotionBooks();

  if (!isLoading && promos.length === 0) return null;

  const [spotlight, ...rest] = promos;
  const grid = rest.slice(0, 4);

  const discount =
    spotlight && isOnPromotion(spotlight)
      ? Math.round(((spotlight.price - (spotlight.promo_price as number)) / spotlight.price) * 100)
      : 0;

  return (
    <section className="border-y border-border bg-parchment py-20 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="On sale"
            title="Current Promotions"
            description="Save on a curated selection of titles — for a limited time."
          />
          <Link
            to="/promotions"
            className="mb-10 hidden items-center gap-2 font-sans text-sm font-medium text-primary transition-all hover:gap-3 sm:inline-flex"
          >
            See all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="aspect-[4/3] animate-pulse rounded-md bg-muted lg:col-span-5" />
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:col-span-7">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[2/3] animate-pulse rounded-md bg-muted" />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Spotlight */}
            {spotlight && (
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-5"
              >
                <Link
                  to={`/book/${spotlight.id}`}
                  className="group flex h-full flex-col overflow-hidden rounded-md border border-border bg-card"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                    {spotlight.image_url ? (
                      <img
                        src={spotlight.image_url}
                        alt={spotlight.title}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className={`h-full w-full bg-gradient-to-b ${spotlight.cover_color}`} />
                    )}
                    {discount > 0 && (
                      <span className="absolute left-4 top-4 rounded-sm bg-accent px-2.5 py-1 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-accent-foreground">
                        −{discount}%
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="eyebrow">Featured deal</span>
                    <h3 className="mt-3 font-display text-2xl font-bold leading-tight text-foreground">
                      {spotlight.title}
                    </h3>
                    <p className="mt-1 font-sans text-sm text-muted-foreground">{spotlight.author}</p>
                    {spotlight.description && (
                      <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                        {spotlight.description}
                      </p>
                    )}
                    <div className="mt-auto flex items-baseline gap-3 pt-6">
                      <span className="font-display text-2xl font-bold text-primary">
                        {(isOnPromotion(spotlight)
                          ? (spotlight.promo_price as number)
                          : spotlight.price
                        ).toLocaleString()}{" "}
                        DZD
                      </span>
                      {isOnPromotion(spotlight) && (
                        <span className="font-sans text-sm text-muted-foreground line-through">
                          {spotlight.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.article>
            )}

            {/* Grid */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:col-span-7 lg:grid-cols-4">
              {grid.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 text-center sm:hidden">
          <Link
            to="/promotions"
            className="inline-flex items-center gap-2 font-sans text-sm font-medium text-primary"
          >
            See all promotions <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PromotionsSection;
