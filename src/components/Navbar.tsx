import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, Search } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBooks } from "@/hooks/useBooks";
import logo from "@/assets/bookberries-logo.png";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/request", label: "Request a Book" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { data: books = [] } = useBooks();
  const searchRef = useRef<HTMLDivElement>(null);

  const suggestions = mobileSearch.trim().length >= 2
    ? books.filter(b =>
        b.title.toLowerCase().includes(mobileSearch.toLowerCase()) ||
        b.author.toLowerCase().includes(mobileSearch.toLowerCase())
      ).slice(0, 5)
    : [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileSearch.trim()) {
      navigate(`/shop?q=${encodeURIComponent(mobileSearch.trim())}`);
      setMobileSearch("");
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (bookId: string) => {
    setMobileSearch("");
    setShowSuggestions(false);
    navigate(`/book/${bookId}`);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      {/* Desktop nav */}
      <div className="hidden md:flex container mx-auto h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Bookberries logo" className="h-10 w-auto" />
          <span className="font-display text-xl font-bold text-foreground">Bookberries</span>
        </Link>

        <div className="flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-sans text-sm font-medium transition-colors duration-200 ${
                location.pathname === link.to
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          to="/cart"
          className="relative flex items-center text-muted-foreground transition-colors hover:text-foreground"
        >
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-sans font-bold text-accent-foreground">
              {totalItems}
            </span>
          )}
        </Link>
      </div>

      {/* Mobile nav */}
      <div className="flex md:hidden items-center justify-between h-14 px-3 gap-2">
        <Link to="/" className="flex-shrink-0">
          <img src={logo} alt="Bookberries logo" className="h-8 w-auto" />
        </Link>

        <div ref={searchRef} className="flex-1 mx-2 relative">
          <form onSubmit={handleMobileSearch}>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Find the book you're looking for"
                value={mobileSearch}
                onChange={(e) => {
                  setMobileSearch(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full rounded-full border border-input bg-secondary/50 py-1.5 pl-8 pr-3 font-sans text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </form>
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute left-0 right-0 top-full mt-1 rounded-lg border border-border bg-card shadow-lg z-50 overflow-hidden"
              >
                {suggestions.map((book) => (
                  <button
                    key={book.id}
                    onClick={() => handleSuggestionClick(book.id)}
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-left hover:bg-secondary/60 transition-colors"
                  >
                    {book.image_url ? (
                      <img src={book.image_url} alt="" className="h-10 w-7 object-cover rounded-sm flex-shrink-0" />
                    ) : (
                      <div className="h-10 w-7 rounded-sm bg-muted flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="font-sans text-xs font-medium text-foreground truncate">{book.title}</p>
                      <p className="font-sans text-[10px] text-muted-foreground truncate">{book.author}</p>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            to="/cart"
            className="relative flex items-center text-muted-foreground transition-colors hover:text-foreground"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-sans font-bold text-accent-foreground">
                {totalItems}
              </span>
            )}
          </Link>
          <button
            className="text-muted-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border md:hidden"
          >
            <div className="container mx-auto flex flex-col gap-2 px-4 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-md px-3 py-2 font-sans text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? "bg-secondary text-primary"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
