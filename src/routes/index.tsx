import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/ProductCard";
import { products, categories } from "@/data/products";
import heroBanner from "@/assets/hero-banner.jpg";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const featured = products.slice(0, 4);
  const newArrivals = products.filter((p) => p.badge === "new").slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBanner} alt="SnapCart hero" className="w-full h-full object-cover" width={1920} height={800} />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="max-w-xl animate-fade-in-up">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary-foreground text-xs font-semibold tracking-wider uppercase mb-4">
              New Collection 2026
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight">
              Shop Smarter,{" "}
              <span className="text-primary">Live Better</span>
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/80 leading-relaxed">
              Discover curated products that blend quality, style, and value. Free shipping on orders over ₹4,000.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground btn-primary-hover"
              >
                Shop Now
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center justify-center rounded-xl border border-primary-foreground/30 px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
              >
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Shop by Category</h2>
          <p className="mt-2 text-muted-foreground">Find exactly what you're looking for</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              to="/shop"
              search={{ category: cat.id }}
              className={`flex flex-col items-center gap-3 p-6 rounded-2xl bg-card border border-border card-hover opacity-0 animate-fade-in-up stagger-${i + 1}`}
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <span className="text-4xl">{cat.icon}</span>
              <span className="text-sm font-semibold text-foreground">{cat.name}</span>
              <span className="text-xs text-muted-foreground">{cat.count} products</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Featured Products</h2>
            <p className="mt-1 text-muted-foreground">Handpicked just for you</p>
          </div>
          <Link to="/shop" className="text-sm font-medium text-primary hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">New Arrivals</h2>
              <p className="mt-1 text-muted-foreground">Fresh drops you'll love</p>
            </div>
            <Link to="/shop" className="text-sm font-medium text-primary hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-3xl bg-primary p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary-foreground">
            Get 20% Off Your First Order
          </h2>
          <p className="mt-3 text-primary-foreground/80 max-w-md mx-auto">
            Join our newsletter and get an exclusive discount on your first purchase. No spam, ever.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full sm:flex-1 px-4 py-3 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-foreground/30"
            />
            <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-card text-foreground text-sm font-semibold hover:bg-card/90 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
