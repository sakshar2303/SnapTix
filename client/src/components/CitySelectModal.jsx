"use client";

import React, { useState } from "react";
import { X, Check, Search, MapPin } from "lucide-react";

export const POPULAR_CITIES = [
  { name: "Mumbai", state: "Maharashtra" },
  { name: "Delhi-NCR", state: "National Capital Region" },
  { name: "Bengaluru", state: "Karnataka" },
  { name: "Hyderabad", state: "Telangana" },
  { name: "Ahmedabad", state: "Gujarat" },
  { name: "Chandigarh", state: "Punjab & Haryana" },
  { name: "Chennai", state: "Tamil Nadu" },
  { name: "Pune", state: "Maharashtra" },
];

export const OTHER_CITIES = [
  "Kolkata",
  "Kochi",
  "Jaipur",
  "Goa",
  "Lucknow",
  "Indore",
  "Surat",
  "Nagpur",
  "Bhopal",
  "Vadodara",
  "Visakhapatnam",
  "Coimbatore",
];

export default function CitySelectModal({ isOpen, currentCity, onSelectCity, onClose }) {
  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  const allCities = [
    ...POPULAR_CITIES.map((c) => c.name),
    ...OTHER_CITIES,
  ];

  const filteredPopular = POPULAR_CITIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.state.toLowerCase().includes(search.toLowerCase())
  );

  const filteredOther = OTHER_CITIES.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl text-[#222433] overflow-hidden">
        {/* Minimalist Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#F84464]" />
            <h3 className="font-bold text-sm tracking-tight text-[#222433]">
              Select City
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Minimalist Search Input */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search for city or region..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-white border border-slate-200 text-xs text-[#222433] placeholder:text-slate-400 focus:outline-none focus:border-[#F84464] shadow-2xs"
              autoFocus
            />
          </div>
        </div>

        {/* City Options List */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          {/* Popular Cities Grid */}
          {filteredPopular.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                Major Metros
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {filteredPopular.map((city) => {
                  const isSelected = city.name === currentCity;
                  return (
                    <button
                      key={city.name}
                      onClick={() => {
                        onSelectCity(city.name);
                        onClose();
                      }}
                      className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? "border-[#F84464] bg-[#F84464]/5 shadow-2xs"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-0.5">
                        <span
                          className={`text-xs font-semibold ${
                            isSelected ? "text-[#F84464] font-bold" : "text-[#222433]"
                          }`}
                        >
                          {city.name}
                        </span>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-[#F84464] shrink-0" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 truncate">
                        {city.state}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Other Cities Alphabetic Pills */}
          {filteredOther.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2.5">
                Other Cities
              </div>
              <div className="flex flex-wrap gap-1.5">
                {filteredOther.map((cityName) => {
                  const isSelected = cityName === currentCity;
                  return (
                    <button
                      key={cityName}
                      onClick={() => {
                        onSelectCity(cityName);
                        onClose();
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs transition border cursor-pointer ${
                        isSelected
                          ? "border-[#F84464] bg-[#F84464] text-white font-bold shadow-2xs"
                          : "border-slate-200 hover:border-slate-300 bg-white text-slate-600 hover:text-[#222433]"
                      }`}
                    >
                      {cityName}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {filteredPopular.length === 0 && filteredOther.length === 0 && (
            <div className="text-center py-6 text-xs text-slate-400">
              No matching cities found for &ldquo;{search}&rdquo;
            </div>
          )}
        </div>

        {/* Subtle Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Currently selected: <strong className="text-slate-700">{currentCity}</strong></span>
          <span>Instant real-time update</span>
        </div>
      </div>
    </div>
  );
}
