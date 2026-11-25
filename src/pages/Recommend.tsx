import { useState } from "react";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useBooks } from "@/hooks/useBooks";
import BookCard from "@/components/BookCard";
import { useTheme } from "@/context/ThemeContext";

type Pick = { id: string; why: string };

const Recommend = () => {
  const { theme } = useTheme();
  const { data: books = [] } = useBooks();
  const [mood, setMood] = useState("");
  const [picks, setPicks] = useState<Pick[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ask = async () => {
    setLoading(true); setError(null);
    const { data, error } = await supabase.functions.invoke("recommend-books", { body: { mood } });
    setLoading(false);
    if (error || data?.error) {
      let msg = data?.error;
      try { msg ??= (await (error as { context?: Response })?.context?.json())?.error; } catch { /* ignore */ }
      setError(msg || "Couldn't get recommendations right now. Please try again.");
      return;
    }
    setPicks(data.picks ?? []);
  };

  const found = (picks ?? []).map((p) => ({ ...p, book: books.find((b) => b.id === p.id) })).filter((p) => p.book);

  return (
    <main className="min-h-screen parchment-bg">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-center font-display text-4xl font-bold text-foreground">
          {theme === "cozy" ? "Tell the bookseller your mood" : "Find your next read"}
        </h1>
        <p className="mt-2 text-center text-muted-foreground">
          Describe your reading mood, favorite genres, or books you loved. Our AI-powered bookseller picks matching titles from our shelves.
        </p>
        <div className="mx-auto mt-8 max-w-2xl">
          <textarea value={mood} onChange={(e) => setMood(e.target.value)} rows={4} maxLength={1000}
            placeholder="e.g. Something slow and comforting like The Little Prince, or a dark academia mystery…"
            className="w-full rounded-lg border border-input bg-background p-4 font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          <button onClick={ask} disabled={loading || mood.trim().length < 3}
            className="cozy-lift mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-sans text-sm font-semibold text-primary-foreground disabled:opacity-50">
            <Sparkles className="h-4 w-4" />{loading ? (theme === "cozy" ? "Browsing the shelves…" : "Finding books…") : "Recommend books"}
          </button>
          {error && <p className="mt-3 text-center text-sm text-destructive">{error}</p>}
        </div>
        {picks && (found.length ? (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
            {found.map((p) => (
              <div key={p.id}><BookCard book={p.book!} /><p className="mt-2 font-sans text-xs text-muted-foreground">{p.why}</p></div>
            ))}
          </div>
        ) : <p className="mt-10 text-center text-muted-foreground">No close matches this time. Try describing it differently.</p>)}
      </div>
    </main>
  );
};
export default Recommend;
