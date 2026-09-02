"use client";

import React from "react";
import { TIERS } from "../lib/constants";
import { Eye, Layers, Sliders } from "lucide-react";

export default function SeatLegend({ showHeatmap, onToggleHeatmap }) {
  return (
    <div className="w-full max-w-5xl mx-auto mb-4 px-4 py-2.5 rounded-xl bg-[#101217] border border-[#232734] flex flex-wrap items-center justify-between gap-3 select-none font-mono text-[11px]">
      {/* Tier Indicators */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-slate-300">
        {showHeatmap ? (
          <div className="flex items-center gap-3">
            <span className="text-slate-500 font-bold uppercase text-[10px]">
              TIERS:
            </span>
            {Object.entries(TIERS).map(([key, tier]) => (
              <div key={key} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-xs"
                  style={{
                    backgroundColor: tier.color,
                  }}
                ></span>
                <span className="font-bold text-slate-200">
                  {tier.badge} <span className="text-slate-500">(${tier.price})</span>
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#10B981]"></span>
            <span className="text-slate-200 font-bold">AVAILABLE</span>
          </div>
        )}

        {/* State Indicators */}
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#38BDF8] shadow-[0_0_5px_#38BDF8]"></span>
          <span className="font-bold text-[#38BDF8]">YOUR_HOLD</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#FF9500]"></span>
          <span className="text-[#FF9500] font-bold">LOCKED</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#333742]"></span>
          <span className="text-slate-500">BOOKED</span>
        </div>

        {/* Live Presence Indicator */}
        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.2 rounded bg-purple-900/50 border border-purple-500/40 text-purple-300 text-[10px] font-bold">
            👀 LIVE
          </span>
          <span className="text-purple-300 text-[10px]">PRESENCE</span>
        </div>
      </div>

      {/* Heatmap Toggle */}
      <button
        onClick={onToggleHeatmap}
        className={`te-button px-2.5 py-1 rounded text-[10px] font-bold uppercase transition ${
          showHeatmap
            ? "text-[#FF9500] border-[#FF9500]/40"
            : "text-slate-400 border-slate-700"
        }`}
      >
        <span>HEATMAP: [{showHeatmap ? "ACTIVE" : "OFF"}]</span>
      </button>
    </div>
  );
}
