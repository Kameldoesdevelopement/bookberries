import { motion } from "framer-motion";
import { Instagram, Mail, MapPin } from "lucide-react";

const Contact = () => (
  <main className="min-h-screen parchment-bg">
    <div className="container mx-auto px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-lg text-center">
        <h1 className="font-display text-4xl font-bold text-foreground mb-4">Contact Us</h1>
        <p className="text-muted-foreground mb-12">We'd love to hear from you. Reach out through any of the channels below.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mx-auto max-w-md space-y-6">
        <a
          href="https://instagram.com/bookberries.bookstore"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 rounded-lg border border-border bg-card p-5 transition-all duration-200 hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
            <Instagram className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-sans text-sm font-semibold text-foreground">Instagram</h3>
            <p className="font-sans text-sm text-muted-foreground">@bookberries.bookstore</p>
          </div>
        </a>

        <a
          href="mailto:hidayatdekhili5@gmail.com"
          className="flex items-center gap-4 rounded-lg border border-border bg-card p-5 transition-all duration-200 hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-sans text-sm font-semibold text-foreground">Email</h3>
            <p className="font-sans text-sm text-muted-foreground">hidayatdekhili5@gmail.com</p>
          </div>
        </a>

        <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-sans text-sm font-semibold text-foreground">Location</h3>
            <p className="font-sans text-sm text-muted-foreground">Algeria — delivering to all 58 wilayas</p>
          </div>
        </div>
      </motion.div>
    </div>
  </main>
);

export default Contact;
