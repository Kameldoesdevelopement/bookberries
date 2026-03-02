import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <main className="min-h-screen parchment-bg flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Browse our collection and find your next read.</p>
          <Button variant="warm" asChild>
            <Link to="/shop">Browse Shop</Link>
          </Button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen parchment-bg">
      <div className="container mx-auto px-4 py-12">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">Your Cart</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <motion.div
                key={item.book.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex gap-4 rounded-lg border border-border bg-card p-4"
              >
                <div className={`h-24 w-16 flex-shrink-0 rounded bg-gradient-to-b ${item.book.coverColor}`} />
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="font-display text-sm font-semibold text-foreground">{item.book.title}</h3>
                    <p className="font-sans text-xs text-muted-foreground">{item.book.author}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.book.id, item.quantity - 1)} className="h-7 w-7 rounded border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="font-sans text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.book.id, item.quantity + 1)} className="h-7 w-7 rounded border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-sans text-sm font-bold text-primary">
                        {(item.book.price * item.quantity).toLocaleString()} DZD
                      </span>
                      <button onClick={() => removeFromCart(item.book.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="rounded-lg border border-border bg-card p-6 h-fit">
            <h2 className="font-display text-lg font-semibold text-foreground mb-4">Order Summary</h2>
            <div className="flex justify-between border-b border-border pb-4 mb-4">
              <span className="font-sans text-sm text-muted-foreground">Total</span>
              <span className="font-display text-xl font-bold text-primary">{totalPrice.toLocaleString()} DZD</span>
            </div>
            <Button variant="warm" size="lg" className="w-full" asChild>
              <Link to="/checkout">Proceed to Checkout</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Cart;
