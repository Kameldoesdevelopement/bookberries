import { Truck, BookOpen, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Truck,
    title: "All 58 Wilayas",
    description: "Fast delivery across Algeria with cash on delivery.",
  },
  {
    icon: BookOpen,
    title: "Curated Titles",
    description: "Thoughtfully selected books from local and global voices.",
  },
  {
    icon: MessageSquare,
    title: "Request Feature",
    description: "Can't find a book? Request it and we'll source it for you.",
  },
];

const WhyChooseUs = () => (
  <section className="py-20">
    <div className="container mx-auto px-4">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-display text-3xl font-bold text-center text-foreground mb-12 md:text-4xl"
      >
        Why Bookberries?
      </motion.h2>
      <div className="grid gap-8 md:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="text-center"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
              <f.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseUs;
