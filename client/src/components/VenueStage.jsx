"use client";

import React from "react";
import { Sliders, Activity, Radio, Cpu } from "lucide-react";

export default function VenueStage({
  eventName = "FREQUENCY PROTOCOL 2026 // LIVE MODULAR FIELD",
  date = "2026.11.14 // 20:00 UTC // ACOUSTIC CHAMBER A",
  location = "CH-1004 RESEARCH CAMPUS • SOUND EMITTER GRID",
  stageLabel = "[ STAGE PROSCENIUM // ACOUSTIC EMITTER 01 ]",
}) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-6 text-center select-none font-mono">
      {/* Hardware Chassis Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-2 text-[10px] text-slate-400">
        <span className="px-2 py-0.5 rounded bg-[#161922] border border-[#2B303E] text-[#FF9500] font-bold">
          [MODULAR FIELD LAB]
        </span>
        <span className="px-2 py-0.5 rounded bg-[#161922] border border-[#2B303E]">
          {location}
        </span>
        <span className="px-2 py-0.5 rounded bg-[#161922] border border-[#2B303E] text-slate-300">
          {date}
        </span>
      </div>

      {/* Main Title */}
      <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white mb-1.5 uppercase font-mono">
        {eventName}
      </h1>
      <p className="text-[11px] text-slate-400 max-w-lg mx-auto mb-6 font-mono">
        72 Discrete Modular Acoustic Pods // Direct Phase-Locked Transducer Array
      </p>

      {/* Industrial Acoustic Emitter Stage Graphic */}
      <div className="relative py-2 max-w-2xl mx-auto">
        {/* Proscenium Emitter Shell */}
        <div className="relative h-12 rounded-t-[100px] border-t border-x border-[#383E4E] bg-gradient-to-b from-[#1C202B] via-[#12141A] to-[#0C0D11] flex items-center justify-center overflow-hidden shadow-lg">
          {/* Calibrated Center Marker */}
          <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FF9500] to-transparent"></div>

          <div className="flex items-center gap-2 px-3 py-0.5 rounded bg-[#090A0D] border border-[#282C38] text-[10px] text-[#FF9500] font-bold tracking-wider">
            <Radio className="w-3 h-3 text-[#FF9500]" />
            <span>{stageLabel}</span>
          </div>
        </div>

        {/* Emitter Projection Lines (Acoustic Beam Simulation) */}
        <div className="w-3/4 mx-auto h-4 bg-gradient-to-b from-[#FF9500]/10 to-transparent blur-xs -mt-1 pointer-events-none"></div>
      </div>
    </div>
  );
}
