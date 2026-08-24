import { motion } from "framer-motion";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

const SectionHeading = ({ eyebrow, title, description, align = "left" }: SectionHeadingProps) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className={align === "center" ? "mb-12 flex flex-col items-center text-center" : "mb-10"}
  >
    {eyebrow && (
      <span className="eyebrow">
        <span className="rule-gold w-8" />
        {eyebrow}
      </span>
    )}
    <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-foreground md:text-[2.6rem] text-balance">
      {title}
    </h2>
    {description && (
      <p className={`mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground ${align === "center" ? "" : ""}`}>
        {description}
      </p>
    )}
  </motion.div>
);

export default SectionHeading;
