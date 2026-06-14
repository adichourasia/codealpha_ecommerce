import { useEffect, useMemo, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const DISMISS_UNTIL_KEY = "snapcart_install_prompt_dismissed_until";
const DISMISS_DAYS = 7;

function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  const narrowScreen = window.matchMedia("(max-width: 768px)").matches;
  const touchDevice = window.matchMedia("(pointer: coarse)").matches;
  return narrowScreen || touchDevice;
}

function isIosSafari(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const isIos = /iPhone|iPad|iPod/i.test(ua);
  const isWebKit = /WebKit/i.test(ua);
  const isNonSafariBrowser = /CriOS|FxiOS|EdgiOS|OPiOS|GSA/i.test(ua);
  return isIos && isWebKit && !isNonSafariBrowser;
}

function isStandaloneMode(): boolean {
  if (typeof window === "undefined") return false;
  const iosStandalone = "standalone" in window.navigator && (window.navigator as Navigator & { standalone?: boolean }).standalone;
  return Boolean(iosStandalone) || window.matchMedia("(display-mode: standalone)").matches;
}

function getDismissedUntil(): number {
  if (typeof window === "undefined") return 0;
  const value = window.localStorage.getItem(DISMISS_UNTIL_KEY);
  return value ? Number(value) : 0;
}

function dismissForAWeek() {
  if (typeof window === "undefined") return;
  const next = Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000;
  window.localStorage.setItem(DISMISS_UNTIL_KEY, String(next));
}

export function MobileInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [installed, setInstalled] = useState(false);

  const canShowIosHint = useMemo(() => isIosSafari() && !isStandaloneMode(), []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const dismissedUntil = getDismissedUntil();
    if (dismissedUntil > Date.now()) return;
    if (!isMobileDevice()) return;
    if (isStandaloneMode()) {
      setInstalled(true);
      return;
    }

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setVisible(true);
    };

    const onInstalled = () => {
      setInstalled(true);
      setVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);

    if (canShowIosHint) {
      setVisible(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, [canShowIosHint]);

  const handleDismiss = () => {
    dismissForAWeek();
    setVisible(false);
  };

  const handleInstall = async () => {
    if (!deferredPrompt) {
      handleDismiss();
      return;
    }

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setVisible(false);
    } else {
      handleDismiss();
    }
    setDeferredPrompt(null);
  };

  if (!visible || installed) return null;

  return (
    <div className="fixed inset-x-0 bottom-3 z-50 px-3 sm:px-4">
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-card/95 p-4 shadow-[var(--shadow-elevated)] backdrop-blur-md">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-foreground">Install SnapCart App</p>
            {deferredPrompt ? (
              <p className="mt-1 text-xs text-muted-foreground">
                Get a faster mobile experience with full-screen mode, better performance, and quick home screen access.
              </p>
            ) : (
              <p className="mt-1 text-xs text-muted-foreground">
                Open Safari menu, tap Share, then Add to Home Screen for the best mobile app experience.
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleDismiss}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close install prompt"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-3 flex items-center gap-2">
          {deferredPrompt && (
            <button
              type="button"
              onClick={handleInstall}
              className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground btn-primary-hover"
            >
              Install Now
            </button>
          )}
          <button
            type="button"
            onClick={handleDismiss}
            className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
