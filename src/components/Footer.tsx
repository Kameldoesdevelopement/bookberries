import { Link } from "react-router-dom";
import { Instagram, Mail } from "lucide-react";
import logo from "@/assets/bookberries-logo.png";

const Footer = () => (
  <footer className="border-t border-border bg-secondary/50">
    <div className="container mx-auto px-4 py-12">
      <div className="grid gap-8 md:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-3">
            <img src={logo} alt="Bookberries" className="h-8 w-auto" />
            <span className="font-display text-lg font-bold">Bookberries</span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Books choose their readers. Connecting readers across Algeria with the books they love.
          </p>
        </div>
        <div>
          <h4 className="font-sans text-sm font-semibold text-foreground mb-3">Quick Links</h4>
          <div className="flex flex-col gap-2">
            <Link to="/shop" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Shop</Link>
            <Link to="/request" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Request a Book</Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
            <Link to="/cart" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cart</Link>
          </div>
        </div>
        <div>
          <h4 className="font-sans text-sm font-semibold text-foreground mb-3">Delivery</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We deliver across all 58 wilayas of Algeria. Cash on delivery. Estimated delivery time: 7–14 days.
          </p>
        </div>
        <div>
          <h4 className="font-sans text-sm font-semibold text-foreground mb-3">Connect</h4>
          <div className="flex flex-col gap-2">
            <a href="https://instagram.com/bookberries.bookstore" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Instagram className="h-4 w-4" /> @bookberries.bookstore
            </a>
            <a href="mailto:hidayatdekhili5@gmail.com" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Mail className="h-4 w-4" /> hidayatdekhili5@gmail.com
            </a>
          </div>
        </div>
      </div>
      <div className="mt-8 border-t border-border pt-6 text-center">
        <p className="text-xs text-muted-foreground font-sans">
          © 2026 Bookberries. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
