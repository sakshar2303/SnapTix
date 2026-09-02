"use client";

import React from "react";
import { TIERS } from "../lib/constants";
import { Eye, Layers, Sparkles } from "lucide-react";

export default function SeatLegend({ showHeatmap, onToggleHeatmap }) {
  return (
    <div className="w-full max-w-5xl mx-auto mb-5 px-5 py-3 rounded-2xl bg-[#0B0E15]/80 border border-white/[0.08] backdrop-blur-md flex flex-wrap items-center justify-between gap-4 select-none">
      {/* Tiers & Status */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-300">
        {/* Tier Heatmap items */}
        {showHeatmap ? (
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              Tiers:
            </span>
            {Object.entries(TIERS).map(([key, tier]) => (
              <div key={key} className="flex items-center gap-1.5">
                <span
                  className="w-3.5 h-3.5 rounded-md"
                  style={{
                    backgroundColor: `${tier.color}35`,
                    border: `1.5px solid ${tier.color}`,
                  }}
                ></span>
                <span className="text-[11px] font-medium text-slate-200">
                  {tier.badge} <span className="font-mono text-slate-400">(${tier.price})</span>
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-emerald-500/25 border border-emerald-400"></span>
            <span className="text-slate-200 font-medium text-[11px]">Available</span>
          </div>
        )}

        {/* Held By You */}
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-md bg-sky-500/40 border-2 border-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.7)]"></span>
          <span className="font-bold text-sky-400 text-[11px]">Your Hold</span>
        </div>

        {/* Held by Other */}
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-md bg-amber-600/40 border border-amber-400"></span>
          <span className="text-amber-300 font-medium text-[11px]">Held by Attendee</span>
        </div>

        {/* Booked */}
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-md bg-[#11141B] border border-rose-500/50 opacity-60"></span>
          <span className="text-slate-400 text-[11px]">Booked</span>
        </div>

        {/* Live Presence */}
        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 rounded-full bg-purple-600/30 border border-purple-400/50 text-purple-300 text-[10px] font-bold flex items-center gap-1">
            <Eye className="w-2.5 h-2.5" /> 1
          </span>
          <span className="text-purple-300 text-[11px]">Live Presence</span>
        </div>
      </div>

      {/* Heatmap Mode Switch */}
      <button
        onClick={onToggleHeatmap}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
          showHeatmap
            ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-sm"
            : "bg-white/[0.04] text-slate-400 border-white/[0.08] hover:text-white"
        }`}
      >
        <Layers className="w-3.5 h-3.5 text-indigo-400" />
        <span>Price Heatmap: {showHeatmap ? "ON" : "OFF"}</span>
      </button>
    </div>
  );
}
