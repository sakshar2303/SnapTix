"use client";

import React from "react";

export default function VenueStage({ eventName, date, stageLabel = "STAGE / SCREEN" }) {
  return (
    <div className="w-full max-w-3xl mx-auto mb-8 text-center">
      {/* Event Header Banner */}
      <div className="mb-4">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-1">
          {eventName || "Cyber Symphony 2026: Live in Neo-Tokyo"}
        </h1>
        <p className="text-xs sm:text-sm text-indigo-400 font-medium tracking-wide">
          {date || "Friday, November 14, 2026 • 8:00 PM EST"}
        </p>
      </div>

      {/* Stage Graphic (Curved Neon Glow) */}
      <div className="relative py-4">
        <div className="w-4/5 sm:w-3/5 mx-auto h-8 sm:h-10 rounded-t-[100px] border-t-2 border-x-2 border-indigo-500/50 bg-gradient-to-b from-indigo-500/20 via-indigo-950/40 to-transparent flex items-center justify-center relative overflow-hidden shadow-[0_-8px_25px_rgba(99,102,241,0.25)]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-400/30 via-transparent to-transparent"></div>
          <span className="text-[11px] sm:text-xs font-black tracking-[0.3em] text-indigo-200 uppercase drop-shadow">
            {stageLabel}
          </span>
        </div>
        {/* Stage floor spotlight gradient */}
        <div className="w-2/3 sm:w-1/2 mx-auto h-4 bg-gradient-to-b from-indigo-500/10 to-transparent blur-sm -mt-1"></div>
      </div>
    </div>
  );
}
