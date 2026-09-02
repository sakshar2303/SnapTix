"use client";

import React from "react";
import { CheckCircle2, AlertCircle, Clock, Zap, X } from "lucide-react";

export default function Toast({ toast, onDismiss }) {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-[#F84464] shrink-0" />,
    collision: <Zap className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />,
    warning: <Clock className="w-4 h-4 text-amber-400 shrink-0" />,
  };

  const borders = {
    success: "border-emerald-500/50 bg-[#19241E]/95 text-emerald-300",
    error: "border-[#F84464]/60 bg-[#25181C]/95 text-rose-300",
    collision: "border-amber-500/60 bg-[#251F14]/95 text-amber-300",
    warning: "border-amber-500/50 bg-[#251F14]/95 text-amber-300",
  };

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm w-full animate-in slide-in-from-top-3 duration-150 text-xs">
      <div
        className={`p-3.5 rounded-xl border shadow-2xl backdrop-blur-md flex items-start gap-3 ${
          borders[toast.type] || borders.success
        }`}
      >
        {icons[toast.type] || icons.success}
        <div className="flex-1">
          <div className="font-bold text-white text-xs mb-0.5">
            {toast.title}
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
