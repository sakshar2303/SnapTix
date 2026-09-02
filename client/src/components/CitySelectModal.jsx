"use client";

import React, { useState } from "react";
import { MapPin, X, Check, Search } from "lucide-react";

export const POPULAR_CITIES = [
  { name: "Mumbai", state: "Maharashtra", popular: true, icon: "🏙️" },
  { name: "Delhi-NCR", state: "Delhi", popular: true, icon: "🏛️" },
  { name: "Bengaluru", state: "Karnataka", popular: true, icon: "💻" },
  { name: "Hyderabad", state: "Telangana", popular: true, icon: "🏰" },
  { name: "Ahmedabad", state: "Gujarat", popular: true, icon: "🪁" },
  { name: "Chandigarh", state: "Punjab", popular: true, icon: "🌿" },
  { name: "Chennai", state: "Tamil Nadu", popular: true, icon: "🏖️" },
  { name: "Pune", state: "Maharashtra", popular: true, icon: "🎓" },
  { name: "Kolkata", state: "West Bengal", popular: false, icon: "🌉" },
  { name: "Kochi", state: "Kerala", popular: false, icon: "🌴" },
  { name: "Jaipur", state: "Rajasthan", popular: false, icon: "👑" },
  { name: "Goa", state: "Goa", popular: false, icon: "☀️" },
];

export default function CitySelectModal({ isOpen, currentCity, onSelectCity, onClose }) {
  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  const filteredCities = POPULAR_CITIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl text-[#222433] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#F84464]" />
            <h3 className="font-bold text-base text-[#222433]">Select Your City</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search for your city (e.g. Mumbai, Bengaluru)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-[#222433] focus:outline-none focus:border-[#F84464]"
              autoFocus
            />
          </div>
        </div>

        {/* Popular Cities Grid */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
            Popular Cities
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {filteredCities.map((city) => {
              const isSelected = city.name === currentCity;
              return (
                <button
                  key={city.name}
                  onClick={() => {
                    onSelectCity(city.name);
                    onClose();
                  }}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                    isSelected
                      ? "border-[#F84464] bg-[#F84464]/10 text-[#F84464] font-bold shadow-xs"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <span className="text-2xl">{city.icon}</span>
                  <span className="text-xs">{city.name}</span>
                  {isSelected && (
                    <span className="text-[10px] text-[#F84464] font-bold flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> Selected
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-500">
          Selected city filters all cinema showtimes and event venues
        </div>
      </div>
    </div>
  );
}
