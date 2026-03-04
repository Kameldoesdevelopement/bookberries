import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const RequestBook = () => {
  const [form, setForm] = useState({ name: "", email: "", bookTitle: "", author: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.bookTitle) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("book_requests").insert({
      name: form.name,
      email: form.email,
      requested_title: form.bookTitle,
      author: form.author,
      message: form.message,
    });
    setLoading(false);
    if (error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    setSubmitted(true);
    toast.success("Request submitted! We'll look into it.");
  };

  const inputClass =
    "w-full rounded-lg border border-input bg-background px-4 py-3 font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow";

  return (
    <main className="min-h-screen parchment-bg">
      <div className="container mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-lg">
          <h1 className="font-display text-3xl font-bold text-foreground text-center md:text-4xl">Request a Book</h1>
          <p className="mt-3 text-center text-muted-foreground mb-10">Can't find what you're looking for? Tell us and we'll try to get it for you.</p>

          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-lg border border-border bg-card p-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
                <Send className="h-6 w-6 text-primary" />
              </div>
              <h2 className="font-display text-xl font-semibold text-foreground mb-2">Request Received</h2>
              <p className="text-sm text-muted-foreground">We'll review your request and do our best to source "{form.bookTitle}" for you.</p>
              <Button variant="warm" className="mt-6" onClick={() => { setSubmitted(false); setForm({ name: "", email: "", bookTitle: "", author: "", message: "" }); }}>
                Submit Another
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-1.5 block font-sans text-sm font-medium text-foreground">Name *</label>
                <input className={inputClass} placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="mb-1.5 block font-sans text-sm font-medium text-foreground">Email *</label>
                <input type="email" className={inputClass} placeholder="your@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="mb-1.5 block font-sans text-sm font-medium text-foreground">Book Title *</label>
                <input className={inputClass} placeholder="Title of the book" value={form.bookTitle} onChange={(e) => setForm({ ...form, bookTitle: e.target.value })} />
              </div>
              <div>
                <label className="mb-1.5 block font-sans text-sm font-medium text-foreground">Author (optional)</label>
                <input className={inputClass} placeholder="Author name" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
              </div>
              <div>
                <label className="mb-1.5 block font-sans text-sm font-medium text-foreground">Message (optional)</label>
                <textarea className={`${inputClass} min-h-[100px] resize-none`} placeholder="Any additional details..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </div>
              <Button variant="warm" size="lg" type="submit" className="w-full gap-2" disabled={loading}>
                <Send className="h-4 w-4" />
                {loading ? "Submitting..." : "Submit Request"}
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </main>
  );
};

export default RequestBook;
