import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-bookstore.webp";

const HeroSection = () => (
  <section className="relative min-h-[88vh] flex items-center overflow-hidden">
    <div className="absolute inset-0">
      <img
        src={heroImage}
        alt="Warm bookstore interior with shelves of books"
        fetchPriority="high"
        decoding="async"
        className="w-full h-full object-cover"
      />
      <div className="hero-overlay absolute inset-0" />
    </div>

    <div className="container relative mx-auto px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-2xl border-l border-accent/50 pl-6 md:pl-10"
      >
        <span className="eyebrow text-accent">Since 2024 · Algeria</span>

        <h1 className="mt-5 font-display text-5xl font-bold leading-[0.95] text-primary-foreground md:text-7xl text-balance">
          Bookberries
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-5 font-display text-xl italic text-accent md:text-2xl"
        >
          Books choose their readers
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="mt-4 max-w-md text-base leading-relaxed text-primary-foreground/75"
        >
          Connecting readers across Algeria with the books they love — from timeless
          classics to the newest titles.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-9 flex flex-wrap gap-3"
        >
          <Button variant="hero" size="lg" asChild>
            <Link to="/shop">Shop the Collection</Link>
          </Button>
          <Button variant="warm" size="lg" asChild>
            <Link to="/request">Request a Book</Link>
          </Button>
        </motion.div>

        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 flex flex-wrap gap-x-10 gap-y-4 border-t border-primary-foreground/15 pt-6"
        >
          {[
            { k: "58", v: "Wilayas served" },
            { k: "7–14", v: "Days delivery" },
            { k: "COD", v: "Pay on delivery" },
          ].map((s) => (
            <div key={s.v}>
              <dt className="font-display text-2xl font-bold text-primary-foreground">{s.k}</dt>
              <dd className="font-sans text-[11px] uppercase tracking-[0.18em] text-primary-foreground/60">
                {s.v}
              </dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
