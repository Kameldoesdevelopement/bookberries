import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { WILAYAS } from "@/data/books";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", wilaya: "", deliveryType: "home" });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (items.length === 0 && !success) {
    navigate("/cart");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.wilaya) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    
    // Create order
    const { data: order, error: orderError } = await supabase.from("orders").insert({
      customer_name: form.name,
      phone: form.phone,
      wilaya: form.wilaya,
      delivery_type: form.deliveryType,
      total_price: totalPrice,
    }).select().single();

    if (orderError || !order) {
      toast.error("Failed to place order. Please try again.");
      setLoading(false);
      return;
    }

    // Create order items
    const { error: itemsError } = await supabase.from("order_items").insert(
      items.map((item) => ({
        order_id: order.id,
        book_id: item.book.id,
        title: item.book.title,
        quantity: item.quantity,
        price: item.book.price,
      }))
    );

    setLoading(false);
    if (itemsError) {
      toast.error("Order placed but items may not have saved correctly.");
    }
    
    setSuccess(true);
    clearCart();
    toast.success("Order placed successfully!");
  };

  const inputClass =
    "w-full rounded-lg border border-input bg-background px-4 py-3 font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow";

  if (success) {
    return (
      <main className="min-h-screen parchment-bg flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto max-w-md text-center p-8">
          <CheckCircle className="mx-auto h-16 w-16 text-primary mb-4" />
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-6">Your order has been placed. We'll deliver it to {form.wilaya} soon. Cash on delivery.</p>
          <Button variant="warm" onClick={() => navigate("/shop")}>Continue Shopping</Button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen parchment-bg">
      <div className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-lg">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Checkout</h1>
          <p className="text-muted-foreground mb-8">Cash on delivery — no payment needed now.</p>

          <div className="rounded-lg border border-border bg-card p-4 mb-8">
            <h2 className="font-sans text-sm font-semibold text-foreground mb-3">Your Items</h2>
            {items.map((item) => (
              <div key={item.book.id} className="flex justify-between py-1.5 border-b border-border last:border-0">
                <span className="font-sans text-sm text-foreground">{item.book.title} × {item.quantity}</span>
                <span className="font-sans text-sm font-medium text-primary">{(item.book.price * item.quantity).toLocaleString()} DZD</span>
              </div>
            ))}
            <div className="flex justify-between pt-3 mt-2">
              <span className="font-sans text-sm font-semibold text-foreground">Total</span>
              <span className="font-display text-lg font-bold text-primary">{totalPrice.toLocaleString()} DZD</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block font-sans text-sm font-medium text-foreground">Full Name *</label>
              <input className={inputClass} placeholder="Your full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="mb-1.5 block font-sans text-sm font-medium text-foreground">Phone Number *</label>
              <input type="tel" className={inputClass} placeholder="0XXX XXX XXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="mb-1.5 block font-sans text-sm font-medium text-foreground">Wilaya *</label>
              <select className={inputClass} value={form.wilaya} onChange={(e) => setForm({ ...form, wilaya: e.target.value })}>
                <option value="">Select your wilaya</option>
                {WILAYAS.map((w) => (<option key={w} value={w}>{w}</option>))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block font-sans text-sm font-medium text-foreground">Delivery Type</label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2 font-sans text-sm text-foreground cursor-pointer">
                  <input type="radio" name="delivery" checked={form.deliveryType === "home"} onChange={() => setForm({ ...form, deliveryType: "home" })} className="accent-primary" />
                  Home Delivery
                </label>
                <label className="flex items-center gap-2 font-sans text-sm text-foreground cursor-pointer">
                  <input type="radio" name="delivery" checked={form.deliveryType === "pickup"} onChange={() => setForm({ ...form, deliveryType: "pickup" })} className="accent-primary" />
                  Wilaya Pickup
                </label>
              </div>
            </div>
            <Button variant="warm" size="lg" type="submit" className="w-full" disabled={loading}>
              {loading ? "Placing Order..." : "Place Order"}
            </Button>
          </form>
        </motion.div>
      </div>
    </main>
  );
};

export default Checkout;
