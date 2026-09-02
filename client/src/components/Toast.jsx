"use client";

import React from "react";
import { CheckCircle2, AlertCircle, Clock, Zap, X } from "lucide-react";

export default function Toast({ toast, onDismiss }) {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-[#F84464] shrink-0" />,
    collision: <Zap className="w-4 h-4 text-amber-500 shrink-0 animate-bounce" />,
    warning: <Clock className="w-4 h-4 text-amber-500 shrink-0" />,
  };

  const borders = {
    success: "border-emerald-300 bg-white text-emerald-900 shadow-lg",
    error: "border-rose-300 bg-white text-rose-900 shadow-lg",
    collision: "border-amber-300 bg-white text-amber-900 shadow-lg",
    warning: "border-amber-300 bg-white text-amber-900 shadow-lg",
  };

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm w-full animate-in slide-in-from-top-3 duration-150 text-xs">
      <div
        className={`p-3.5 rounded-xl border shadow-xl flex items-start gap-3 ${
          borders[toast.type] || borders.success
        }`}
      >
        {icons[toast.type] || icons.success}
        <div className="flex-1">
          <div className="font-bold text-[#222433] text-xs mb-0.5">
            {toast.title}
          </div>
          <div className="text-slate-600 text-[11px] leading-snug">
            {toast.message}
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-slate-700 p-0.5 rounded hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
