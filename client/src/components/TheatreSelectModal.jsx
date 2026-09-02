"use client";

import React, { useState } from "react";
import { X, MapPin, Check, Navigation, ExternalLink, Filter, Search, Sparkles } from "lucide-react";
import { getTheatresForCity } from "../lib/theatres";

export default function TheatreSelectModal({
  isOpen,
  activeCity,
  currentTheatreId,
  userLocation,
  onSelectTheatre,
  onDetectLocation,
  isDetectingLocation,
  onClose,
}) {
  const [search, setSearch] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("ALL");

  if (!isOpen) return null;

  const theatres = getTheatresForCity(activeCity);

  const formats = ["ALL", "IMAX", "Dolby Atmos", "4DX", "Laser"];

  const filteredTheatres = theatres.filter((th) => {
    const matchesSearch =
      th.name.toLowerCase().includes(search.toLowerCase()) ||
      th.area.toLowerCase().includes(search.toLowerCase());
    const matchesFormat =
      selectedFormat === "ALL" ||
      th.formats.some((f) => f.toLowerCase().includes(selectedFormat.toLowerCase()));
    return matchesSearch && matchesFormat;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-2xl text-[#222433] overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#F84464]" />
              <h3 className="font-bold text-base text-[#222433]">
                Cinemas & Venues in {activeCity}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Select your local cinema hall or auditorium for direct seating
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Location Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search theatres in ${activeCity} by mall or area...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-white border border-slate-200 text-xs text-[#222433] focus:outline-none focus:border-[#F84464] shadow-2xs"
            />
          </div>

          {/* GPS Auto-Detect Button */}
          <button
            onClick={onDetectLocation}
            disabled={isDetectingLocation}
            className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 hover:border-[#F84464] hover:text-[#F84464] text-slate-700 text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-2xs"
          >
            <Navigation className={`w-3.5 h-3.5 text-[#F84464] ${isDetectingLocation ? "animate-spin" : ""}`} />
            <span>{isDetectingLocation ? "Locating..." : "Use Current GPS"}</span>
          </button>
        </div>

        {/* Format Filter Chips */}
        <div className="px-6 py-2.5 border-b border-slate-100 bg-white flex items-center gap-2 overflow-x-auto shrink-0">
          <span className="text-[10px] uppercase font-bold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Formats:
          </span>
          {formats.map((fmt) => (
            <button
              key={fmt}
              onClick={() => setSelectedFormat(fmt)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer shrink-0 ${
                selectedFormat === fmt
                  ? "bg-[#F84464] text-white font-bold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>

        {/* Theatres List */}
        <div className="p-6 overflow-y-auto space-y-3.5 flex-1 bg-slate-50/30">
          {filteredTheatres.map((th) => {
            const isSelected = th.id === currentTheatreId;
            return (
              <div
                key={th.id}
                className={`p-4 rounded-xl border transition bg-white shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isSelected
                    ? "border-[#F84464] ring-1 ring-[#F84464]/30"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-sm text-[#222433]">{th.name}</h4>
                    {isSelected && (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> Active Venue
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2">
                    <span className="flex items-center gap-1 text-slate-700 font-medium">
                      <MapPin className="w-3 h-3 text-[#F84464]" />
                      <span>{th.area}</span>
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-emerald-600">
                      {th.distanceKm} km away
                    </span>
                    <span>•</span>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${th.mapQuery}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline flex items-center gap-0.5 text-[11px] font-medium"
                    >
                      <span>Directions</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>

                  <div className="text-xs text-slate-700 font-medium mb-2.5">
                    {th.audi}
                  </div>

                  {/* Format & Amenity Badges */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {th.formats.map((fmt) => (
                      <span
                        key={fmt}
                        className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px] border border-slate-200"
                      >
                        {fmt}
                      </span>
                    ))}
                    {th.amenities.slice(0, 3).map((amenity) => (
                      <span
                        key={amenity}
                        className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] border border-emerald-200"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Select Button */}
                <div className="shrink-0 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      onSelectTheatre(th);
                      onClose();
                    }}
                    className={`w-full sm:w-auto px-5 py-2 rounded-lg text-xs font-bold transition cursor-pointer shadow-xs ${
                      isSelected
                        ? "bg-[#2DC44D] hover:bg-[#25A740] text-white"
                        : "bg-[#F84464] hover:bg-[#E03352] text-white"
                    }`}
                  >
                    {isSelected ? "Selected Venue ✓" : "Book at this Cinema"}
                  </button>
                </div>
              </div>
            );
          })}

          {filteredTheatres.length === 0 && (
            <div className="text-center py-8 text-xs text-slate-400">
              No cinemas found matching your filter in {activeCity}.
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-500">
          Showing verified multiplexes with real-time seat inventory in {activeCity}
        </div>
      </div>
    </div>
  );
}
