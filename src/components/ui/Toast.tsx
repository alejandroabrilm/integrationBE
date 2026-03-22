"use client";

import { useEffect } from "react";

type ToastType = "success" | "error";

interface ToastProps {
  open: boolean;
  title?: string;
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  open,
  title,
  message,
  type = "success",
  onClose,
  duration = 2200,
}: ToastProps) {
  useEffect(() => {
    if (!open) return;

    const timeout = window.setTimeout(onClose, duration);
    return () => window.clearTimeout(timeout);
  }, [duration, onClose, open]);

  if (!open) return null;

  const styles =
    type === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-950"
      : "border-red-200 bg-red-50 text-red-950";

  const defaultTitle = type === "success" ? "Operacion completada" : "Operacion fallida";

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50">
      <div
        className={`pointer-events-auto min-w-72 max-w-sm rounded-2xl border px-4 py-3 shadow-lg ${styles}`}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{title ?? defaultTitle}</p>
            <p className="mt-1 text-sm opacity-80">{message}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-sm opacity-60 transition-opacity hover:opacity-100"
            aria-label="Cerrar"
          >
            x
          </button>
        </div>
      </div>
    </div>
  );
}
