"use client";

import React, { useState, useRef } from "react";
import { Eye, Info, Sparkles, Zap, Utensils } from "lucide-react";

export default function SeatMap({
  seats = [],
  currentAuditorium,
  myUserId,
  selectedSeats = [],
  onSeatClick,
  onSeatHover,
  onSeatLeave,
  presenceMap = {},
}) {
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const hoverTimeoutRef = useRef(null);

  const handleMouseEnter = (seat) => {
    setHoveredSeat(seat);
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      onSeatHover(seat.id);
    }, 120);
  };

  const handleMouseLeave = (seat) => {
    setHoveredSeat(null);
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    onSeatLeave(seat.id);
  };

  // Get unique sections from seats or auditorium definition
  const sections = currentAuditorium?.tiers || [
    { name: "RECLINER", price: 450, rows: ["A", "B"], desc: "Motorized Leather" },
    { name: "PRIME", price: 290, rows: ["C", "D", "E"], desc: "Center Field" },
    { name: "CLASSIC", price: 180, rows: ["F", "G", "H"], desc: "Cinema Seating" },
  ];

  const layoutType = currentAuditorium?.layoutType || "standard";
  const isLuxury = layoutType === "luxury_couples";
  const is4DX = layoutType === "quad_pods";
  const screenTheme = currentAuditorium?.themeColor || "#00B9F5";

  return (
    <div className="relative w-full max-w-5xl mx-auto select-none">
      {/* Interactive Hover Tooltip Strip */}
      <div className="mb-3 h-10 w-full flex items-center justify-between px-4 py-2 rounded-lg bg-white border border-slate-200/80 text-xs text-slate-600 shadow-xs">
        {hoveredSeat ? (
          <div className="w-full flex items-center justify-between animate-in fade-in duration-100">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#222433] text-sm">
                Seat {hoveredSeat.label}
              </span>
              <span className="text-slate-400">({hoveredSeat.section || hoveredSeat.tier})</span>
              <span className="font-bold text-[#1EA83C] ml-2">
                ₹{hoveredSeat.price}.00
              </span>
              {isLuxury && (
                <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                  Twin Lounger
                </span>
              )}
              {is4DX && (
                <span className="px-1.5 py-0.2 rounded bg-orange-100 text-orange-800 text-[10px] font-bold">
                  Motion Pod
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {presenceMap[hoveredSeat.id] > 0 && (
                <span className="px-2 py-0.5 rounded bg-purple-100 border border-purple-300 text-purple-700 text-[11px] font-semibold flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{presenceMap[hoveredSeat.id]} viewing</span>
                </span>
              )}
              <span className="text-[11px]">
                Status:{" "}
                <strong
                  className={
                    hoveredSeat.status === "booked"
                      ? "text-slate-400"
                      : hoveredSeat.status === "held"
                      ? "text-amber-600"
                      : "text-[#1EA83C]"
                  }
                >
                  {hoveredSeat.status === "booked"
                    ? "SOLD"
                    : hoveredSeat.status === "held"
                    ? "RESERVED"
                    : "AVAILABLE"}
                </strong>
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <Info className="w-3.5 h-3.5" style={{ color: screenTheme }} />
            <span>
              {isLuxury
                ? "Insignia VIP Lounge: Each seat includes motorized full-recline and at-seat dining console."
                : is4DX
                ? "4DX Motion: Synchronized quad pods with heave, roll, scent, and environmental FX."
                : "Select a seat to reserve it instantly. Real-time concurrency guarantee."}
            </span>
          </div>
        )}
      </div>

      {/* Pure White Cinema Seating Canvas */}
      <div className="w-full rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-[0_4px_25px_rgba(0,0,0,0.05)] overflow-hidden">
        {/* Render Tiers dynamically according to Auditorium configuration */}
        <div className="space-y-6">
          {sections.map((section, idx) => {
            const sectionRows = section.rows || ["A", "B"];
            const sectionColor = idx === 0 ? "#F84464" : idx === 1 ? "#1EA83C" : "#00B9F5";

            return (
              <div key={section.name || section.id}>
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider pb-2 mb-3 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-black" style={{ color: sectionColor }}>
                    {section.name} - ₹{section.price}.00
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    {section.desc}
                  </span>
                </div>
                {renderRowGroup(sectionRows)}
              </div>
            );
          })}
        </div>

        {/* Dynamic Curved Screen at Bottom */}
        <div className="mt-12 pt-6 flex flex-col items-center justify-center">
          <div
            className="w-4/5 sm:w-3/5 h-3 border-t-4 rounded-t-[100px]"
            style={{
              borderColor: screenTheme,
              boxShadow: `0 -8px 20px ${screenTheme}33`,
            }}
          ></div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-2.5 flex items-center gap-1.5">
            <span>{currentAuditorium?.screenTag || "All eyes this way please! Screen this way"}</span>
          </p>
        </div>
      </div>
    </div>
  );

  // Render rows based on auditorium arrangement: standard, luxury couples, or 4DX quad pods
  function renderRowGroup(rowLetters) {
    return (
      <div className="space-y-3">
        {rowLetters.map((rowLetter) => {
          const rowSeats = seats.filter((s) => s.row === rowLetter);
          if (rowSeats.length === 0) return null;

          return (
            <div key={rowLetter} className="flex items-center justify-center gap-2 sm:gap-4">
              {/* Left Row Letter */}
              <span className="w-5 text-center text-xs font-bold text-slate-400 font-mono">
                {rowLetter}
              </span>

              {/* Seating Layout Branches */}
              {isLuxury ? (
                // Luxury Couples Layout: Twin Loungers [1 2] table [3 4] aisle [5 6] table [7 8]
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-1 bg-amber-50/60 p-1 rounded-lg border border-amber-200/60">
                    {rowSeats.filter((s) => s.col <= 2).map(renderSeatBox)}
                  </div>

                  <div className="w-5 flex items-center justify-center text-[10px] text-amber-700 opacity-60" title="Dining Console">
                    <Utensils className="w-3 h-3" />
                  </div>

                  <div className="flex items-center gap-1 bg-amber-50/60 p-1 rounded-lg border border-amber-200/60">
                    {rowSeats.filter((s) => s.col >= 3 && s.col <= 4).map(renderSeatBox)}
                  </div>

                  {/* Wide Aisle */}
                  <div className="w-4 sm:w-8"></div>

                  <div className="flex items-center gap-1 bg-amber-50/60 p-1 rounded-lg border border-amber-200/60">
                    {rowSeats.filter((s) => s.col >= 5 && s.col <= 6).map(renderSeatBox)}
                  </div>

                  <div className="w-5 flex items-center justify-center text-[10px] text-amber-700 opacity-60" title="Dining Console">
                    <Utensils className="w-3 h-3" />
                  </div>

                  <div className="flex items-center gap-1 bg-amber-50/60 p-1 rounded-lg border border-amber-200/60">
                    {rowSeats.filter((s) => s.col >= 7 && s.col <= 8).map(renderSeatBox)}
                  </div>
                </div>
              ) : is4DX ? (
                // 4DX Motion Pod Layout: Quad Pods [1 2 3 4] | aisle | [5 6 7 8]
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-orange-50/60 border border-orange-200">
                    <span className="text-[8px] font-mono font-bold text-orange-600 -rotate-90">POD</span>
                    {rowSeats.filter((s) => s.col <= 4).map(renderSeatBox)}
                  </div>

                  {/* Central Aisle */}
                  <div className="w-6 sm:w-10"></div>

                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-orange-50/60 border border-orange-200">
                    {rowSeats.filter((s) => s.col >= 5 && s.col <= 8).map(renderSeatBox)}
                    <span className="text-[8px] font-mono font-bold text-orange-600 rotate-90">POD</span>
                  </div>
                </div>
              ) : (
                // Standard Cinema Layout: 3 Blocks of 3 seats (1-3, 4-6, 7-9)
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {rowSeats.filter((s) => s.col <= 3).map(renderSeatBox)}
                  </div>

                  <div className="w-4 sm:w-8"></div>

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {rowSeats.filter((s) => s.col >= 4 && s.col <= 6).map(renderSeatBox)}
                  </div>

                  <div className="w-4 sm:w-8"></div>

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {rowSeats.filter((s) => s.col >= 7).map(renderSeatBox)}
                  </div>
                </div>
              )}

              {/* Right Row Letter */}
              <span className="w-5 text-center text-xs font-bold text-slate-400 font-mono">
                {rowLetter}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  function renderSeatBox(seat) {
    const isMine = seat.isMine || (seat.heldBy && seat.heldBy === myUserId);
    const isInCart = selectedSeats.some((s) => s.id === seat.id); // user clicked but not held yet
    const isHeldByOther = seat.status === "held" && !isMine;
    const isBooked = seat.status === "booked";
    const isAvailable = seat.status === "available";
    const viewerCount = presenceMap[seat.id] || 0;

    let boxStyles = "bg-white border-[#2DC44D] text-[#1EA83C] hover:bg-[#1EA83C] hover:text-white cursor-pointer";

    if (isBooked) {
      boxStyles = "bg-[#EEEEEE] border-slate-200 text-slate-300 cursor-not-allowed";
    } else if (isMine) {
      boxStyles = "bg-[#1EA83C] border-[#1EA83C] text-white font-black shadow-md bms-selected-seat cursor-pointer";
    } else if (isInCart) {
      // In local cart, not yet held
      boxStyles = "bg-indigo-600 border-indigo-600 text-white font-black shadow-md ring-2 ring-indigo-300 cursor-pointer scale-105";
    } else if (isHeldByOther) {
      boxStyles = "bg-amber-100 border-amber-400 text-amber-700 cursor-not-allowed";
    } else if (isAvailable) {
      if (isLuxury) {
        boxStyles = "bg-white border-amber-400 text-amber-800 hover:bg-amber-500 hover:text-white cursor-pointer shadow-2xs";
      } else if (is4DX) {
        boxStyles = "bg-white border-orange-400 text-orange-700 hover:bg-orange-500 hover:text-white cursor-pointer shadow-2xs";
      } else {
        boxStyles = "bg-white border-[#2DC44D] text-[#1EA83C] hover:bg-[#1EA83C] hover:text-white cursor-pointer shadow-2xs";
      }
    }

    // Wider lounger size for luxury seats
    const seatDimensions = isLuxury
      ? "w-8 h-8 sm:w-9 sm:h-9 rounded-lg"
      : is4DX
      ? "w-7 h-7 sm:w-8 sm:h-8 rounded-lg"
      : "w-7 h-7 sm:w-8 sm:h-8 rounded-md";

    return (
      <div
        key={seat.id}
        onClick={() => onSeatClick(seat)}
        onMouseEnter={() => handleMouseEnter(seat)}
        onMouseLeave={() => handleMouseLeave(seat)}
        className="relative group transition-transform active:scale-95"
      >
        <div
          className={`${seatDimensions} border flex items-center justify-center text-[11px] font-bold transition-all ${boxStyles}`}
        >
          {isBooked ? "" : isMine ? "✓" : isInCart ? "✓" : seat.col}
        </div>

        {/* Live Presence Badge on Top */}
        {viewerCount > 0 && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-1 rounded-full bg-purple-600 text-white text-[9px] font-bold shadow-md animate-bounce pointer-events-none whitespace-nowrap">
            👀 {viewerCount}
          </div>
        )}

        {/* Active Countdown Tag on User's Held Seat */}
        {isMine && seat.ttlSeconds > 0 && (
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-1 py-0.2 rounded bg-[#1EA83C] text-white text-[9px] font-bold shadow-xs pointer-events-none whitespace-nowrap">
            {Math.floor(seat.ttlSeconds / 60)}:{(seat.ttlSeconds % 60).toString().padStart(2, "0")}
          </div>
        )}
      </div>
    );
  }
}
