"use client";

import { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

const toastListeners: Array<(msg: ToastMessage) => void> = [];

export function showToast(message: string, type: ToastType = "success") {
  const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  toastListeners.forEach((fn) => fn({ id, message, type }));
}

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const COLORS = {
  success: "border-green-500 bg-green-50 text-green-800",
  error: "border-red-500 bg-red-50 text-red-800",
  info: "border-blue-500 bg-blue-50 text-blue-800",
};

const ICON_COLORS = {
  success: "text-green-500",
  error: "text-red-500",
  info: "text-blue-500",
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handler = (msg: ToastMessage) => {
      setToasts((prev) => [...prev, msg]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== msg.id));
      }, 5000);
    };
    toastListeners.push(handler);
    return () => {
      const idx = toastListeners.indexOf(handler);
      if (idx !== -1) toastListeners.splice(idx, 1);
    };
  }, []);

  const remove = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type];
        return (
          <div
            key={toast.id}
            className={`animate-slide-up flex items-start gap-3 rounded-xl border-l-4 px-4 py-3 text-sm shadow-lg backdrop-blur-sm ${COLORS[toast.type]}`}
            style={{ minWidth: 280, maxWidth: 400 }}
          >
            <Icon size={18} className={`mt-0.5 shrink-0 ${ICON_COLORS[toast.type]}`} />
            <p className="flex-1 leading-snug">{toast.message}</p>
            <button
              onClick={() => remove(toast.id)}
              className="shrink-0 rounded-md p-0.5 opacity-40 transition-opacity hover:opacity-70"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
