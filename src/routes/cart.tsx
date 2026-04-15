import { createFileRoute, Link } from "@tanstack/react-router";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/currency";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — SnapCart" },
      { name: "description", content: "Review your shopping cart and proceed to checkout." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-6xl mb-6">🛒</p>
        <h1 className="text-2xl font-bold text-foreground">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground btn-primary-hover">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <span className="text-foreground font-medium">Cart</span>
      </div>

      <h1 className="text-3xl font-bold text-foreground mb-8">Shopping Cart ({totalItems} item{totalItems !== 1 ? "s" : ""})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="flex gap-4 p-4 rounded-2xl bg-card border border-border"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <Link to="/product/$productId" params={{ productId: item.product.id }} className="flex-shrink-0">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  loading="lazy"
                  width={100}
                  height={100}
                  className="h-24 w-24 rounded-xl object-cover"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to="/product/$productId" params={{ productId: item.product.id }}>
                  <h3 className="text-sm font-semibold text-foreground line-clamp-1 hover:text-primary transition-colors">
                    {item.product.name}
                  </h3>
                </Link>
                <p className="text-xs text-muted-foreground capitalize mt-0.5">{item.product.category}</p>
                <p className="text-sm font-bold text-foreground mt-2">{formatPrice(item.product.price)}</p>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-border rounded-lg overflow-hidden">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted transition-colors">−</button>
                    <span className="px-3 py-1.5 text-sm font-medium text-foreground">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted transition-colors">+</button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-foreground">{formatPrice(item.product.price * item.quantity)}</span>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Remove item"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl bg-card border border-border p-6" style={{ boxShadow: "var(--shadow-card)" }}>
            <h2 className="text-lg font-semibold text-foreground mb-5">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className={totalPrice >= 4000 ? "text-success font-medium" : ""}>
                  {totalPrice >= 4000 ? "Free" : "₹499"}
                </span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-semibold text-foreground text-base">
                <span>Total</span>
                <span>{formatPrice(totalPrice + (totalPrice >= 4000 ? 0 : 499))}</span>
              </div>
            </div>
            {totalPrice < 4000 && (
              <p className="mt-3 text-xs text-muted-foreground">Add {formatPrice(4000 - totalPrice)} more for free shipping!</p>
            )}
            <Link
              to="/checkout"
              className="mt-6 w-full inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground btn-primary-hover"
            >
              Proceed to Checkout
            </Link>
            <Link to="/shop" className="mt-3 w-full inline-flex items-center justify-center text-sm text-primary hover:underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
