"use client";

import React from "react";
import { Eye } from "lucide-react";

export default function SeatLegend() {
  return (
    <div className="w-full max-w-5xl mx-auto mb-4 py-2.5 px-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-center gap-5 text-xs text-slate-600 select-none">
      {/* Available */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded border border-[#2DC44D] bg-white"></div>
        <span className="font-medium text-slate-700">Available</span>
      </div>

      {/* Selected (Your Hold) */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded bg-[#2DC44D] text-white flex items-center justify-center font-bold text-[10px] shadow-xs">
          ✓
        </div>
        <span className="font-bold text-[#1EA83C]">Selected</span>
      </div>

      {/* Reserved by Other */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded bg-amber-100 border border-amber-400"></div>
        <span className="text-amber-700 font-medium">Reserved by other</span>
      </div>

      {/* Sold */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded bg-[#EEEEEE] border border-slate-300"></div>
        <span className="text-slate-400">Sold</span>
      </div>

      {/* Live Presence */}
      <div className="flex items-center gap-1.5 pl-3 border-l border-slate-200">
        <span className="px-1.5 py-0.5 rounded-full bg-purple-100 border border-purple-300 text-purple-700 text-[10px] font-bold flex items-center gap-1">
          <Eye className="w-2.5 h-2.5" /> 1
        </span>
        <span className="text-purple-700 font-medium text-[11px]">Live Presence</span>
      </div>
    </div>
  );
}
