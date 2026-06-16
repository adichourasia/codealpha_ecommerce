import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MoonStar, SunMedium } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/context/ThemeContext";

export function Navbar() {
  const { totalItems, isAnimating } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);
  const location = useLocation();
  const isDark = theme === "dark";

  useEffect(() => {
    const syncUser = () => {
      const parsed = JSON.parse(localStorage.getItem("snapcart_currentUser") || "null") as
        | { name?: string; email?: string }
        | null;
      if (parsed?.name && parsed?.email) {
        setCurrentUser({ name: parsed.name, email: parsed.email });
      } else {
        setCurrentUser(null);
      }
    };

    syncUser();
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
    };
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("snapcart_currentUser");
    setCurrentUser(null);
    setMobileOpen(false);
  };

  const navLinks = [
    { to: "/" as const, label: "Home" },
    { to: "/shop" as const, label: "Shop" },
    { to: "/cart" as const, label: "Cart" },
  ];

  return (
    <header
      className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border"
      style={{ boxShadow: "var(--shadow-navbar)" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 py-3 md:h-16 md:flex-nowrap md:py-0">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20 shadow-md shadow-primary/5 transition-transform duration-300 group-hover:scale-105">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5.5 w-5.5">
                <defs>
                  <linearGradient id="logo-gradient-nav" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--primary)" />
                    <stop offset="100%" stopColor="var(--secondary)" />
                  </linearGradient>
                </defs>
                <path
                  d="M3 3H5L6.6 10.4C6.72 10.9 7.15 11.25 7.66 11.25H16.5C17.01 11.25 17.44 10.9 17.56 10.4L19.2 4H6.2"
                  stroke="url(#logo-gradient-nav)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="8.5" cy="18.5" r="1.8" fill="url(#logo-gradient-nav)" />
                <circle cx="15.5" cy="18.5" r="1.8" fill="url(#logo-gradient-nav)" />
                <path
                  d="M13 5L10.5 8.5H13.5L11 12"
                  stroke="url(#logo-gradient-nav)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">SnapCart</span>
          </Link>

          {/* Desktop nav */}
          <nav className="order-3 hidden md:flex items-center gap-1 md:order-none">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === link.to
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="order-2 flex items-center gap-2 sm:gap-3 md:order-none">
            {/* Cart icon */}
            <Link
              to="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span
                  className={`absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground ${
                    isAnimating ? "animate-cart-bounce" : ""
                  }`}
                >
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Dark/Light Mode Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
              suppressHydrationWarning
            >
              {isDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
              <span className="hidden sm:inline">{isDark ? "Light" : "Dark"}</span>
            </button>

            {/* Login */}
            {currentUser ? (
              <button
                onClick={handleLogout}
                className="hidden sm:inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                suppressHydrationWarning
              >
                Sign Out
              </button>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground btn-primary-hover"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
              suppressHydrationWarning
            >
              {mobileOpen ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden w-full pb-4 animate-fade-in-up">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === link.to
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {currentUser ? (
                <button
                  onClick={handleLogout}
                  className="mt-2 inline-flex items-center justify-center rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
                >
                  Sign In
                </Link>
              )}
              <button
                type="button"
                onClick={toggleTheme}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
                suppressHydrationWarning
              >
                {isDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
                {isDark ? "Light mode" : "Dark mode"}
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
