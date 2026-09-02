"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { getUserColor } from "../lib/socket";

export default function Header({
  userId,
  isConnected,
  velocity = 0,
  latency = 12,
  onReset,
  onOpenSystemInfo,
  onSimulateRace,
  isSimulating = false,
}) {
  const [resetting, setResetting] = useState(false);
  const [city, setCity] = useState("Mumbai");

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
        {/* Brand Logo */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-[#F84464] flex items-center justify-center shadow-md">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-baseline font-black tracking-tight">
              <span className="text-white text-xl">Snap</span>
              <span className="text-[#F84464] text-xl">Tix</span>
            </div>
          </div>

          {/* City Selector */}
          <div className="hidden sm:flex items-center gap-1 text-xs text-slate-200 hover:text-white font-medium cursor-pointer px-2.5 py-1.5 rounded bg-[#404356] border border-[#4F5268]">
            <span>{city}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
          </div>
        </div>

        {/* Crisp Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            readOnly
            value="Search for Movies, Events, Plays, Sports and Activities"
            className="w-full pl-9 pr-4 py-1.5 rounded-md bg-[#FFFFFF] text-xs text-[#222433] placeholder-slate-400 border border-slate-300 focus:outline-none cursor-default shadow-xs"
          />
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
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#404356] hover:bg-[#4E5269] text-slate-200 hover:text-white text-xs font-semibold transition border border-[#4F5268]"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#00B9F5]" />
            <span className="hidden sm:inline">Proof</span>
          </button>

          {/* Reset Demo Button */}
          <button
            onClick={handleResetClick}
            disabled={resetting}
            className="p-1.5 rounded-md bg-[#404356] hover:bg-[#4E5269] text-slate-300 hover:text-rose-400 transition border border-[#4F5268]"
            title="Reset seat inventory"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${resetting ? "animate-spin" : ""}`} />
          </button>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#404356]">
            <div className="w-7 h-7 rounded-full bg-[#F84464]/20 border border-[#F84464]/40 flex items-center justify-center text-xs font-bold text-[#F84464]">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="hidden 2xl:block text-left">
              <div className="text-[10px] text-slate-400">Booker ID</div>
              <div className="text-[11px] font-bold text-white">{userId}</div>
            </div>
          </div>
        </div>
      </div>

      {/* BookMyShow Secondary Navigation Strip */}
      <div className="bg-[#1F2533] border-t border-[#171C26] hidden md:block">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-6 font-medium">
            <span className="text-white cursor-pointer hover:text-[#F84464] transition">Movies</span>
            <span className="cursor-pointer hover:text-[#F84464] transition">Stream</span>
            <span className="cursor-pointer hover:text-[#F84464] transition">Events</span>
            <span className="cursor-pointer hover:text-[#F84464] transition">Plays</span>
            <span className="cursor-pointer hover:text-[#F84464] transition">Sports</span>
            <span className="cursor-pointer hover:text-[#F84464] transition">Activities</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>ListYourShow</span>
            <span>Corporates</span>
            <span>Offers</span>
            <span>Gift Cards</span>
          </div>
        </div>
      </div>
    </header>
  );
}
