"use client";

import React, { useState, useRef } from "react";
import { Eye, Info } from "lucide-react";
import { TIERS } from "../lib/constants";

export default function SeatMap({
  seats = [],
  myUserId,
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
              <span className="text-slate-400">({hoveredSeat.section})</span>
              <span className="font-bold text-[#1EA83C] ml-2">
                ₹{hoveredSeat.price}.00
              </span>
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
            <Info className="w-3.5 h-3.5 text-[#00B9F5]" />
            <span>Select a seat to reserve it instantly. Zero risk of double-booking.</span>
          </div>
        )}
      </div>

      {/* Pure White Cinema Seating Canvas */}
      <div className="w-full rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-[0_4px_25px_rgba(0,0,0,0.05)] overflow-hidden">
        {/* Tier 1: RECLINER */}
        <div className="mb-6">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider pb-2 mb-3 border-b border-slate-100 flex items-center justify-between">
            <span className="text-[#F84464] font-black">RECLINER - ₹450.00</span>
            <span className="text-[11px] text-slate-400 font-normal">Plush Motorized Leather</span>
          </div>
          {renderRowGroup(["A", "B"])}
        </div>

        {/* Tier 2: PRIME */}
        <div className="mb-6">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider pb-2 mb-3 border-b border-slate-100 flex items-center justify-between">
            <span className="text-[#1EA83C] font-black">PRIME - ₹290.00</span>
            <span className="text-[11px] text-slate-400 font-normal">Center Acoustic Field</span>
          </div>
          {renderRowGroup(["C", "D", "E"])}
        </div>

        {/* Tier 3: CLASSIC */}
        <div className="mb-10">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider pb-2 mb-3 border-b border-slate-100 flex items-center justify-between">
            <span className="text-[#00B9F5] font-black">CLASSIC - ₹180.00</span>
            <span className="text-[11px] text-slate-400 font-normal">Standard High Back</span>
          </div>
          {renderRowGroup(["F", "G", "H"])}
        </div>

        {/* The Iconic BookMyShow Cinema Screen at Bottom */}
        <div className="mt-10 pt-6 flex flex-col items-center justify-center">
          <div className="w-4/5 sm:w-3/5 h-3 border-t-4 border-[#00B9F5] rounded-t-[100px] shadow-[0_-8px_15px_rgba(0,185,245,0.2)]"></div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-2">
            All eyes this way please! Screen this way
          </p>
        </div>
      </div>
    </div>
  );

  function renderRowGroup(rowLetters) {
    return (
      <div className="space-y-3">
        {rowLetters.map((rowLetter) => {
          const rowSeats = seats.filter((s) => s.row === rowLetter);
          const leftCol = rowSeats.filter((s) => s.col <= 3);
          const centerCol = rowSeats.filter((s) => s.col >= 4 && s.col <= 6);
          const rightCol = rowSeats.filter((s) => s.col >= 7);

          return (
            <div key={rowLetter} className="flex items-center justify-center gap-2 sm:gap-4">
              {/* Left Row Letter */}
              <span className="w-5 text-center text-xs font-bold text-slate-400 font-mono">
                {rowLetter}
              </span>

              {/* Left Block (Seats 1-3) */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {leftCol.map((seat) => renderSeatBox(seat))}
              </div>

              {/* Aisle Gap 1 */}
              <div className="w-4 sm:w-8"></div>

              {/* Center Block (Seats 4-6) */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {centerCol.map((seat) => renderSeatBox(seat))}
              </div>

              {/* Aisle Gap 2 */}
              <div className="w-4 sm:w-8"></div>

              {/* Right Block (Seats 7-9) */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {rightCol.map((seat) => renderSeatBox(seat))}
              </div>

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
    const isHeldByOther = seat.status === "held" && !isMine;
    const isBooked = seat.status === "booked";
    const isAvailable = seat.status === "available";
    const viewerCount = presenceMap[seat.id] || 0;

    let boxStyles = "bg-white border-[#2DC44D] text-[#1EA83C] hover:bg-[#1EA83C] hover:text-white cursor-pointer";

    if (isBooked) {
      boxStyles = "bg-[#EEEEEE] border-slate-200 text-slate-300 cursor-not-allowed";
    } else if (isMine) {
      boxStyles = "bg-[#1EA83C] border-[#1EA83C] text-white font-black shadow-md bms-selected-seat cursor-pointer";
    } else if (isHeldByOther) {
      boxStyles = "bg-amber-100 border-amber-400 text-amber-700 cursor-not-allowed";
    } else if (isAvailable) {
      boxStyles = "bg-white border-[#2DC44D] text-[#1EA83C] hover:bg-[#1EA83C] hover:text-white cursor-pointer shadow-2xs";
    }

    return (
      <div
        key={seat.id}
        onClick={() => onSeatClick(seat)}
        onMouseEnter={() => handleMouseEnter(seat)}
        onMouseLeave={() => handleMouseLeave(seat)}
        className="relative group transition-transform active:scale-95"
      >
        <div
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md border flex items-center justify-center text-[11px] font-bold transition-all ${boxStyles}`}
        >
          {isBooked ? "" : isMine ? "✓" : seat.col}
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
