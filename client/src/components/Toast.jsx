"use client";

import React from "react";
import { CheckCircle2, AlertCircle, Clock, Zap, X } from "lucide-react";

export default function Toast({ toast, onDismiss }) {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    collision: <Zap className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" />,
    warning: <Clock className="w-5 h-5 text-amber-400 shrink-0" />,
  };

  const borders = {
    success: "border-emerald-500/50 bg-slate-900/95 shadow-emerald-950/40",
    error: "border-rose-500/50 bg-slate-900/95 shadow-rose-950/40",
    collision: "border-amber-500/60 bg-slate-900/95 shadow-amber-950/40",
    warning: "border-amber-500/50 bg-slate-900/95 shadow-amber-950/40",
  };

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm w-full animate-in slide-in-from-top-4 duration-200">
      <div
        className={`p-4 rounded-2xl border shadow-xl backdrop-blur-md flex items-start gap-3 ${
          borders[toast.type] || borders.success
        }`}
      >
        {icons[toast.type] || icons.success}
        <div className="flex-1 text-xs">
          <div className="font-bold text-white mb-0.5">{toast.title}</div>
          <div className="text-slate-300 leading-snug">{toast.message}</div>
        </div>
        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
