"use client";

import React from "react";
import { Film, Clock, MapPin, ExternalLink, ChevronRight, Sparkles, MonitorPlay } from "lucide-react";

export default function VenueStage({
  venueInfo,
  currentTheatre,
  currentAuditorium,
  onSelectAuditorium,
  onOpenTheatreModal,
  selectedShowtime,
  onSelectShowtime,
  activeCity = "Mumbai",
  userLocation,
}) {
  if (!venueInfo) return null;

  const auditoriums = currentTheatre?.auditoriums || [];
  const showtimes = currentAuditorium?.showtimes || currentTheatre?.showtimes || venueInfo.showtimes || ["07:30 PM"];
  const theatreName = currentTheatre?.name || venueInfo.subtitle || venueInfo.cinemaName || "PVR INOX: Phoenix Palladium";
  const theatreArea = currentTheatre?.area || "Lower Parel";
  const theatreDistance = currentTheatre?.distanceKm ? `${currentTheatre.distanceKm} km away` : null;
  const audiName = currentAuditorium?.name || currentTheatre?.audi || venueInfo.audiName || "Audi 4 • IMAX with Laser";
  const mapQuery = currentTheatre?.mapQuery || `${theatreName}+${activeCity}`;
  const audiType = currentAuditorium?.type || "IMAX";

  return (
    <div className="w-full max-w-5xl mx-auto mb-4 select-none space-y-2.5">
      {/* Movie Meta & Cinema Details Header */}
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
                {audiType}
              </span>
              <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold">
                {venueInfo.category || "Movies"}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="flex items-center gap-1 font-medium text-slate-800">
                <MapPin className="w-3.5 h-3.5 text-[#F84464]" />
                <span>{theatreArea}, {activeCity}</span>
              </span>
              <span>•</span>
              <span>{venueInfo.language || "English"}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" /> {venueInfo.duration || "2h 30m"}
              </span>
            </div>
          </div>

          {/* Showtimes Selector for this specific auditorium */}
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
                    {audiType}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Auditorium / Screen Switcher Bar */}
        {auditoriums.length > 1 && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <MonitorPlay className="w-3.5 h-3.5 text-slate-400" />
              <span>Select Screen / Auditorium:</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {auditoriums.map((audi) => {
                const isSelected = audi.id === currentAuditorium?.id;
                const isVip = audi.type === "VIP_LOUNGE";
                const is4DX = audi.type === "4DX";

                let activeClass = "bg-[#00B9F5] text-white border-[#00B9F5]";
                if (isVip) activeClass = "bg-[#E5A93C] text-slate-900 border-[#E5A93C]";
                if (is4DX) activeClass = "bg-[#F59E0B] text-white border-[#F59E0B]";

                return (
                  <button
                    key={audi.id}
                    onClick={() => onSelectAuditorium(audi)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 border shadow-2xs ${
                      isSelected
                        ? activeClass
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    <span>{audi.name}</span>
                    <span className={`text-[10px] px-1 py-0.2 rounded ${
                      isSelected ? "bg-black/20 text-inherit" : "bg-slate-200 text-slate-600"
                    }`}>
                      {audi.totalSeats || 72} seats
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Direct Theatre / Venue Switcher Strip */}
      <div className="px-4 py-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#F84464]/10 text-[#F84464] flex items-center justify-center shrink-0">
            <Film className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#222433]">{theatreName}</span>
              {theatreDistance && (
                <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-semibold text-[10px] border border-emerald-200">
                  {theatreDistance}
                </span>
              )}
            </div>
            <div className="text-slate-500 text-[11px]">{audiName}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 justify-end">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition flex items-center gap-1 text-xs font-medium cursor-pointer"
          >
            <span>Directions</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={onOpenTheatreModal}
            className="px-3 py-1.5 rounded-lg bg-[#333545] hover:bg-[#222433] text-white font-semibold transition flex items-center gap-1 text-xs cursor-pointer shadow-2xs"
          >
            <MapPin className="w-3.5 h-3.5 text-[#F84464]" />
            <span>Change Cinema / Venue</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>
        </div>
      </div>
    </div>
  );
}
