import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { registerUser } from "@/lib/api";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create Account — SnapCart" },
      { name: "description", content: "Create your SnapCart account to start shopping." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = Route.useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!name || !email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      const user = await registerUser({ name, email, password });
      localStorage.setItem("snapcart_currentUser", JSON.stringify({ email: user.email, name: user.name }));
      navigate({ to: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-start justify-center px-4 py-8 sm:items-center sm:py-12">
      <div className="w-full max-w-sm animate-scale-in">
        <div className="rounded-2xl bg-card border border-border p-6 sm:p-8" style={{ boxShadow: "var(--shadow-elevated)" }}>
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <svg className="h-6 w-6 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Create account</h1>
            <p className="mt-1 text-sm text-muted-foreground">Join SnapCart and start shopping</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" suppressHydrationWarning>
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
                suppressHydrationWarning
              />
            </div>
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
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
