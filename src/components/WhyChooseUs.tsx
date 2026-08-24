import { Truck, BookOpen, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";

const features = [
  {
    icon: Truck,
    title: "All 58 Wilayas",
    description: "Delivery across Algeria with cash on delivery, typically within 7–14 days.",
  },
  {
    icon: BookOpen,
    title: "Curated Titles",
    description: "Thoughtfully selected books from local and global voices — nothing filler.",
  },
  {
    icon: MessageSquare,
    title: "Request a Book",
    description: "Can't find a title? Send us a request and we'll source it for you.",
  },
];

const WhyChooseUs = () => (
  <section className="border-t border-border bg-secondary/40 paper-texture py-20 md:py-24">
    <div className="container mx-auto px-4">
      <SectionHeading eyebrow="Why us" title="Why Bookberries?" align="center" />

      <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="bg-card p-8"
          >
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-sm border border-accent/40 bg-accent/10">
              <f.icon className="h-5 w-5 text-accent" />
            </div>
            <h3 className="mb-2 font-display text-xl font-semibold text-foreground">{f.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{f.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseUs;
