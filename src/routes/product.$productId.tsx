import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { ProductCard } from "@/components/ProductCard";
import { fetchProductById, fetchProducts } from "@/lib/api";
import { formatPrice } from "@/lib/currency";

export const Route = createFileRoute("/product/$productId")({
  head: () => ({
    meta: [
      { title: "Product Details — SnapCart" },
      { name: "description", content: "View product details and related picks on SnapCart." },
      { property: "og:title", content: "Product Details — SnapCart" },
      { property: "og:description", content: "View product details and related picks on SnapCart." },
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
  const { productId } = Route.useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    const loadProduct = async () => {
      try {
        const [selectedProduct, allProducts] = await Promise.all([
          fetchProductById(productId),
          fetchProducts(),
        ]);

        if (!active) return;

        setProduct(selectedProduct);
        setRelated(
          allProducts
            .filter((item) => item.category === selectedProduct.category && item.id !== selectedProduct.id)
            .slice(0, 4)
        );
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Unable to load product");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProduct();

    return () => {
      active = false;
    };
  }, [productId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-muted-foreground">Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">📦</p>
          <h2 className="text-xl font-bold text-foreground">Product not found</h2>
          <p className="mt-2 text-sm text-muted-foreground">{error || "The requested product is unavailable."}</p>
          <Link to="/shop" className="mt-4 inline-block text-sm text-primary hover:underline">Back to shop</Link>
        </div>
      </div>
    );
  }

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
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
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
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight text-balance">{product.name}</h1>

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
            <span className="text-3xl font-bold text-foreground">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
                <span className="px-2 py-0.5 rounded-full bg-badge-sale/10 text-badge-sale text-xs font-semibold">
                  Save {formatPrice(product.originalPrice - product.price)}
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
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="flex items-center self-start border border-border rounded-xl overflow-hidden">
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
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground btn-primary-hover disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto sm:flex-none"
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
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {[
              { icon: "🚚", label: "Free Shipping" },
              { icon: "🔄", label: "Easy Returns" },
              { icon: "🛡️", label: "2yr Warranty" },
            ].map((f) => (
              <div key={f.label} className="flex flex-row items-center justify-center gap-2 rounded-xl bg-muted p-3 text-center sm:flex-col sm:gap-1.5">
                <span className="text-lg">{f.icon}</span>
                <span className="text-xs font-medium text-muted-foreground sm:text-[11px]">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-bold text-foreground mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p: Product) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
