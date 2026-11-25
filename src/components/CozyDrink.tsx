import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

const DRINKS = [
  { id: "mint", emoji: "🍵", name: "Mint tea", line: "A glass of mint tea, just like home. Enjoy your reading!" },
  { id: "coffee", emoji: "☕", name: "Coffee", line: "Fresh coffee, nice and strong. Perfect for a page-turner." },
  { id: "cocoa", emoji: "🍫", name: "Hot chocolate", line: "Hot chocolate with extra warmth. Settle in and browse." },
];
const KEY = "bookberries-drink";

export default function CozyDrink() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const timer = useRef<number>();
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const [drink, setDrink] = useState<string | null>(() => { try { return localStorage.getItem(KEY); } catch { return null; } });
  if (theme !== "cozy") return null;
  const current = DRINKS.find((d) => d.id === drink);

  const choose = (id: string | null) => {
    setDrink(id);
    window.clearTimeout(timer.current);
    setLeaving(!!id);
    if (id) timer.current = window.setTimeout(() => { setLeaving(false); setOpen(false); navigate("/shop?view=shelf"); }, 1500);
    try { id ? localStorage.setItem(KEY, id) : localStorage.removeItem(KEY); } catch { /* visit only */ }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 font-sans">
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
            className="mb-3 w-64 rounded-xl border border-border bg-card p-4 text-card-foreground shadow-lg">
            {current ? (
              <>
                <p className="text-sm">{current.line}</p>
                {leaving && <p className="mt-1 text-xs text-muted-foreground">{current.name}, coming up. Off to the shelves…</p>}
                <div className="mt-3 flex gap-2">
                  <button onClick={() => choose(null)} className="cozy-lift rounded-md bg-secondary px-3 py-1.5 text-xs">Another drink</button>
                  {leaving && <button onClick={() => { window.clearTimeout(timer.current); setLeaving(false); }} className="cozy-lift rounded-md bg-secondary px-3 py-1.5 text-xs">Stay here</button>}
                  <button onClick={() => setOpen(false)} className="cozy-lift rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground">Thanks!</button>
                </div>
              </>
            ) : (
              <>
                <p className="font-display text-base">{greet}! Can I get you something warm?</p>
                <div className="mt-3 grid gap-2">
                  {DRINKS.map((d) => (
                    <button key={d.id} onClick={() => choose(d.id)}
                      className="cozy-lift flex items-center gap-2 rounded-md bg-secondary px-3 py-2 text-left text-sm">
                      <span className="text-lg">{d.emoji}</span>{d.name}
                    </button>
                  ))}
                </div>
                <a href="/recommend" className="mt-3 block text-xs text-primary underline">Not sure what to read? Ask our bookseller</a>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <button onClick={() => setOpen(!open)} aria-label={current ? `Your ${current.name}` : "Offer me a drink"}
        className="cozy-lift relative flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-2xl shadow-lg">
        {current?.emoji ?? "☕"}
        {current && <span className="cozy-cup-steam" aria-hidden="true" />}
      </button>
    </div>
  );
}
