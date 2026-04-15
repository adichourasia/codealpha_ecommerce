import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <svg className="h-4 w-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-foreground">SnapCart</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your premium destination for quality products. Fast shipping, easy returns, and exceptional service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { to: "/" as const, label: "Home" },
                { to: "/shop" as const, label: "Shop" },
                { to: "/cart" as const, label: "Cart" },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>FAQ</li>
              <li>Shipping Policy</li>
              <li>Returns & Refunds</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Contact Us</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>hello@snapcart.com</li>
              <li>+1 (555) 123-4567</li>
              <li>123 Commerce St, NY 10001</li>
            </ul>
            <div className="flex gap-3 mt-4">
              {["Twitter", "Instagram", "Facebook"].map((s) => (
                <span key={s} className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer text-xs font-medium">
                  {s[0]}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          © 2026 SnapCart. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
