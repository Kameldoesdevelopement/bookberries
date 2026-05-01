import { useState, useEffect } from "react";
import { GENRES } from "@/data/books";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Package, MessageSquare, Plus, Check, Trash2, ShoppingBag, Library, BookOpen } from "lucide-react";
import ManageBooks from "@/components/admin/ManageBooks";
import ManageAccessories from "@/components/admin/ManageAccessories";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import type { Tables } from "@/integrations/supabase/types";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";

type Order = Tables<"orders"> & { order_items: Tables<"order_items">[] };
type BookRequest = Tables<"book_requests">;

const Admin = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [tab, setTab] = useState<"orders" | "requests" | "add-book" | "add-accessory" | "manage-books" | "manage-accessories">("orders");
  const queryClient = useQueryClient();

  const [orders, setOrders] = useState<Order[]>([]);
  const [requests, setRequests] = useState<BookRequest[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);

  const [newBook, setNewBook] = useState({
    title: "", author: "", price: "", description: "", genre: [] as string[], isTrending: false, imageUrl: "",
  });

  const [newAccessory, setNewAccessory] = useState({
    name: "", description: "", price: "", category: "", imageUrl: "",
  });

  const fetchOrders = async () => {
    setLoadingOrders(true);
    const { data } = await supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false });
    setOrders((data as Order[]) || []);
    setLoadingOrders(false);
  };

  const fetchRequests = async () => {
    setLoadingRequests(true);
    const { data } = await supabase.from("book_requests").select("*").order("created_at", { ascending: false });
    setRequests(data || []);
    setLoadingRequests(false);
  };

  useEffect(() => {
    // Set up listener BEFORE getSession to avoid race
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (!newSession) {
        setIsAdmin(false);
        setAuthChecked(true);
      }
    });

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (!s) {
        setIsAdmin(false);
        setAuthChecked(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check admin role whenever session changes
  useEffect(() => {
    if (!session) return;
    (async () => {
      const { data, error } = await supabase.rpc("is_current_user_admin" as never);
      setIsAdmin(!error && data === true);
      setAuthChecked(true);
    })();
  }, [session]);

  useEffect(() => {
    if (isAdmin) {
      fetchOrders();
      fetchRequests();
    }
  }, [isAdmin]);

  // Redirect to /auth if no session, after auth check completes
  useEffect(() => {
    if (authChecked && !session) {
      navigate("/auth");
    }
  }, [authChecked, session, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const markOrderCompleted = async (id: string) => {
    await supabase.from("orders").update({ status: "completed" }).eq("id", id);
    setOrders(orders.map((o) => o.id === id ? { ...o, status: "completed" } : o));
    toast.success("Order marked as completed");
  };

  const deleteOrder = async (id: string) => {
    await supabase.from("orders").delete().eq("id", id);
    setOrders(orders.filter((o) => o.id !== id));
    toast.success("Order deleted");
  };

  const resolveRequest = async (id: string) => {
    await supabase.from("book_requests").update({ resolved: true }).eq("id", id);
    setRequests(requests.map((r) => r.id === id ? { ...r, resolved: true } : r));
    toast.success("Request resolved");
  };

  const addBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBook.title || !newBook.author || !newBook.price) {
      toast.error("Fill in required fields.");
      return;
    }
    const { error } = await supabase.from("books").insert({
      title: newBook.title,
      author: newBook.author,
      price: parseInt(newBook.price),
      description: newBook.description,
      genre: newBook.genre,
      is_trending: newBook.isTrending,
      image_url: newBook.imageUrl,
    });
    if (error) {
      toast.error("Failed to add book.");
      return;
    }
    toast.success(`"${newBook.title}" added to the catalog!`);
    setNewBook({ title: "", author: "", price: "", description: "", genre: [], isTrending: false, imageUrl: "" });
    queryClient.invalidateQueries({ queryKey: ["books"] });
  };

  const addAccessory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccessory.name || !newAccessory.price) {
      toast.error("Fill in required fields.");
      return;
    }
    const { error } = await supabase.from("accessories").insert({
      name: newAccessory.name,
      description: newAccessory.description,
      price: parseInt(newAccessory.price),
      category: newAccessory.category || "General",
      image_url: newAccessory.imageUrl,
    });
    if (error) {
      toast.error("Failed to add accessory.");
      return;
    }
    toast.success(`"${newAccessory.name}" added!`);
    setNewAccessory({ name: "", description: "", price: "", category: "", imageUrl: "" });
    queryClient.invalidateQueries({ queryKey: ["accessories"] });
  };

  if (!authChecked) {
    return (
      <main className="min-h-screen parchment-bg flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </main>
    );
  }

  if (!session) {
    navigate("/auth");
    return null;
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen parchment-bg flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-md w-full px-4 text-center">
          <div className="rounded-lg border border-border bg-card p-8">
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">Not authorized</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Your account ({session.user.email}) does not have admin access. Ask another admin to grant you the role.
            </p>
            <Button variant="warm" onClick={handleLogout}>Sign out</Button>
          </div>
        </motion.div>
      </main>
    );
  }

  const inputClass = "w-full rounded-lg border border-input bg-background px-4 py-3 font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";
  const tabClass = (t: string) => `px-4 py-2 font-sans text-sm font-medium rounded-lg transition-colors ${tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`;

  return (
    <main className="min-h-screen parchment-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
          <Button variant="ghost" onClick={handleLogout} className="font-sans text-sm">Logout</Button>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <button className={tabClass("orders")} onClick={() => setTab("orders")}><Package className="inline-block h-4 w-4 mr-1.5" />Orders</button>
          <button className={tabClass("requests")} onClick={() => setTab("requests")}><MessageSquare className="inline-block h-4 w-4 mr-1.5" />Requests</button>
          <button className={tabClass("add-book")} onClick={() => setTab("add-book")}><Plus className="inline-block h-4 w-4 mr-1.5" />Add Book</button>
          <button className={tabClass("add-accessory")} onClick={() => setTab("add-accessory")}><ShoppingBag className="inline-block h-4 w-4 mr-1.5" />Add Accessory</button>
          <button className={tabClass("manage-books")} onClick={() => setTab("manage-books")}><Library className="inline-block h-4 w-4 mr-1.5" />Manage Books</button>
          <button className={tabClass("manage-accessories")} onClick={() => setTab("manage-accessories")}><ShoppingBag className="inline-block h-4 w-4 mr-1.5" />Manage Accessories</button>
        </div>

        {tab === "orders" && (
          <div className="space-y-4">
            {loadingOrders ? (
              <p className="text-muted-foreground py-8 text-center">Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">No orders yet.</p>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="rounded-lg border border-border bg-card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="font-sans text-sm font-semibold text-foreground">{order.customer_name}</h3>
                      <p className="font-sans text-xs text-muted-foreground">{order.phone} · {order.wilaya} · {order.delivery_type}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-sans text-xs font-medium px-2 py-1 rounded-full ${order.status === "pending" ? "bg-accent/20 text-accent-foreground" : "bg-secondary text-secondary-foreground"}`}>
                        {order.status}
                      </span>
                      {order.status === "pending" && (
                        <Button size="sm" variant="warm" onClick={() => markOrderCompleted(order.id)}>
                          <Check className="h-3 w-3 mr-1" />Complete
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => deleteOrder(order.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="border-t border-border pt-3">
                    {order.order_items.map((item, i) => (
                      <span key={i} className="font-sans text-xs text-muted-foreground mr-3">{item.title} ×{item.quantity}</span>
                    ))}
                    <span className="font-sans text-sm font-bold text-primary float-right">{order.total_price.toLocaleString()} DZD</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "requests" && (
          <div className="space-y-4">
            {loadingRequests ? (
              <p className="text-muted-foreground py-8 text-center">Loading requests...</p>
            ) : requests.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">No requests yet.</p>
            ) : (
              requests.map((req) => (
                <div key={req.id} className="rounded-lg border border-border bg-card p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-sans text-sm font-semibold text-foreground">"{req.requested_title}" by {req.author || "Unknown"}</h3>
                      <p className="font-sans text-xs text-muted-foreground mt-1">{req.name} · {(req as any).phone || req.email}</p>
                      {req.message && <p className="font-sans text-xs text-muted-foreground mt-2 italic">"{req.message}"</p>}
                    </div>
                    {!req.resolved ? (
                      <Button size="sm" variant="warm" onClick={() => resolveRequest(req.id)}>
                        <Check className="h-3 w-3 mr-1" />Resolve
                      </Button>
                    ) : (
                      <span className="font-sans text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">Resolved</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "add-book" && (
          <div className="mx-auto max-w-lg">
            <form onSubmit={addBook} className="space-y-5">
              <div>
                <label className="mb-1.5 block font-sans text-sm font-medium text-foreground">Title *</label>
                <input className={inputClass} value={newBook.title} onChange={(e) => setNewBook({ ...newBook, title: e.target.value })} />
              </div>
              <div>
                <label className="mb-1.5 block font-sans text-sm font-medium text-foreground">Author *</label>
                <input className={inputClass} value={newBook.author} onChange={(e) => setNewBook({ ...newBook, author: e.target.value })} />
              </div>
              <div>
                <label className="mb-1.5 block font-sans text-sm font-medium text-foreground">Price (DZD) *</label>
                <input type="number" className={inputClass} value={newBook.price} onChange={(e) => setNewBook({ ...newBook, price: e.target.value })} />
              </div>
              <div>
                <label className="mb-1.5 block font-sans text-sm font-medium text-foreground">Cover Image URL</label>
                <input className={inputClass} placeholder="https://example.com/cover.jpg" value={newBook.imageUrl} onChange={(e) => setNewBook({ ...newBook, imageUrl: e.target.value })} />
                {newBook.imageUrl && (
                  <div className="mt-2 w-24 h-36 rounded overflow-hidden border border-border">
                    <img src={newBook.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <div>
                <label className="mb-1.5 block font-sans text-sm font-medium text-foreground">Description</label>
                <textarea className={`${inputClass} min-h-[100px] resize-none`} value={newBook.description} onChange={(e) => setNewBook({ ...newBook, description: e.target.value })} />
              </div>
              <div>
                <label className="mb-1.5 block font-sans text-sm font-medium text-foreground">Genres</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {GENRES.map((g) => (
                    <button key={g} type="button" onClick={() => setNewBook({
                      ...newBook,
                      genre: newBook.genre.includes(g) ? newBook.genre.filter((x) => x !== g) : [...newBook.genre, g],
                    })} className={`genre-tag ${newBook.genre.includes(g) ? "active" : ""}`}>{g}</button>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-2 font-sans text-sm text-foreground cursor-pointer">
                <input type="checkbox" checked={newBook.isTrending} onChange={(e) => setNewBook({ ...newBook, isTrending: e.target.checked })} className="accent-primary" />
                Mark as trending
              </label>
              <Button variant="warm" size="lg" type="submit" className="w-full gap-2">
                <BookOpen className="h-4 w-4" />Add to Catalog
              </Button>
            </form>
          </div>
        )}

        {tab === "add-accessory" && (
          <div className="mx-auto max-w-lg">
            <form onSubmit={addAccessory} className="space-y-5">
              <div>
                <label className="mb-1.5 block font-sans text-sm font-medium text-foreground">Name *</label>
                <input className={inputClass} value={newAccessory.name} onChange={(e) => setNewAccessory({ ...newAccessory, name: e.target.value })} />
              </div>
              <div>
                <label className="mb-1.5 block font-sans text-sm font-medium text-foreground">Price (DZD) *</label>
                <input type="number" className={inputClass} value={newAccessory.price} onChange={(e) => setNewAccessory({ ...newAccessory, price: e.target.value })} />
              </div>
              <div>
                <label className="mb-1.5 block font-sans text-sm font-medium text-foreground">Category</label>
                <input className={inputClass} placeholder="e.g. Bookmarks, Keychains, Lamps..." value={newAccessory.category} onChange={(e) => setNewAccessory({ ...newAccessory, category: e.target.value })} />
              </div>
              <div>
                <label className="mb-1.5 block font-sans text-sm font-medium text-foreground">Image URL</label>
                <input className={inputClass} placeholder="https://example.com/image.jpg" value={newAccessory.imageUrl} onChange={(e) => setNewAccessory({ ...newAccessory, imageUrl: e.target.value })} />
                {newAccessory.imageUrl && (
                  <div className="mt-2 w-24 h-24 rounded overflow-hidden border border-border">
                    <img src={newAccessory.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <div>
                <label className="mb-1.5 block font-sans text-sm font-medium text-foreground">Description</label>
                <textarea className={`${inputClass} min-h-[100px] resize-none`} value={newAccessory.description} onChange={(e) => setNewAccessory({ ...newAccessory, description: e.target.value })} />
              </div>
              <Button variant="warm" size="lg" type="submit" className="w-full gap-2">
                <ShoppingBag className="h-4 w-4" />Add Accessory
              </Button>
            </form>
          </div>
        )}

        {tab === "manage-books" && <ManageBooks />}
        {tab === "manage-accessories" && <ManageAccessories />}
      </div>
    </main>
  );
};

export default Admin;
