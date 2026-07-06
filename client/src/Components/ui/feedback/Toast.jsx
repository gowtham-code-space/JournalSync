import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Flame,
  X,
} from "lucide-react";
import { useThemeStore } from "@/hooks/useThemeStore";
import { getUiTokens } from "@/components/ui/uiTokens";
import { Button, IconButton } from "@/components/primitives";

/* -------------------------------------------------------------------------
 * USAGE
 * -----------------------------------------------------------------------
 * 1. Wrap your app once:
 *      <ToastProvider position="top-right">
 *        <App />
 *      </ToastProvider>
 *
 * 2. Fire toasts from anywhere below it:
 *      const toast = useToast();
 *
 *      toast.success("Template applied", { description: "Core Tech Tracker · This month" });
 *      toast.error("Couldn't save changes");
 *      toast.warning("You're about to overwrite existing data");
 *      toast.info("Streak resets at midnight");
 *      toast.brand("Milestone unlocked 🔥");
 *
 *      // one-off override of duration / position:
 *      toast.success("Saved", { position: "bottom-left", duration: 2000 });
 *
 *      // manual control:
 *      const id = toast.info("Uploading...", { duration: Infinity });
 *      toast.dismiss(id);
 *      toast.dismissAll();
 * ---------------------------------------------------------------------- */

const ToastContext = createContext(null);

const POSITIONS = [
  "top-right",
  "top-left",
  "top-center",
  "bottom-right",
  "bottom-left",
  "bottom-center",
];

const DEFAULT_DURATION = 4000;

const TYPE_CONFIG = {
  success: { icon: CheckCircle2, colorKey: "status.success" },
  error: { icon: XCircle, colorKey: "status.error" },
  warning: { icon: AlertTriangle, colorKey: "status.warning" },
  info: { icon: Info, colorKey: "brand.teal" },
  brand: { icon: Flame, colorKey: "brand.orange", colorKeyEnd: "brand.pink" },
};

let idCounter = 0;
const nextId = () => `toast-${Date.now()}-${idCounter++}`;

/* -------------------------------------------------------------------------
 * PROVIDER
 * -----------------------------------------------------------------------*/

