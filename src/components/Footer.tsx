import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-secondary/50">
    <div className="container mx-auto px-4 py-12">
      <div className="grid gap-8 md:grid-cols-3">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-3">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="font-display text-lg font-bold">Kutub</span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Algeria's curated online bookstore. Discover stories that move you.
          </p>
        </div>
        <div>
          <h4 className="font-sans text-sm font-semibold text-foreground mb-3">Quick Links</h4>
          <div className="flex flex-col gap-2">
            <Link to="/shop" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Shop</Link>
            <Link to="/request" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Request a Book</Link>
            <Link to="/cart" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cart</Link>
          </div>
        </div>
        <div>
          <h4 className="font-sans text-sm font-semibold text-foreground mb-3">Delivery</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We deliver across all 48 wilayas of Algeria. Cash on delivery available.
          </p>
        </div>
      </div>
      <div className="mt-8 border-t border-border pt-6 text-center">
        <p className="text-xs text-muted-foreground font-sans">
          © 2026 Kutub. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
