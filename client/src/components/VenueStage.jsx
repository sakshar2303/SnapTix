"use client";

import React from "react";
import { Sparkles, MapPin, Calendar, Music, Volume2 } from "lucide-react";

export default function VenueStage({
  eventName,
  date,
  location = "Kuroshio Concert Hall • Main Amphitheater",
  stageLabel = "ACOUSTIC PROSCENIUM • CENTER STAGE",
}) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-6 text-center select-none">
      {/* Event Meta Badges */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-2 text-xs">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Neo-Tokyo World Tour 2026</span>
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span>{location}</span>
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-300 font-mono">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{date || "Friday, Nov 14, 2026 • 8:00 PM JST"}</span>
        </span>
      </div>

      {/* Main Event Title */}
      <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-2">
        {eventName || "Cyber Symphony 2026: Live in Neo-Tokyo"}
      </h1>
      <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto font-medium mb-6">
        Tokyo Philharmonic Orchestra x Synthetic Audio Guild • Live 72-Channel Immersive Acoustic Array
      </p>

      {/* Architectural Proscenium Arch & Volumetric Lighting */}
      <div className="relative py-2 max-w-2xl mx-auto">
        {/* Stage Shell Arch */}
        <div className="relative h-12 sm:h-14 rounded-t-[120px] border-t-2 border-x-2 border-indigo-400/40 bg-gradient-to-b from-indigo-500/15 via-indigo-950/20 to-transparent flex items-center justify-center overflow-hidden shadow-[0_-10px_35px_rgba(99,102,241,0.25)]">
          {/* Volumetric spotlight rays */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-300/30 via-indigo-900/10 to-transparent pointer-events-none"></div>

          {/* Stage floor grid laser lines */}
          <div className="absolute bottom-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-400 to-transparent"></div>

          {/* Stage Center Text */}
          <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-black/40 border border-white/10 backdrop-blur-md">
            <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-indigo-200 uppercase font-mono">
              {stageLabel}
            </span>
          </div>
        </div>

        {/* Volumetric ambient glow cone spilling onto seating */}
        <div className="w-3/4 mx-auto h-8 bg-gradient-to-b from-indigo-500/15 via-indigo-500/5 to-transparent blur-md -mt-1 pointer-events-none"></div>
      </div>
    </div>
  );
}
