import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { getProductById, getProductsByCategory, type Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/product/$productId")({
  loader: ({ params }) => {
    const product = getProductById(params.productId);
    if (!product) throw notFound();
    const related = getProductsByCategory(product.category).filter((p) => p.id !== product.id).slice(0, 4);
    return { product, related };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.product.name} — SnapCart` },
      { name: "description", content: loaderData?.product.description || "" },
      { property: "og:title", content: `${loaderData?.product.name} — SnapCart` },
      { property: "og:description", content: loaderData?.product.shortDescription || "" },
    ],
  }),
  component: ProductDetailPage,
  notFoundComponent: () => (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <p className="text-5xl mb-4">📦</p>
        <h2 className="text-xl font-bold text-foreground">Product not found</h2>
        <Link to="/shop" className="mt-4 inline-block text-sm text-primary hover:underline">Back to shop</Link>
      </div>
    </div>
  ),
});

function ProductDetailPage() {
  const { product, related } = Route.useLoaderData();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
        <span>/</span>
        <span className="text-foreground font-medium line-clamp-1">{product.name}</span>
      </div>

      {/* Product detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Image */}
        <div className="relative rounded-2xl overflow-hidden bg-muted aspect-square" style={{ boxShadow: "var(--shadow-elevated)" }}>
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" width={800} height={800} />
          {product.badge && (
            <span className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
              product.badge === "new" ? "bg-badge-new text-primary-foreground" : "bg-badge-sale text-primary-foreground"
            }`}>
              {product.badge}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center animate-slide-in-right">
          <p className="text-sm text-primary font-medium capitalize mb-2">{product.category}</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className={`h-5 w-5 ${star <= Math.round(product.rating) ? "text-amber-400" : "text-border"}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-muted-foreground">{product.rating} ({product.reviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mt-5">
            <span className="text-3xl font-bold text-foreground">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
                <span className="px-2 py-0.5 rounded-full bg-badge-sale/10 text-badge-sale text-xs font-semibold">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="mt-6 text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Stock */}
          <div className="mt-5 flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${product.stock > 10 ? "bg-success" : product.stock > 0 ? "bg-amber-400" : "bg-destructive"}`} />
            <span className="text-sm text-muted-foreground">
              {product.stock > 10 ? "In Stock" : product.stock > 0 ? `Only ${product.stock} left` : "Out of Stock"}
            </span>
          </div>

          {/* Quantity + Add to cart */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-4 py-3 text-muted-foreground hover:bg-muted transition-colors"
              >
                −
              </button>
              <span className="px-5 py-3 text-sm font-semibold text-foreground min-w-[3rem] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="px-4 py-3 text-muted-foreground hover:bg-muted transition-colors"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground btn-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {added ? (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Added!
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Add to Cart
                </>
              )}
            </button>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { icon: "🚚", label: "Free Shipping" },
              { icon: "🔄", label: "Easy Returns" },
              { icon: "🛡️", label: "2yr Warranty" },
            ].map((f) => (
              <div key={f.label} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted text-center">
                <span className="text-lg">{f.icon}</span>
                <span className="text-[11px] font-medium text-muted-foreground">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-bold text-foreground mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
