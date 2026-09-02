"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ShieldCheck,
  RotateCcw,
  User,
  Zap,
  Radio,
  Search,
  ChevronDown,
  Film,
  Activity,
  Calendar,
  Sparkles,
} from "lucide-react";

export default function Header({
  userId,
  isConnected,
  velocity = 0,
  latency = 12,
  activeCategory = "Movies",
  activeCity = "Mumbai",
  activeEventId,
  catalog = [],
  onSelectCategory,
  onSelectEvent,
  onOpenCityModal,
  onOpenStreamModal,
  onOpenOffersModal,
  onOpenGiftCardsModal,
  onOpenListYourShowModal,
  onOpenCorporatesModal,
  onOpenUserProfileModal,
  onReset,
  onOpenSystemInfo,
  onSimulateRace,
  isSimulating = false,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [resetting, setResetting] = useState(false);
  const searchRef = useRef(null);

  const categories = ["Movies", "Stream", "Events", "Plays", "Sports", "Activities"];

  // Filter catalog based on search query
  const searchResults = catalog.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResetClick = async () => {
    if (confirm("Reset all cinema seats and holds for demo?")) {
      setResetting(true);
      try {
        await onReset();
      } finally {
        setTimeout(() => setResetting(false), 400);
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#333545] border-b border-[#292B38] shadow-md">
      {/* Top Primary Bar */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & City Selector */}
        <div className="flex items-center gap-4">
          <div
            onClick={() => onSelectCategory("Movies")}
            className="flex items-center gap-1.5 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#F84464] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-baseline font-black tracking-tight">
              <span className="text-white text-xl">Snap</span>
              <span className="text-[#F84464] text-xl">Tix</span>
            </div>
          </div>

          {/* Interactive City Selector Dropdown */}
          <button
            onClick={onOpenCityModal}
            className="hidden sm:flex items-center gap-1 text-xs text-slate-200 hover:text-white font-medium cursor-pointer px-2.5 py-1.5 rounded bg-[#404356] hover:bg-[#4E526A] border border-[#4F5268] transition"
          >
            <span>{activeCity}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
          </button>
        </div>

        {/* Live Interactive Search Bar */}
        <div ref={searchRef} className="hidden md:flex flex-1 max-w-md mx-4 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search for Movies, Events, Plays, Sports and Activities..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            className="w-full pl-9 pr-4 py-1.5 rounded-md bg-white text-xs text-[#222433] placeholder-slate-400 border border-slate-300 focus:outline-none focus:border-[#F84464] shadow-xs"
          />

          {/* Search Results Dropdown */}
          {isSearchOpen && searchQuery.trim() !== "" && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl border border-slate-200 shadow-2xl py-2 z-50 max-h-72 overflow-y-auto">
              {searchResults.length > 0 ? (
                searchResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectEvent(item.id);
                      setIsSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex items-center justify-between border-b border-slate-100 last:border-0"
                  >
                    <div>
                      <div className="font-bold text-xs text-[#222433]">{item.title}</div>
                      <div className="text-[10px] text-slate-500">{item.subtitle}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-[#F84464] text-[10px] font-bold">
                      {item.category}
                    </span>
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-xs text-slate-500 text-center">
                  No matching shows found. Try &ldquo;Dune&rdquo;, &ldquo;Coldplay&rdquo;, or &ldquo;IPL&rdquo;.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Live Concurrency & Booking Controls */}
        <div className="flex items-center gap-2.5 text-xs">
          {/* Live Socket Latency */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#252733] text-slate-200 border border-[#404356]">
            <Radio className={`w-3 h-3 ${isConnected ? "text-emerald-400 animate-pulse" : "text-rose-400"}`} />
            <span className="text-slate-400 text-[11px]">Socket:</span>
            <span className="font-bold text-emerald-400 text-[11px]">{isConnected ? `${latency}ms` : "Offline"}</span>
          </div>

          {/* Velocity Counter */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#252733] text-slate-200 border border-[#404356]">
            <Activity className="w-3 h-3 text-[#F84464]" />
            <span className="text-slate-400 text-[11px]">Velocity:</span>
            <span className="font-bold text-white text-[11px]">{velocity} booked</span>
          </div>

          {/* 10-Contender Race Test Button */}
          <button
            onClick={onSimulateRace}
            disabled={isSimulating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#F84464] hover:bg-[#E03352] text-white font-bold text-xs shadow-sm transition active:scale-95 cursor-pointer"
            title="Simulate 10 simultaneous concurrent booking attempts on the same seat"
          >
            <Zap className={`w-3.5 h-3.5 ${isSimulating ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">{isSimulating ? "Racing..." : "Test Race"}</span>
            <span className="sm:hidden">Race</span>
          </button>

          {/* Concurrency Architecture Specs */}
          <button
            onClick={onOpenSystemInfo}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#404356] hover:bg-[#4E5269] text-slate-200 hover:text-white text-xs font-semibold transition border border-[#4F5268] cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#00B9F5]" />
            <span className="hidden sm:inline">Proof</span>
          </button>

          {/* Reset Demo Button */}
          <button
            onClick={handleResetClick}
            disabled={resetting}
            className="p-1.5 rounded-md bg-[#404356] hover:bg-[#4E5269] text-slate-300 hover:text-rose-400 transition border border-[#4F5268] cursor-pointer"
            title="Reset seat inventory"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${resetting ? "animate-spin" : ""}`} />
          </button>

          {/* Interactive User Profile Pill */}
          <button
            onClick={onOpenUserProfileModal}
            className="flex items-center gap-2 pl-2 border-l border-[#404356] cursor-pointer hover:opacity-90 transition text-left"
          >
            <div className="w-7 h-7 rounded-full bg-[#F84464]/20 border border-[#F84464]/40 flex items-center justify-center text-xs font-bold text-[#F84464]">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="hidden 2xl:block text-left">
              <div className="text-[10px] text-slate-400">Booker ID</div>
              <div className="text-[11px] font-bold text-white truncate max-w-[85px]">{userId}</div>
            </div>
          </button>
        </div>
      </div>

      {/* BookMyShow Secondary Navigation Strip — ALL TABS FULLY FUNCTIONAL */}
      <div className="bg-[#1F2533] border-t border-[#171C26] hidden md:block">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-between text-xs text-slate-300">
          {/* Main Category Switches */}
          <div className="flex items-center gap-6 font-medium">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`transition cursor-pointer relative py-2 ${
                    isActive
                      ? "text-white font-bold"
                      : "text-slate-300 hover:text-[#F84464]"
                  }`}
                >
                  <span>{cat}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F84464] rounded-full"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Functional Utility Actions */}
          <div className="flex items-center gap-4 text-slate-300 text-[11px]">
            <button
              onClick={onOpenListYourShowModal}
              className="hover:text-[#F84464] transition cursor-pointer"
            >
              ListYourShow
            </button>
            <button
              onClick={onOpenCorporatesModal}
              className="hover:text-[#F84464] transition cursor-pointer"
            >
              Corporates
            </button>
            <button
              onClick={onOpenOffersModal}
              className="hover:text-[#F84464] text-emerald-400 font-semibold transition cursor-pointer flex items-center gap-1"
            >
              <span>Offers</span>
              <span className="px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px]">
                3 CODES
              </span>
            </button>
            <button
              onClick={onOpenGiftCardsModal}
              className="hover:text-[#F84464] transition cursor-pointer"
            >
              Gift Cards
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
