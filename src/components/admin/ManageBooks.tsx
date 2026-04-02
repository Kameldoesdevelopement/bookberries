import { useState, useEffect } from "react";
import { GENRES } from "@/data/books";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, Pencil, X, Save, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import type { Tables } from "@/integrations/supabase/types";

type Book = Tables<"books">;

const inputClass = "w-full rounded-lg border border-input bg-background px-4 py-3 font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

const ManageBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Book>>({});
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const fetchBooks = async () => {
    setLoading(true);
    const { data } = await supabase.from("books").select("*").order("created_at", { ascending: false });
    setBooks(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchBooks(); }, []);

  const deleteBook = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    const { error } = await supabase.from("books").delete().eq("id", id);
    if (error) { toast.error("Failed to delete: " + error.message); return; }
    setBooks(books.filter((b) => b.id !== id));
    queryClient.invalidateQueries({ queryKey: ["books"] });
    toast.success(`"${title}" deleted`);
  };

  const startEdit = (book: Book) => {
    setEditingId(book.id);
    setEditData({ ...book });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const { error } = await supabase.from("books").update({
      title: editData.title,
      author: editData.author,
      price: editData.price,
      description: editData.description,
      genre: editData.genre,
      is_trending: editData.is_trending,
      image_url: editData.image_url,
    }).eq("id", editingId);
    if (error) { toast.error("Failed to update"); return; }
    setBooks(books.map((b) => b.id === editingId ? { ...b, ...editData } : b));
    queryClient.invalidateQueries({ queryKey: ["books"] });
    toast.success("Book updated");
    cancelEdit();
  };

  const filtered = books.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="text-muted-foreground py-8 text-center">Loading books...</p>;

  return (
    <div className="space-y-4">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input className={`${inputClass} pl-10`} placeholder="Search books..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <p className="text-xs text-muted-foreground">{filtered.length} book{filtered.length !== 1 ? "s" : ""}</p>

      {filtered.map((book) => (
        <div key={book.id} className="rounded-lg border border-border bg-card p-4">
          {editingId === book.id ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-sans text-xs font-medium text-muted-foreground">Title</label>
                  <input className={inputClass} value={editData.title || ""} onChange={(e) => setEditData({ ...editData, title: e.target.value })} />
                </div>
                <div>
                  <label className="mb-1 block font-sans text-xs font-medium text-muted-foreground">Author</label>
                  <input className={inputClass} value={editData.author || ""} onChange={(e) => setEditData({ ...editData, author: e.target.value })} />
                </div>
                <div>
                  <label className="mb-1 block font-sans text-xs font-medium text-muted-foreground">Price (DZD)</label>
                  <input type="number" className={inputClass} value={editData.price || ""} onChange={(e) => setEditData({ ...editData, price: parseInt(e.target.value) || 0 })} />
                </div>
                <div>
                  <label className="mb-1 block font-sans text-xs font-medium text-muted-foreground">Image URL</label>
                  <input className={inputClass} value={editData.image_url || ""} onChange={(e) => setEditData({ ...editData, image_url: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="mb-1 block font-sans text-xs font-medium text-muted-foreground">Description</label>
                <textarea className={`${inputClass} min-h-[80px] resize-none`} value={editData.description || ""} onChange={(e) => setEditData({ ...editData, description: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block font-sans text-xs font-medium text-muted-foreground">Genres</label>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {GENRES.map((g) => (
                    <button key={g} type="button" onClick={() => setEditData({
                      ...editData,
                      genre: (editData.genre || []).includes(g)
                        ? (editData.genre || []).filter((x) => x !== g)
                        : [...(editData.genre || []), g],
                    })} className={`genre-tag text-xs ${(editData.genre || []).includes(g) ? "active" : ""}`}>{g}</button>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-2 font-sans text-xs text-foreground cursor-pointer">
                <input type="checkbox" checked={editData.is_trending || false} onChange={(e) => setEditData({ ...editData, is_trending: e.target.checked })} className="accent-primary" />
                Trending
              </label>
              <div className="flex gap-2">
                <Button size="sm" variant="warm" onClick={saveEdit}><Save className="h-3 w-3 mr-1" />Save</Button>
                <Button size="sm" variant="ghost" onClick={cancelEdit}><X className="h-3 w-3 mr-1" />Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-12 h-16 rounded overflow-hidden border border-border flex-shrink-0 bg-muted">
                {book.image_url ? (
                  <img src={book.image_url} alt={book.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No img</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-sans text-sm font-semibold text-foreground truncate">{book.title}</h3>
                <p className="font-sans text-xs text-muted-foreground">{book.author} · {book.price} DZD</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {book.genre?.slice(0, 3).map((g) => (
                    <span key={g} className="font-sans text-[10px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">{g}</span>
                  ))}
                  {book.is_trending && <span className="font-sans text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">Trending</span>}
                </div>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <Button size="sm" variant="ghost" onClick={() => startEdit(book)}><Pencil className="h-3 w-3" /></Button>
                <Button size="sm" variant="ghost" onClick={() => deleteBook(book.id, book.title)}><Trash2 className="h-3 w-3" /></Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ManageBooks;
