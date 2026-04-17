import { createFileRoute, Link } from "@tanstack/react-router";

interface OrderConfirmationSearch {
  orderNo?: string;
}

export const Route = createFileRoute("/order-confirmation")({
  validateSearch: (search: Record<string, unknown>): OrderConfirmationSearch => ({
    orderNo: (search.orderNo as string) || undefined,
  }),
  head: () => ({
    meta: [
      { title: "Order Confirmed — SnapCart" },
      { name: "description", content: "Your order has been placed successfully!" },
    ],
  }),
  component: OrderConfirmationPage,
});

function OrderConfirmationPage() {
  const { orderNo } = Route.useSearch();

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
        {orderNo ? `Order #${orderNo}` : "Your order details are in your confirmation email."}
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