export function ToastProvider({ children, position: defaultPosition = "top-right" }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => setToasts([]), []);

  const push = useCallback(
    (message, { type = "brand", description, duration = DEFAULT_DURATION, position, action } = {}) => {
      const id = nextId();
      const resolvedPosition = POSITIONS.includes(position) ? position : defaultPosition;
      // Newest toast is prepended; container ordering (flex-col vs flex-col-reverse)
      // is what decides whether that reads as "top" or "bottom" of the stack.
      setToasts((prev) => [
        { id, message, description, type, duration, position: resolvedPosition, action },
        ...prev,
      ]);
      return id;
    },
    [defaultPosition]
  );

  const api = useMemo(() => {
    const fn = (message, opts) => push(message, opts);
    fn.success = (message, opts) => push(message, { ...opts, type: "success" });
    fn.error = (message, opts) => push(message, { ...opts, type: "error" });
    fn.warning = (message, opts) => push(message, { ...opts, type: "warning" });
    fn.info = (message, opts) => push(message, { ...opts, type: "info" });
    fn.brand = (message, opts) => push(message, { ...opts, type: "brand" });
    fn.dismiss = dismiss;
    fn.dismissAll = dismissAll;
    return fn;
  }, [push, dismiss, dismissAll]);

  const toastsByPosition = useMemo(() => {
    const grouped = Object.fromEntries(POSITIONS.map((p) => [p, []]));
    toasts.forEach((t) => grouped[t.position].push(t));
    return grouped;
  }, [toasts]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      {typeof document !== "undefined" &&
        createPortal(
          <>
            {POSITIONS.map((position) => (
              <ToastViewport
                key={position}
                position={position}
                toasts={toastsByPosition[position]}
                onDismiss={dismiss}
              />
            ))}
          </>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a <ToastProvider>");
  }
  return ctx;
}

/* -------------------------------------------------------------------------
 * VIEWPORT — one fixed stack per screen corner
 * -----------------------------------------------------------------------*/

const VIEWPORT_CLASSES = {
  "top-right": "top-4 right-4 items-end",
  "top-left": "top-4 left-4 items-start",
  "top-center": "top-4 left-1/2 -translate-x-1/2 items-center",
  "bottom-right": "bottom-4 right-4 items-end",
  "bottom-left": "bottom-4 left-4 items-start",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center",
};

function ToastViewport({ position, toasts, onDismiss }) {
  if (toasts.length === 0) return null;
  const isTop = position.startsWith("top");

  return (
    <div
      className={`fixed z-[100] flex w-full max-w-[380px] flex-col gap-2 px-4 sm:px-0 pointer-events-none ${
        isTop ? "flex-col" : "flex-col-reverse"
      } ${VIEWPORT_CLASSES[position]}`}
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} isTop={isTop} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------
 * TOAST ITEM
 * -----------------------------------------------------------------------*/

function ToastItem({ toast, isTop, onDismiss }) {
  const { id, message, description, type, duration, action } = toast;
  const config = TYPE_CONFIG[type] ?? TYPE_CONFIG.brand;
  const Icon = config.icon;

  const theme = useThemeStore((s) => s.theme);
  const tokens = getUiTokens(theme);

  const [mounted, setMounted] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [paused, setPaused] = useState(false);

  const timerRef = useRef(null);
  const remainingRef = useRef(duration);
  const startedAtRef = useRef(null);

  const close = useCallback(() => {
    setLeaving(true);
    window.setTimeout(() => onDismiss(id), 180); // matches exit transition
  }, [id, onDismiss]);

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimer = useCallback(
    (ms) => {
      if (!Number.isFinite(ms)) return; // duration: Infinity => persistent toast
      startedAtRef.current = Date.now();
      timerRef.current = window.setTimeout(close, ms);
    },
    [close]
  );

  // Mount animation
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Auto-dismiss lifecycle
  useEffect(() => {
    startTimer(remainingRef.current);
    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseEnter = () => {
    if (!Number.isFinite(duration)) return;
    setPaused(true);
    clearTimer();
    const elapsed = Date.now() - startedAtRef.current;
    remainingRef.current = Math.max(remainingRef.current - elapsed, 0);
  };

  const handleMouseLeave = () => {
    if (!Number.isFinite(duration)) return;
    setPaused(false);
    startTimer(remainingRef.current);
  };

  const enterTranslate = isTop ? "-translate-y-2" : "translate-y-2";

  return (
    <div
      role="status"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`pointer-events-auto w-full overflow-hidden rounded-xl transition-all duration-200 ease-out ${
        mounted && !leaving ? "opacity-100 translate-y-0 scale-100" : `opacity-0 scale-95 ${enterTranslate}`
      }`}
      style={{
        backgroundColor: tokens.colors.surface,
        border: `1px solid ${tokens.colors.border}`,
        boxShadow: tokens.shadows.xxl,
      }}
    >
      <div className="flex items-start gap-3 p-3.5">
        <div className="shrink-0 mt-0.5">
          <Icon size={18} strokeWidth={2.25} style={{ color: config.colorKey ? (config.colorKeyEnd ? undefined : getColor(tokens, config.colorKey)) : undefined }} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-zinc-100 leading-snug">{message}</p>
          {description && (
            <p className="text-[12px] text-zinc-500 leading-snug mt-0.5">{description}</p>
          )}
          {action && (
            <div className="mt-2">
              <Button
                variant="link"
                size="sm"
                onClick={() => {
                  action.onClick?.();
                  close();
                }}
                style={{ color: getColor(tokens, config.colorKey) }}
              >
                {action.label}
              </Button>
            </div>
          )}
        </div>

        <IconButton
          variant="ghost"
          size="sm"
          onClick={close}
          aria-label="Dismiss notification"
          className="shrink-0 -mt-0.5 -mr-0.5"
        >
          <X size={15} />
        </IconButton>
      </div>

      {Number.isFinite(duration) && (
        <div className="h-[3px] w-full" style={{ backgroundColor: tokens.colors.surfaceSubtle }}>
          <div
            className="h-full"
            style={{
              background: config.colorKeyEnd
                ? `linear-gradient(90deg, ${getColor(tokens, config.colorKey)} 0%, ${getColor(tokens, config.colorKeyEnd)} 100%)`
                : getColor(tokens, config.colorKey),
              animation: `toast-progress ${duration}ms linear forwards`,
              animationPlayState: paused ? "paused" : "running",
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes toast-progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}

// Helper: resolve token path like "status.success" or "brand.orange"
function getColor(tokens, key) {
  if (!key || !tokens) return undefined;
  const parts = key.split(".");
  let cur = tokens.colors;
  for (const p of parts) {
    if (!cur) return undefined;
    cur = cur[p];
  }
  return cur;
}