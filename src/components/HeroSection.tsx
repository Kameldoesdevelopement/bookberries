import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-bookstore.webp";

const HeroSection = () => (
  <section className="relative min-h-[85vh] flex items-center overflow-hidden">
    <div className="absolute inset-0">
      <img src={heroImage} alt="Warm bookstore interior" fetchPriority="high" decoding="async" className="w-full h-full object-cover" />
      <div className="hero-overlay absolute inset-0" />
    </div>

    <div className="container relative mx-auto px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-2xl"
      >
        <h1 className="font-display text-5xl font-bold leading-tight text-primary-foreground md:text-7xl text-balance">
          Bookberries
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-6 max-w-lg text-lg text-primary-foreground/80 leading-relaxed italic"
        >
          Books choose their readers
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-4 max-w-lg text-base text-primary-foreground/70 leading-relaxed"
        >
          Connecting readers across Algeria with the books they love — from timeless classics to the newest titles.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-8 flex flex-wrap gap-4"
        >
          <Button variant="hero" size="lg" asChild>
            <Link to="/shop">Shop Now</Link>
          </Button>
          <Button
            variant="warm"
            size="lg"
            asChild
          >
            <Link to="/request">Request a Book</Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
