import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/order-confirmation")({
  head: () => ({
    meta: [
      { title: "Order Confirmed — SnapCart" },
      { name: "description", content: "Your order has been placed successfully!" },
    ],
  }),
  component: OrderConfirmationPage,
});

function OrderConfirmationPage() {
  return (
    <div className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8 py-20 text-center animate-scale-in">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
        <svg className="h-10 w-10 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-foreground">Order Confirmed!</h1>
      <p className="mt-3 text-muted-foreground leading-relaxed">
        Thank you for your purchase! Your order has been placed successfully and will be shipped within 2–3 business days.
      </p>
      <p className="mt-4 text-sm text-muted-foreground">
        Order #SC-{Math.random().toString(36).substring(2, 8).toUpperCase()}
      </p>
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link to="/shop" className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground btn-primary-hover">
          Continue Shopping
        </Link>
        <Link to="/" className="inline-flex items-center justify-center rounded-xl border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors">
          Go Home
        </Link>
      </div>
    </div>
  );
}
