import { Link } from "@tanstack/react-router";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/data/products";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <div className="group bg-card rounded-2xl overflow-hidden border border-border card-hover" style={{ boxShadow: "var(--shadow-card)" }}>
      {/* Image */}
      <Link to="/product/$productId" params={{ productId: product.id }} className="block relative overflow-hidden aspect-square">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={600}
          height={600}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <span
            className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
              product.badge === "new"
                ? "bg-badge-new text-primary-foreground"
                : "bg-badge-sale text-primary-foreground"
            }`}
          >
            {product.badge}
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link to="/product/$productId" params={{ productId: product.id }}>
          <p className="text-xs text-muted-foreground capitalize mb-1">{product.category}</p>
          <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{product.shortDescription}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`h-3.5 w-3.5 ${star <= Math.round(product.rating) ? "text-amber-400" : "text-border"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-[11px] text-muted-foreground">({product.reviews})</span>
        </div>

        {/* Price + Add to cart */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-foreground">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <button
            onClick={() => addToCart(product)}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground btn-primary-hover"
            aria-label={`Add ${product.name} to cart`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
