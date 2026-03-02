import { useState } from "react";
import { books as initialBooks, type Book } from "@/data/books";
import { Button } from "@/components/ui/button";
import { GENRES } from "@/data/books";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Lock, Package, BookOpen, MessageSquare, Plus, Check, Eye, EyeOff } from "lucide-react";

const ADMIN_PASSWORD = "kutub2026";

interface Order {
  id: string;
  customerName: string;
  phone: string;
  wilaya: string;
  deliveryType: string;
  items: { title: string; quantity: number }[];
  totalPrice: number;
  status: "pending" | "completed";
}

interface BookRequest {
  id: string;
  name: string;
  email: string;
  requestedTitle: string;
  author: string;
  message: string;
  resolved: boolean;
}

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [tab, setTab] = useState<"orders" | "requests" | "add-book">("orders");

  // Demo data
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "1",
      customerName: "Ahmed B.",
      phone: "0551234567",
      wilaya: "Alger",
      deliveryType: "home",
      items: [{ title: "The Stranger", quantity: 1 }, { title: "Atomic Habits", quantity: 2 }],
      totalPrice: 4200,
      status: "pending",
    },
    {
      id: "2",
      customerName: "Fatima Z.",
      phone: "0667890123",
      wilaya: "Oran",
      deliveryType: "pickup",
      items: [{ title: "Nedjma", quantity: 1 }],
      totalPrice: 1100,
      status: "pending",
    },
  ]);

  const [requests, setRequests] = useState<BookRequest[]>([
    {
      id: "1",
      name: "Karim M.",
      email: "karim@example.com",
      requestedTitle: "Les Misérables",
      author: "Victor Hugo",
      message: "French edition preferred.",
      resolved: false,
    },
  ]);

  const [newBook, setNewBook] = useState({
    title: "", author: "", price: "", description: "", genre: [] as string[], isTrending: false,
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
    } else {
      toast.error("Incorrect password");
    }
  };

  if (!authenticated) {
    return (
      <main className="min-h-screen parchment-bg flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-sm w-full px-4"
        >
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <Lock className="mx-auto h-10 w-10 text-primary mb-4" />
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">Admin Access</h1>
            <p className="text-sm text-muted-foreground mb-6">Enter the admin password to continue.</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 pr-10 font-sans text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <Button variant="warm" className="w-full" type="submit">Enter</Button>
            </form>
          </div>
        </motion.div>
      </main>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-input bg-background px-4 py-3 font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  const tabClass = (t: string) =>
    `px-4 py-2 font-sans text-sm font-medium rounded-lg transition-colors ${
      tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
    }`;

  return (
    <main className="min-h-screen parchment-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
          <Button variant="ghost" onClick={() => setAuthenticated(false)} className="font-sans text-sm">
            Logout
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button className={tabClass("orders")} onClick={() => setTab("orders")}>
            <Package className="inline-block h-4 w-4 mr-1.5" />Orders
          </button>
          <button className={tabClass("requests")} onClick={() => setTab("requests")}>
            <MessageSquare className="inline-block h-4 w-4 mr-1.5" />Requests
          </button>
          <button className={tabClass("add-book")} onClick={() => setTab("add-book")}>
            <Plus className="inline-block h-4 w-4 mr-1.5" />Add Book
          </button>
        </div>

        {/* Orders */}
        {tab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">No orders yet.</p>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="rounded-lg border border-border bg-card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="font-sans text-sm font-semibold text-foreground">{order.customerName}</h3>
                      <p className="font-sans text-xs text-muted-foreground">{order.phone} · {order.wilaya} · {order.deliveryType}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`font-sans text-xs font-medium px-2 py-1 rounded-full ${order.status === "pending" ? "bg-accent/20 text-accent-foreground" : "bg-secondary text-secondary-foreground"}`}>
                        {order.status}
                      </span>
                      {order.status === "pending" && (
                        <Button size="sm" variant="warm" onClick={() => setOrders(orders.map((o) => o.id === order.id ? { ...o, status: "completed" } : o))}>
                          <Check className="h-3 w-3 mr-1" />Complete
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="border-t border-border pt-3">
                    {order.items.map((item, i) => (
                      <span key={i} className="font-sans text-xs text-muted-foreground mr-3">{item.title} ×{item.quantity}</span>
                    ))}
                    <span className="font-sans text-sm font-bold text-primary float-right">{order.totalPrice.toLocaleString()} DZD</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Requests */}
        {tab === "requests" && (
          <div className="space-y-4">
            {requests.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">No requests yet.</p>
            ) : (
              requests.map((req) => (
                <div key={req.id} className="rounded-lg border border-border bg-card p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-sans text-sm font-semibold text-foreground">"{req.requestedTitle}" by {req.author || "Unknown"}</h3>
                      <p className="font-sans text-xs text-muted-foreground mt-1">{req.name} · {req.email}</p>
                      {req.message && <p className="font-sans text-xs text-muted-foreground mt-2 italic">"{req.message}"</p>}
                    </div>
                    {!req.resolved && (
                      <Button size="sm" variant="warm" onClick={() => setRequests(requests.map((r) => r.id === req.id ? { ...r, resolved: true } : r))}>
                        <Check className="h-3 w-3 mr-1" />Resolve
                      </Button>
                    )}
                    {req.resolved && <span className="font-sans text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">Resolved</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Add Book */}
        {tab === "add-book" && (
          <div className="mx-auto max-w-lg">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newBook.title || !newBook.author || !newBook.price) {
                  toast.error("Fill in required fields.");
                  return;
                }
                toast.success(`"${newBook.title}" added to the catalog!`);
                setNewBook({ title: "", author: "", price: "", description: "", genre: [], isTrending: false });
              }}
              className="space-y-5"
            >
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
                <label className="mb-1.5 block font-sans text-sm font-medium text-foreground">Description</label>
                <textarea className={`${inputClass} min-h-[100px] resize-none`} value={newBook.description} onChange={(e) => setNewBook({ ...newBook, description: e.target.value })} />
              </div>
              <div>
                <label className="mb-1.5 block font-sans text-sm font-medium text-foreground">Genres</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {GENRES.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setNewBook({
                        ...newBook,
                        genre: newBook.genre.includes(g) ? newBook.genre.filter((x) => x !== g) : [...newBook.genre, g],
                      })}
                      className={`genre-tag ${newBook.genre.includes(g) ? "active" : ""}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-2 font-sans text-sm text-foreground cursor-pointer">
                <input type="checkbox" checked={newBook.isTrending} onChange={(e) => setNewBook({ ...newBook, isTrending: e.target.checked })} className="accent-primary" />
                Mark as trending
              </label>
              <Button variant="warm" size="lg" type="submit" className="w-full gap-2">
                <BookOpen className="h-4 w-4" />
                Add to Catalog
              </Button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
};

export default Admin;
