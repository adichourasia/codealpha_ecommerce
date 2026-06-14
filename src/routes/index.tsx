import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useTheme } from "@/context/ThemeContext";

const heroBanner =
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=2200&q=80";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (typeof window === "undefined") {
      return;
    }

    const currentUser = localStorage.getItem("snapcart_currentUser");
    if (!currentUser) {
      throw redirect({ to: "/login" });
    }
  },
  head: () => ({
    meta: [
      { title: "SnapCart — Home" },
      { name: "description", content: "SnapCart home. Shop smarter with premium picks and fast delivery." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className="relative isolate min-h-[78vh] overflow-hidden bg-background text-foreground transition-colors duration-300">
      <img
        src={heroBanner}
        alt="SnapCart hero"
        className="absolute inset-0 h-full w-full object-cover"
        width={2200}
        height={1300}
      />
      <div className={`absolute inset-0 transition-colors duration-300 ${isDark ? "bg-gradient-to-r from-black/85 via-black/60 to-black/20" : "bg-gradient-to-r from-white/92 via-white/72 to-white/40"}`} />
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: "radial-gradient(circle at 20% 20%, var(--glow-left), transparent 30%), radial-gradient(circle at 80% 30%, var(--glow-right), transparent 28%)"
        }}
      />

      <div className="relative mx-auto flex min-h-[78vh] max-w-7xl items-center px-4 py-14 sm:px-6 lg:px-8 sm:py-20">
        <div className="max-w-2xl animate-fade-in-up">
          <span className={`inline-flex rounded-full border px-4 py-1.5 text-xs font-semibold tracking-[0.14em] uppercase transition-colors duration-300 ${isDark ? "border-primary/40 bg-primary/20" : "border-primary/20 bg-primary/10"} text-primary`}>
            SnapCart Signature Collection
          </span>

          <h1 className="mt-5 max-w-xl text-balance text-4xl font-semibold leading-tight transition-colors duration-300 sm:text-6xl lg:text-7xl text-foreground">
            Shop Bold.
            {" "}
            <span
              className="inline-block"
              style={{
                background: "linear-gradient(90deg, var(--primary), var(--primary), var(--secondary), var(--primary))",
                backgroundSize: "220% 220%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "gradientFlow 4s ease infinite",
              }}
            >
              Live Better.
            </span>
          </h1>

          <p className={`mt-5 max-w-xl text-base leading-relaxed transition-colors duration-300 sm:text-lg ${isDark ? "text-foreground/85" : "text-foreground/75"}`}>
            Big deals, premium quality, and fast delivery. Discover handpicked products designed for your everyday lifestyle.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground btn-primary-hover"
            >
              Start Shopping
            </Link>
            <Link
              to="/shop"
              search={{ sort: "newest" }}
              className="inline-flex items-center justify-center rounded-xl border border-foreground/30 bg-foreground/5 px-7 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/15"
            >
              Explore New Arrivals
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </section>
  );
}
