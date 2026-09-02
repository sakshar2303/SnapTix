"use client";

import React, { useRef } from "react";
import { Lock, Clock, Eye, CheckCircle2 } from "lucide-react";
import { TIERS } from "../lib/constants";

export default function SeatMap({
  seats = [],
  myUserId,
  onSeatClick,
  onSeatHover,
  onSeatLeave,
  presenceMap = {}, // seatId -> count of people looking
  showHeatmap = true,
}) {
  const hoverTimeoutRef = useRef(null);

  const handleMouseEnter = (seat) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      onSeatHover(seat.id);
    }, 150); // Small throttle to prevent flooding
  };

  const handleMouseLeave = (seat) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    onSeatLeave(seat.id);
  };

  // Group seats by row to render row labels
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];

  return (
    <div className="relative w-full overflow-x-auto pb-6 select-none">
      <div className="min-w-[680px] max-w-4xl mx-auto bg-slate-900/40 p-6 sm:p-8 rounded-3xl border border-slate-800/80 shadow-2xl backdrop-blur-sm relative">
        <svg
          viewBox="0 0 540 480"
          className="w-full h-auto drop-shadow-md"
          style={{ maxHeight: "600px" }}
        >
          <defs>
            {/* Pulsing glow filters */}
            <filter id="glow-gold" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#F59E0B" floodOpacity="0.8" />
            </filter>
            <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#06B6D4" floodOpacity="0.8" />
            </filter>
            <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#10B981" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Row Labels (Left & Right) */}
          {rows.map((rowLetter, index) => {
            const yPos = 80 + index * 46 + 18;
            return (
              <g key={`row-label-${rowLetter}`}>
                <text
                  x="20"
                  y={yPos}
                  fill="#64748B"
                  fontSize="12"
                  fontWeight="700"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  {rowLetter}
                </text>
                <text
                  x="510"
                  y={yPos}
                  fill="#64748B"
                  fontSize="12"
                  fontWeight="700"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  {rowLetter}
                </text>
              </g>
            );
          })}

          {/* Render individual seats */}
          {seats.map((seat) => {
            const isMine = seat.isMine || (seat.heldBy && seat.heldBy === myUserId);
            const isHeldByOther = seat.status === "held" && !isMine;
            const isBooked = seat.status === "booked";
            const isAvailable = seat.status === "available";

            const viewerCount = presenceMap[seat.id] || 0;
            const tierInfo = TIERS[seat.tier] || TIERS.STANDARD;

            // Determine colors and styles
            let fillColor = "#1E293B"; // slate-800
            let strokeColor = "#334155"; // slate-700
            let filter = "none";
            let cursorStyle = "cursor-pointer";

            if (isBooked) {
              fillColor = "#0F172A"; // slate-900
              strokeColor = "#EF4444"; // red-500
              cursorStyle = "cursor-not-allowed opacity-50";
            } else if (isMine) {
              fillColor = "#0284C7"; // sky-600
              strokeColor = "#38BDF8"; // sky-400
              filter = "url(#glow-cyan)";
            } else if (isHeldByOther) {
              fillColor = "#78350F"; // amber-900
              strokeColor = "#F59E0B"; // amber-500
              filter = "url(#glow-gold)";
              cursorStyle = "cursor-not-allowed";
            } else if (isAvailable) {
              if (showHeatmap) {
                strokeColor = tierInfo.color;
                fillColor = `${tierInfo.color}18`; // transparent fill
              } else {
                strokeColor = "#10B981"; // emerald
                fillColor = "#064E3B20";
              }
            }

            return (
              <g
                key={seat.id}
                transform={`translate(${seat.x}, ${seat.y})`}
                className={`transition-transform duration-200 ${cursorStyle} group`}
                onClick={() => onSeatClick(seat)}
                onMouseEnter={() => handleMouseEnter(seat)}
                onMouseLeave={() => handleMouseLeave(seat)}
              >
                {/* Seat Cushion SVG Shape */}
                <rect
                  x="0"
                  y="0"
                  width="32"
                  height="30"
                  rx="7"
                  ry="7"
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={isMine ? "2.5" : "1.8"}
                  filter={filter}
                  className="transition-all duration-300 group-hover:stroke-white group-hover:brightness-125"
                />

                {/* Seat Armrests details */}
                <rect
                  x="3"
                  y="26"
                  width="26"
                  height="4"
                  rx="2"
                  fill={strokeColor}
                  opacity="0.8"
                />

                {/* Seat Number / Icon Inside */}
                {isBooked ? (
                  <circle cx="16" cy="14" r="4" fill="#EF4444" opacity="0.8" />
                ) : isMine ? (
                  <text
                    x="16"
                    y="18"
                    fill="#FFFFFF"
                    fontSize="10"
                    fontWeight="800"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    YOU
                  </text>
                ) : isHeldByOther ? (
                  <g transform="translate(10, 8)">
                    {/* Small lock icon */}
                    <circle cx="6" cy="6" r="5" fill="#F59E0B" />
                  </g>
                ) : (
                  <text
                    x="16"
                    y="17"
                    fill={showHeatmap ? tierInfo.color : "#94A3B8"}
                    fontSize="9"
                    fontWeight="600"
                    textAnchor="middle"
                    fontFamily="sans-serif"
                    className="group-hover:fill-white transition-colors"
                  >
                    {seat.col}
                  </text>
                )}

                {/* LIVE PRESENCE INDICATOR: Eye icon or viewer count */}
                {viewerCount > 0 && (
                  <g transform="translate(16, -6)">
                    <rect
                      x="-14"
                      y="-12"
                      width="28"
                      height="16"
                      rx="8"
                      fill="#7C3AED"
                      stroke="#C4B5FD"
                      strokeWidth="1"
                      className="animate-bounce"
                    />
                    <text
                      x="0"
                      y="-1"
                      fill="#FFFFFF"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      👀 {viewerCount}
                    </text>
                  </g>
                )}

                {/* Active countdown pill on user's held seat */}
                {isMine && seat.ttlSeconds > 0 && (
                  <g transform="translate(16, 40)">
                    <rect
                      x="-18"
                      y="-9"
                      width="36"
                      height="15"
                      rx="7"
                      fill="#0284C7"
                      stroke="#BAE6FD"
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="2"
                      fill="#FFFFFF"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {Math.floor(seat.ttlSeconds / 60)}:
                      {(seat.ttlSeconds % 60).toString().padStart(2, "0")}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Floating helper note */}
        <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2 border-t border-slate-800/60 pt-4">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Click any available seat to initiate an atomic 5-minute hold</span>
          </div>
          <div className="text-slate-500 font-mono text-[11px]">
            Realtime Socket.io Room: event:venue-grand-hall
          </div>
        </div>
      </div>
    </div>
  );
}
