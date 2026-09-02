"use client";

import React from "react";
import { TIERS } from "../lib/constants";
import { Eye } from "lucide-react";

export default function SeatLegend() {
  return (
    <div className="w-full max-w-5xl mx-auto mb-4 py-2.5 px-4 rounded-xl bg-[#252C3B] border border-[#323B4E] flex flex-wrap items-center justify-center gap-5 text-xs text-slate-300 select-none">
      {/* Available */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded border border-[#404C63] bg-transparent"></div>
        <span>Available</span>
      </div>

      {/* Selected (Your Hold) */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded bg-[#2DC44D] text-white flex items-center justify-center font-bold text-[10px]">
          ✓
        </div>
        <span className="font-bold text-[#2DC44D]">Selected</span>
      </div>

      {/* Held by Another */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded bg-amber-500/30 border border-amber-500"></div>
        <span className="text-amber-300">Reserved by other</span>
      </div>

      {/* Sold */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded bg-[#2C3446] border border-[#364056]"></div>
        <span className="text-slate-500">Sold</span>
      </div>

      {/* Live Presence */}
      <div className="flex items-center gap-1.5 pl-3 border-l border-[#323B4E]">
        <span className="px-1.5 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-bold">
          👀 1
        </span>
        <span className="text-purple-300">Live Presence</span>
      </div>
    </div>
  );
}
