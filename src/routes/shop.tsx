import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/data/products";
import { fetchProducts } from "@/lib/api";

interface ShopSearch {
  category?: string;
  q?: string;
  sort?: string;
}

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => ({
    category: (search.category as string) || undefined,
    q: (search.q as string) || undefined,
    sort: (search.sort as string) || undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop — SnapCart" },
      { name: "description", content: "Browse all products at SnapCart. Filter by category, search, and sort." },
      { property: "og:title", content: "Shop — SnapCart" },
      { property: "og:description", content: "Browse all products at SnapCart." },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const { category, q, sort } = Route.useSearch();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState(q || "");
  const [selectedCategory, setSelectedCategory] = useState(category || "");
  const [selectedSort, setSelectedSort] = useState(sort || "");
  const navigate = Route.useNavigate();

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      try {
        const result = await fetchProducts();
        if (!active) return;
        setAllProducts(result);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Unable to load products");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProducts();
    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(() => {
    const categoryMeta = [
      { id: "electronics", name: "Electronics", icon: "💻" },
      { id: "fashion", name: "Fashion", icon: "👕" },
      { id: "accessories", name: "Accessories", icon: "⌚" },
      { id: "home", name: "Home & Living", icon: "🏠" },
    ];

    return categoryMeta
      .map((meta) => ({
        ...meta,
        count: allProducts.filter((product) => product.category === meta.id).length,
      }))
      .filter((categoryInfo) => categoryInfo.count > 0);
  }, [allProducts]);

  const filtered = useMemo(() => {
    let result = [...allProducts];
    if (selectedCategory) result = result.filter((p) => p.category === selectedCategory);
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(s) || p.shortDescription.toLowerCase().includes(s)
      );
    }
    if (selectedSort === "price-low") result.sort((a, b) => a.price - b.price);
    else if (selectedSort === "price-high") result.sort((a, b) => b.price - a.price);
    else if (selectedSort === "newest") result.sort((a, b) => (a.badge === "new" ? -1 : 1));
    else if (selectedSort === "rating") result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [allProducts, selectedCategory, search, selectedSort]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    navigate({ search: { category: cat || undefined, q: search || undefined, sort: selectedSort || undefined } });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <span className="text-foreground font-medium">Shop</span>
      </div>

      <h1 className="text-3xl font-bold text-foreground mb-8">All Products</h1>

      {/* Filters */}
      <div className="flex flex-col gap-4 mb-8 sm:flex-row">
        {/* Search */}
        <div className="relative w-full flex-1 min-w-0 max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            suppressHydrationWarning
          />
        </div>

        {/* Category */}
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 sm:w-auto"
          suppressHydrationWarning
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={selectedSort}
          onChange={(e) => setSelectedSort(e.target.value)}
          className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 sm:w-auto"
          suppressHydrationWarning
        >
          <option value="">Sort by</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="newest">Newest First</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => handleCategoryChange("")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !selectedCategory ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
          suppressHydrationWarning
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === cat.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
            suppressHydrationWarning
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {loading && (
        <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">Loading products...</div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">{error}</div>
      )}

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-6">{filtered.length} product{filtered.length !== 1 ? "s" : ""} found</p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🔍</p>
          <h3 className="text-lg font-semibold text-foreground">No products found</h3>
          <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or filters</p>
          <button
            onClick={() => { setSearch(""); handleCategoryChange(""); setSelectedSort(""); }}
            className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium btn-primary-hover"
            suppressHydrationWarning
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
