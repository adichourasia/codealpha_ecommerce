import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/lib/api";
import { formatPrice } from "@/lib/currency";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — SnapCart" },
      { name: "description", content: "Complete your order at SnapCart." },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", pincode: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-5xl mb-4">📦</p>
        <h1 className="text-2xl font-bold text-foreground">Nothing to checkout</h1>
        <p className="mt-2 text-muted-foreground">Your cart is empty.</p>
        <Link to="/shop" className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground btn-primary-hover">
          Browse Products
        </Link>
      </div>
    );
  }

  const shipping = totalPrice >= 4000 ? 0 : 499;
  const total = totalPrice + shipping;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.pincode.trim()) e.pincode = "Pincode is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setSubmitError("");
    if (!validate()) return;
    setSubmitting(true);

    const currentUser = JSON.parse(localStorage.getItem("snapcart_currentUser") || "null") as
      | { name?: string; email?: string }
      | null;

    if (!currentUser?.name || !currentUser?.email) {
      setSubmitting(false);
      navigate({ to: "/login" });
      return;
    }

    try {
      const order = await createOrder({
        user: {
          name: currentUser.name,
          email: currentUser.email,
        },
        items: items.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image,
        })),
        shippingAddress: form,
        shipping,
        subtotal: totalPrice,
        total,
      });

      clearCart();
      navigate({ to: "/order-confirmation", search: { orderNo: order.orderNumber } });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Unable to place order");
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link to="/cart" className="hover:text-primary transition-colors">Cart</Link>
        <span>/</span>
        <span className="text-foreground font-medium">Checkout</span>
      </div>

      <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping form */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-card border border-border p-6" style={{ boxShadow: "var(--shadow-card)" }}>
              <h2 className="text-lg font-semibold text-foreground mb-5">Shipping Information</h2>
              {submitError && (
                <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  {submitError}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: "name", label: "Full Name", placeholder: "John Doe", span: true },
                  { name: "phone", label: "Phone Number", placeholder: "+1 (555) 123-4567" },
                  { name: "city", label: "City", placeholder: "New York" },
                  { name: "address", label: "Street Address", placeholder: "123 Commerce St", span: true },
                  { name: "pincode", label: "ZIP / Postal Code", placeholder: "10001" },
                ].map((field) => (
                  <div key={field.name} className={field.span ? "sm:col-span-2" : ""}>
                    <label className="block text-sm font-medium text-foreground mb-1.5">{field.label}</label>
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      value={form[field.name as keyof typeof form]}
                      onChange={(e) => updateField(field.name, e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors ${
                        errors[field.name] ? "border-destructive" : "border-border bg-card"
                      }`}
                    />
                    {errors[field.name] && (
                      <p className="mt-1 text-xs text-destructive">{errors[field.name]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl bg-card border border-border p-6" style={{ boxShadow: "var(--shadow-card)" }}>
              <h2 className="text-lg font-semibold text-foreground mb-5">Order Summary</h2>
              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <img src={item.product.image} alt={item.product.name} loading="lazy" width={48} height={48} className="h-12 w-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-xs font-semibold text-foreground">{formatPrice(item.product.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between font-semibold text-foreground text-base">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="mt-6 w-full inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground btn-primary-hover disabled:opacity-50"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  `Place Order — ${formatPrice(total)}`
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
