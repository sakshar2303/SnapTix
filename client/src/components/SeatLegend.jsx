"use client";

import React from "react";
import { TIERS } from "../lib/constants";
import { Eye, Layers } from "lucide-react";

export default function SeatLegend({ showHeatmap, onToggleHeatmap }) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-6 px-4 py-3 bg-slate-900/60 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
      {/* Status Legend Items */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-300">
        {/* Available / Tiers */}
        {showHeatmap ? (
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-medium">Tiers:</span>
            {Object.entries(TIERS).map(([key, tier]) => (
              <div key={key} className="flex items-center gap-1.5">
                <span
                  className="w-3.5 h-3.5 rounded"
                  style={{
                    backgroundColor: `${tier.color}30`,
                    border: `1.5px solid ${tier.color}`,
                  }}
                ></span>
                <span className="text-[11px] font-medium text-slate-300">
                  {tier.badge} (${tier.price})
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-emerald-500/20 border border-emerald-500"></span>
            <span>Available</span>
          </div>
        )}

        {/* Held By You */}
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-sky-500/30 border-2 border-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]"></span>
          <span className="font-semibold text-sky-400">Held by You</span>
        </div>

        {/* Held by Other */}
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-amber-600/40 border border-amber-500"></span>
          <span className="text-amber-400">Held by Other</span>
        </div>

        {/* Booked */}
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-slate-900 border border-rose-500 opacity-60"></span>
          <span className="text-slate-400">Booked</span>
        </div>

        {/* Live Hover Presence */}
        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center gap-1">
            <Eye className="w-2.5 h-2.5" /> 1
          </span>
          <span className="text-purple-300">Live Presence</span>
        </div>
      </div>

      {/* Heatmap Toggle Button */}
      <button
        onClick={onToggleHeatmap}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition border ${
          showHeatmap
            ? "bg-indigo-600/30 text-indigo-300 border-indigo-500/50"
            : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
        }`}
      >
        <Layers className="w-3.5 h-3.5" />
        <span>Price Heatmap: {showHeatmap ? "ON" : "OFF"}</span>
      </button>
    </div>
  );
}
