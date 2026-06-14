import { Outlet, Link, createRootRoute, HeadContent, Scripts, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import Lenis from "lenis";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MobileInstallPrompt } from "@/components/MobileInstallPrompt";

import appCss from "../styles.css?url";
import logoUrl from "../../logo.png";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground btn-primary-hover"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#d946ef" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "apple-mobile-web-app-title", content: "SnapCart" },
      { title: "SnapCart — Premium Online Store" },
      { name: "description", content: "Discover premium products at SnapCart. Shop electronics, fashion, accessories & more with fast shipping and easy returns." },
      { property: "og:title", content: "SnapCart — Premium Online Store" },
      { property: "og:description", content: "Discover premium products at SnapCart. Shop electronics, fashion, accessories & more." },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: logoUrl, type: "image/png" },
      { rel: "shortcut icon", href: logoUrl, type: "image/png" },
      { rel: "apple-touch-icon", href: logoUrl },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800;900&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const location = useLocation();
  const isLoginOrRegister = location.pathname === "/login" || location.pathname === "/register";

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      autoRaf: false,
      smoothWheel: true,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    const handleServiceWorker = async () => {
      try {
        if (import.meta.env.DEV) {
          // Unregister any active service worker during development to avoid stale caching
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (const registration of registrations) {
            await registration.unregister();
          }
          // Clear any stored Cache Storage
          const cacheKeys = await window.caches.keys();
          for (const key of cacheKeys) {
            await window.caches.delete(key);
          }
        } else {
          await navigator.serviceWorker.register("/sw.js");
        }
      } catch {
        // Service worker failures should not break page rendering.
      }
    };

    void handleServiceWorker();
  }, []);

  return (
    <ThemeProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col">
          {!isLoginOrRegister && <Navbar />}
          <main className="flex-1">
            <Outlet />
          </main>
          {!isLoginOrRegister && <Footer />}
          {!isLoginOrRegister && <MobileInstallPrompt />}
        </div>
      </CartProvider>
    </ThemeProvider>
  );
}
