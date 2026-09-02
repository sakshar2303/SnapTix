"use client";

import React from "react";
import { Film, Clock, MapPin, Sparkles } from "lucide-react";

export default function VenueStage({
  venueInfo,
  selectedShowtime,
  onSelectShowtime,
  activeCity = "Mumbai",
}) {
  if (!venueInfo) return null;

  const showtimes = venueInfo.showtimes || ["07:30 PM"];

  return (
    <div className="w-full max-w-5xl mx-auto mb-4 select-none">
      {/* Event Details Card */}
      <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-black text-[#222433] tracking-tight">
                {venueInfo.title || venueInfo.movieTitle}
              </h1>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                {venueInfo.rating || venueInfo.certificate || "UA 16+"}
              </span>
              <span className="px-2 py-0.5 rounded bg-[#F84464]/10 text-[#F84464] border border-[#F84464]/20 text-[10px] font-bold">
                {venueInfo.format || "IMAX 2D"}
              </span>
              <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold">
                {venueInfo.category || "Movies"}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="flex items-center gap-1 font-medium text-slate-800">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{venueInfo.subtitle || venueInfo.cinemaName}, {activeCity}</span>
              </span>
              <span>•</span>
              <span>{venueInfo.language || "English"}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" /> {venueInfo.duration || "2h 30m"}
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
                  onClick={() => onSelectShowtime(time)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex flex-col items-center shrink-0 border cursor-pointer ${
                    isSelected
                      ? "bg-[#2DC44D] text-white border-[#2DC44D] shadow-sm"
                      : "bg-white text-slate-700 border-slate-300 hover:border-slate-400 hover:bg-slate-50"
                  }`}
                >
                  <span>{time}</span>
                  <span className={`text-[9px] font-normal ${isSelected ? "text-white/90" : "text-slate-400"}`}>
                    {venueInfo.format || "IMAX 2D"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
