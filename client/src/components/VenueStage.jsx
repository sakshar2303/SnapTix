"use client";

import React, { useState } from "react";
import { Film, Clock, MapPin, Sparkles, ChevronRight } from "lucide-react";

export default function VenueStage({
  movieTitle = "DUNE: PART TWO",
  cinemaName = "PVR INOX: Phoenix Palladium, Lower Parel",
  audiName = "Audi 4 • IMAX with Laser (DOLBY ATMOS 7.1)",
  certificate = "UA 16+",
  language = "English • Dolby Atmos 7.1",
  duration = "2h 46m",
  showDate = "Today, 02 Sep 2026",
  showtimes = ["10:15 AM", "01:45 PM", "04:30 PM", "07:30 PM", "10:45 PM"],
}) {
  const [selectedShowtime, setSelectedShowtime] = useState("07:30 PM");

  return (
    <div className="w-full max-w-5xl mx-auto mb-6 select-none">
      {/* Movie Meta & Cinema Details Header */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#252C3B] border border-[#323B4E] shadow-sm mb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {movieTitle}
              </h1>
              <span className="px-1.5 py-0.5 rounded bg-[#323B4E] text-slate-300 text-[10px] font-bold">
                {certificate}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-[#F84464]/20 text-[#F84464] border border-[#F84464]/30 text-[10px] font-bold">
                IMAX 2D
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <strong className="text-white">{cinemaName}</strong>
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">{audiName}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {duration}
              </span>
            </div>
          </div>

          {/* Showtimes Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {showtimes.map((time) => {
              const isSelected = time === selectedShowtime;
              return (
                <button
                  key={time}
                  onClick={() => setSelectedShowtime(time)}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition flex flex-col items-center shrink-0 border ${
                    isSelected
                      ? "bg-[#2DC44D] text-white border-[#2DC44D] shadow-md shadow-emerald-900/30"
                      : "bg-[#1C222F] text-slate-300 border-[#323B4E] hover:border-slate-500"
                  }`}
                >
                  <span>{time}</span>
                  <span className="text-[9px] font-normal opacity-80">IMAX 2D</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
