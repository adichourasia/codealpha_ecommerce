import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { loginUser } from "@/lib/api";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — SnapCart" },
      { name: "description", content: "Sign in to your SnapCart account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = Route.useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const user = await loginUser({ email, password });
      localStorage.setItem("snapcart_currentUser", JSON.stringify({ email: user.email, name: user.name }));
      navigate({ to: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError("");
    setIsLoading(true);
    try {
      const demoEmail = "alex123@gmail.com";
      const demoPassword = "12345678";
      setEmail(demoEmail);
      setPassword(demoPassword);
      const user = await loginUser({ email: demoEmail, password: demoPassword });
      localStorage.setItem("snapcart_currentUser", JSON.stringify({ email: user.email, name: user.name }));
      navigate({ to: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to connect to demo account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-start justify-center px-4 py-8 sm:items-center sm:py-12">
      <div className="w-full max-w-sm animate-scale-in">
        <div className="rounded-2xl bg-card border border-border p-6 sm:p-8" style={{ boxShadow: "var(--shadow-elevated)" }}>
          <div className="text-center mb-8">
            <h2 className="mb-4 text-3xl font-black sm:text-4xl" style={{
              background: "linear-gradient(90deg, var(--primary), var(--primary), var(--secondary), var(--primary), var(--primary))",
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "gradientFlow 4s ease infinite"
            }}>SnapCart</h2>
            <style>{`
              @keyframes gradientFlow {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
            `}</style>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/25 shadow-lg shadow-primary/10 transition-transform duration-500 hover:scale-105">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10">
                <defs>
                  <linearGradient id="logo-gradient-login" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--primary)" />
                    <stop offset="100%" stopColor="var(--secondary)" />
                  </linearGradient>
                </defs>
                <path
                  d="M3 3H5L6.6 10.4C6.72 10.9 7.15 11.25 7.66 11.25H16.5C17.01 11.25 17.44 10.9 17.56 10.4L19.2 4H6.2"
                  stroke="url(#logo-gradient-login)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="8.5" cy="18.5" r="1.8" fill="url(#logo-gradient-login)" />
                <circle cx="15.5" cy="18.5" r="1.8" fill="url(#logo-gradient-login)" />
                <path
                  d="M13 5L10.5 8.5H13.5L11 12"
                  stroke="url(#logo-gradient-login)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
            <p className="mt-1 text-sm text-muted-foreground">Sign in to your SnapCart account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" suppressHydrationWarning>
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
                suppressHydrationWarning
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
                suppressHydrationWarning
              />
            </div>
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground btn-primary-hover disabled:opacity-50 disabled:cursor-not-allowed" 
              suppressHydrationWarning
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 border-t border-border pt-5">
            <div className="rounded-2xl bg-muted/40 p-4 border border-border/50">
              <p className="text-xs font-bold text-foreground mb-1 flex items-center gap-1.5 font-heading">
                <span className="inline-block h-2 w-2 rounded-full bg-primary animate-pulse" />
                Quick Sandbox Demo Access
              </p>
              <p className="text-[11px] text-muted-foreground mb-3 leading-normal">
                Click below to instantly log in using our pre-seeded developer test credentials.
              </p>
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="w-full rounded-xl border border-primary/20 bg-primary/5 py-2 text-xs font-semibold text-primary hover:bg-primary/10 transition-all active:scale-[0.98] disabled:opacity-50"
                suppressHydrationWarning
              >
                One-Click Demo Login
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
