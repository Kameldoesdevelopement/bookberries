import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { WILAYAS } from "@/data/books";
import { WILAYA_DESKS, NO_DESK_WILAYAS, WILAYA_PRICING } from "@/data/desks";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getEffectivePrice, isOnPromotion } from "@/data/books";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    wilaya: "",
    deliveryType: "home" as "home" | "pickup",
    address: "",
    desk: "",
    notes: "",
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (items.length === 0 && !success) {
    navigate("/cart");
    return null;
  }

  const canPickup = !NO_DESK_WILAYAS.includes(form.wilaya) && 
    (form.wilaya ? (WILAYA_PRICING[form.wilaya]?.desk ?? 0) > 0 : true);
  const desks = form.wilaya ? WILAYA_DESKS[form.wilaya] : null;

  const effectiveDeliveryType = !canPickup ? "home" : form.deliveryType;
  
  const pricing = form.wilaya ? WILAYA_PRICING[form.wilaya] : null;
  const deliveryFee = pricing
    ? (effectiveDeliveryType === "home" ? pricing.home : pricing.desk)
    : 0;
  const grandTotal = totalPrice + deliveryFee;

  const handleWilayaChange = (wilaya: string) => {
    const noDesk = NO_DESK_WILAYAS.includes(wilaya) || (WILAYA_PRICING[wilaya]?.desk ?? 0) === 0;
    setForm({
      ...form,
      wilaya,
      desk: "",
      deliveryType: noDesk ? "home" : form.deliveryType,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.wilaya) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (effectiveDeliveryType === "home" && !form.address.trim()) {
      toast.error("Please enter your full address for home delivery.");
      return;
    }
    if (effectiveDeliveryType === "pickup" && desks && desks.length > 1 && !form.desk) {
      toast.error("Please select a pickup desk.");
      return;
    }
    setLoading(true);

    let deliveryInfo: string;
    if (effectiveDeliveryType === "home") {
      deliveryInfo = `home - ${form.address}`;
    } else {
      const deskName = form.desk || (desks ? desks[0] : `مكتب ${form.wilaya}`);
      deliveryInfo = `pickup - ${deskName}`;
    }

    const payload = {
      customer_name: form.name,
      phone: form.phone,
      wilaya: form.wilaya,
      delivery_type: deliveryInfo,
      delivery_mode: effectiveDeliveryType,
      customer_notes: form.notes.trim() || undefined,
      items: items.map((item) => ({
        book_id: item.book.id,
        quantity: item.quantity,
      })),
    };

    // Retry up to 3 times to survive cold-starts / transient network blips
    let lastError: any = null;
    let data: any = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      const res = await supabase.functions.invoke("create-order", { body: payload });
      if (!res.error && !(res.data as any)?.error) {
        data = res.data;
        lastError = null;
        break;
      }
      lastError = res.error || (res.data as any)?.error;
      console.error(`Order attempt ${attempt} failed:`, lastError);
      if (attempt < 3) {
        await new Promise((r) => setTimeout(r, 800 * attempt));
      }
    }

    setLoading(false);
    if (lastError) {
      const msg =
        typeof lastError === "string"
          ? lastError
          : lastError?.message || "Network error";
      toast.error(`Failed to place order: ${msg}. Your cart is saved — please try again.`);
      return;
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
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto max-w-md text-center p-8"
        >
          <CheckCircle className="mx-auto h-16 w-16 text-primary mb-4" />
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">
            Order Confirmed!
          </h1>
          <p className="text-muted-foreground mb-2">
            Your order has been placed. We'll deliver it to {form.wilaya} soon.
            Cash on delivery.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Estimated delivery: 7–14 days.
          </p>
          <Button variant="warm" onClick={() => navigate("/shop")}>
            Continue Shopping
          </Button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen parchment-bg">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-lg"
        >
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Checkout
          </h1>
          <p className="text-muted-foreground mb-2">
            Cash on delivery — no payment needed now.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Delivery typically takes 7–14 days.
          </p>

          <div className="rounded-lg border border-border bg-card p-4 mb-8">
            <h2 className="font-sans text-sm font-semibold text-foreground mb-3">
              Your Items
            </h2>
            {items.map((item) => (
              <div
                key={item.book.id}
                className="flex justify-between py-1.5 border-b border-border last:border-0"
              >
                <span className="font-sans text-sm text-foreground">
                  {item.book.title} × {item.quantity}
                </span>
                <span className="font-sans text-sm font-medium text-primary flex items-center gap-2">
                  {isOnPromotion(item.book) && (
                    <span className="text-[10px] text-muted-foreground line-through">
                      {(item.book.price * item.quantity).toLocaleString()}
                    </span>
                  )}
                  {(getEffectivePrice(item.book) * item.quantity).toLocaleString()} DZD
                </span>
              </div>
            ))}
            <div className="flex justify-between pt-3 mt-2 border-t border-border">
              <span className="font-sans text-sm text-muted-foreground">
                Subtotal
              </span>
              <span className="font-sans text-sm text-foreground">
                {totalPrice.toLocaleString()} DZD
              </span>
            </div>
            {form.wilaya && (
              <div className="flex justify-between pt-1">
                <span className="font-sans text-sm text-muted-foreground">
                  Delivery (
                  {effectiveDeliveryType === "home"
                    ? `Home — ${pricing?.home.toLocaleString()} DZD`
                    : `Desk Pickup — ${pricing?.desk.toLocaleString()} DZD`}
                  )
                </span>
                <span className="font-sans text-sm text-foreground">
                  {deliveryFee.toLocaleString()} DZD
                </span>
              </div>
            )}
            <div className="flex justify-between pt-3 mt-2 border-t border-border">
              <span className="font-sans text-sm font-semibold text-foreground">
                Total
              </span>
              <span className="font-display text-lg font-bold text-primary">
                {grandTotal.toLocaleString()} DZD
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block font-sans text-sm font-medium text-foreground">
                Full Name *
              </label>
              <input
                className={inputClass}
                placeholder="Your full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1.5 block font-sans text-sm font-medium text-foreground">
                Phone Number *
              </label>
              <input
                type="tel"
                className={inputClass}
                placeholder="0XXX XXX XXX"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1.5 block font-sans text-sm font-medium text-foreground">
                Wilaya *
              </label>
              <select
                className={inputClass}
                value={form.wilaya}
                onChange={(e) => handleWilayaChange(e.target.value)}
              >
                <option value="">Select your wilaya</option>
                {WILAYAS.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>

            {form.wilaya && (
              <div>
                <label className="mb-1.5 block font-sans text-sm font-medium text-foreground">
                  Delivery Type
                </label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 font-sans text-sm text-foreground cursor-pointer">
                    <input
                      type="radio"
                      name="delivery"
                      checked={effectiveDeliveryType === "home"}
                      onChange={() =>
                        setForm({ ...form, deliveryType: "home", desk: "" })
                      }
                      className="accent-primary"
                    />
                    Home Delivery ({pricing?.home.toLocaleString()} DZD)
                  </label>
                  {canPickup && (
                    <label className="flex items-center gap-2 font-sans text-sm text-foreground cursor-pointer">
                      <input
                        type="radio"
                        name="delivery"
                        checked={effectiveDeliveryType === "pickup"}
                        onChange={() =>
                          setForm({ ...form, deliveryType: "pickup" })
                        }
                        className="accent-primary"
                      />
                      Desk Pickup ({pricing?.desk.toLocaleString()} DZD)
                    </label>
                  )}
                </div>
                {!canPickup && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Desk pickup is not available for {form.wilaya}. Home delivery
                    only.
                  </p>
                )}
              </div>
            )}

            {effectiveDeliveryType === "pickup" && desks && desks.length > 1 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
              >
                <label className="mb-1.5 block font-sans text-sm font-medium text-foreground">
                  Select Pickup Desk *
                </label>
                <select
                  className={inputClass}
                  value={form.desk}
                  onChange={(e) => setForm({ ...form, desk: e.target.value })}
                >
                  <option value="">Choose a desk</option>
                  {desks.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </motion.div>
            )}

            {effectiveDeliveryType === "home" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="mb-1.5 block font-sans text-sm font-medium text-foreground">
                  Full Address *
                </label>
                <textarea
                  className={inputClass + " resize-none"}
                  rows={3}
                  placeholder="Street, building, apartment number, neighborhood..."
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
              </motion.div>
            )}

            <div>
              <label className="mb-1.5 block font-sans text-sm font-medium text-foreground">
                Order Notes (optional)
              </label>
              <textarea
                className={inputClass + " resize-none"}
                rows={3}
                placeholder="Anything we should know? Preferred delivery time, gift wrap, special instructions..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                maxLength={1000}
              />
            </div>

            <Button
              variant="warm"
              size="lg"
              type="submit"
              className="w-full"
              disabled={loading || !form.wilaya}
            >
              {loading
                ? "Placing Order..."
                : form.wilaya
                  ? `Place Order — ${grandTotal.toLocaleString()} DZD`
                  : "Select a wilaya to continue"}
            </Button>
          </form>
        </motion.div>
      </div>
    </main>
  );
};

export default Checkout;
