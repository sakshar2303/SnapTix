"use client";

import React from "react";
import { CheckCircle2, AlertCircle, Clock, Zap, X, Terminal } from "lucide-react";

export default function Toast({ toast, onDismiss }) {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />,
    collision: <Zap className="w-4 h-4 text-[#FF9500] shrink-0 animate-bounce" />,
    warning: <Clock className="w-4 h-4 text-[#FF9500] shrink-0" />,
  };

  const borders = {
    success: "border-emerald-500/40 bg-[#0E1210]/95 text-emerald-300",
    error: "border-rose-500/40 bg-[#140C0E]/95 text-rose-300",
    collision: "border-[#FF9500]/50 bg-[#141009]/95 text-[#FF9500]",
    warning: "border-[#FF9500]/40 bg-[#12100A]/95 text-amber-300",
  };

  return (
    <div className="fixed top-18 right-4 z-50 max-w-sm w-full animate-in slide-in-from-top-3 duration-150 font-mono text-xs">
      <div
        className={`p-3.5 rounded-xl border shadow-2xl backdrop-blur-md flex items-start gap-3 ${
          borders[toast.type] || borders.success
        }`}
      >
        {icons[toast.type] || icons.success}
        <div className="flex-1">
          <div className="font-bold text-white uppercase text-[11px] mb-0.5">
            [{toast.title}]
          </div>
          <div className="text-slate-300 text-[11px] leading-snug">
            {toast.message}
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-white p-0.5 rounded hover:bg-white/10 transition"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
