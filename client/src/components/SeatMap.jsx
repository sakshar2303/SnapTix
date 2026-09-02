"use client";

import React, { useState, useRef } from "react";
import { Lock, Clock, Eye, Sparkles, Volume2, Compass, ShieldCheck } from "lucide-react";
import { TIERS } from "../lib/constants";

export default function SeatMap({
  seats = [],
  myUserId,
  onSeatClick,
  onSeatHover,
  onSeatLeave,
  presenceMap = {},
  showHeatmap = true,
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

  // Row labels
  const rowLabels = [
    { row: "A", tier: "VIP", yOffset: 125 },
    { row: "B", tier: "VIP", yOffset: 168 },
    { row: "C", tier: "PREFERRED", yOffset: 212 },
    { row: "D", tier: "PREFERRED", yOffset: 256 },
    { row: "E", tier: "PREFERRED", yOffset: 300 },
    { row: "F", tier: "STANDARD", yOffset: 344 },
    { row: "G", tier: "STANDARD", yOffset: 388 },
    { row: "H", tier: "STANDARD", yOffset: 432 },
  ];

  return (
    <div className="relative w-full max-w-5xl mx-auto select-none">
      {/* Interactive Seat Sightline HUD (Floats above or anchored at top) */}
      <div className="mb-4 h-14 w-full flex items-center justify-between px-5 py-2.5 rounded-2xl bg-[#0C0F17]/90 border border-white/[0.08] backdrop-blur-md">
        {hoveredSeat ? (
          <div className="w-full flex items-center justify-between gap-4 animate-in fade-in duration-150 text-xs">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-mono font-black text-sm text-white shadow-md"
                style={{
                  backgroundColor: TIERS[hoveredSeat.tier]?.color || "#38BDF8",
                }}
              >
                {hoveredSeat.id}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{hoveredSeat.section || "Orchestra"}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/[0.06] text-slate-300 font-mono">
                    ${hoveredSeat.price}
                  </span>
                  <span className="text-[11px] font-semibold text-sky-400">
                    {TIERS[hoveredSeat.tier]?.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {hoveredSeat.sightline || "Direct Stage View • Center"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {presenceMap[hoveredSeat.id] > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-purple-500/20 text-purple-300 text-[11px] font-semibold border border-purple-500/30">
                  <Eye className="w-3 h-3" />
                  <span>{presenceMap[hoveredSeat.id]} attendees looking right now</span>
                </div>
              )}
              <div className="text-[11px] text-slate-400 font-mono">
                Status:{" "}
                <span
                  className={`font-bold ${
                    hoveredSeat.status === "booked"
                      ? "text-rose-400"
                      : hoveredSeat.status === "held"
                      ? "text-amber-400"
                      : "text-emerald-400"
                  }`}
                >
                  {hoveredSeat.status?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-sky-400 animate-pulse" />
              <span>Hover over any luxury recliner to inspect sightline acoustics & live attendance</span>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-[11px] font-mono text-slate-500">
              <span>Focal Center: Stage Center Proscenium</span>
              <span>•</span>
              <span>Curved Radial Array</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Curved Amphitheater SVG Bowl */}
      <div className="relative w-full rounded-3xl bg-gradient-to-b from-[#0B0E15] via-[#090C12] to-[#07090E] p-6 sm:p-8 border border-white/[0.08] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Subtle acoustic soundwave rings in background */}
        <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center">
          <div className="w-[450px] h-[450px] rounded-full border border-indigo-500/20 -translate-y-24"></div>
          <div className="w-[620px] h-[620px] rounded-full border border-indigo-500/15 -translate-y-24"></div>
          <div className="w-[800px] h-[800px] rounded-full border border-indigo-500/10 -translate-y-24"></div>
        </div>

        <svg
          viewBox="0 0 900 540"
          className="w-full h-auto drop-shadow-2xl"
          style={{ maxHeight: "680px" }}
        >
          <defs>
            {/* Ambient Radial Spotlight Cone from Stage */}
            <radialGradient id="stage-light-cone" cx="50%" cy="0%" r="90%">
              <stop offset="0%" stopColor="#818CF8" stopOpacity="0.25" />
              <stop offset="45%" stopColor="#6366F1" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#0B0E15" stopOpacity="0" />
            </radialGradient>

            {/* Custom Glow Filters */}
            <filter id="glow-gold" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#EAB308" floodOpacity="0.8" />
            </filter>
            <filter id="glow-blue" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#38BDF8" floodOpacity="0.9" />
            </filter>
            <filter id="glow-purple" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#A855F7" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Background Spotlight Cone Beam */}
          <polygon
            points="350,15 550,15 850,520 50,520"
            fill="url(#stage-light-cone)"
            pointerEvents="none"
          />

          {/* Section Arch Guide Lines */}
          <path
            d="M 120,240 A 480,480 0 0,0 780,240"
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeDasharray="4 6"
            strokeWidth="1.5"
          />
          <path
            d="M 60,370 A 610,610 0 0,0 840,370"
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeDasharray="4 6"
            strokeWidth="1.5"
          />

          {/* Section Annotations (Architectural labels) */}
          <text x="75" y="195" fill="#EAB308" fontSize="10" fontWeight="800" letterSpacing="0.15em" opacity="0.65" fontFamily="monospace">
            ORCHESTRA (VIP)
          </text>
          <text x="50" y="325" fill="#38BDF8" fontSize="10" fontWeight="800" letterSpacing="0.15em" opacity="0.65" fontFamily="monospace">
            GRAND MEZZANINE
          </text>
          <text x="35" y="460" fill="#34D399" fontSize="10" fontWeight="800" letterSpacing="0.15em" opacity="0.65" fontFamily="monospace">
            ROYAL BALCONY
          </text>

          {/* Left and Right Aisle Guides */}
          <text x="310" y="525" fill="#475569" fontSize="9" fontWeight="700" letterSpacing="0.2em" textAnchor="middle" fontFamily="monospace">
            LEFT AISLE
          </text>
          <text x="590" y="525" fill="#475569" fontSize="9" fontWeight="700" letterSpacing="0.2em" textAnchor="middle" fontFamily="monospace">
            RIGHT AISLE
          </text>

          {/* Individual Luxury Seats with Authentic Geometry */}
          {seats.map((seat) => {
            const isMine = seat.isMine || (seat.heldBy && seat.heldBy === myUserId);
            const isHeldByOther = seat.status === "held" && !isMine;
            const isBooked = seat.status === "booked";
            const isAvailable = seat.status === "available";

            const viewerCount = presenceMap[seat.id] || 0;
            const tierInfo = TIERS[seat.tier] || TIERS.STANDARD;

            // Determine styling
            let backColor = "#151923";
            let cushionColor = "#1C2230";
            let strokeColor = "rgba(255, 255, 255, 0.15)";
            let filter = "none";
            let cursor = "cursor-pointer";

            if (isBooked) {
              backColor = "#0B0D13";
              cushionColor = "#11141B";
              strokeColor = "rgba(239, 68, 68, 0.4)"; // muted red
              cursor = "cursor-not-allowed opacity-40";
            } else if (isMine) {
              backColor = "#0284C7"; // sky-600
              cushionColor = "#0EA5E9"; // sky-500
              strokeColor = "#BAE6FD";
              filter = "url(#glow-blue)";
            } else if (isHeldByOther) {
              backColor = "#854D0E"; // amber-800
              cushionColor = "#D97706"; // amber-600
              strokeColor = "#FDE68A";
              filter = "url(#glow-gold)";
              cursor = "cursor-not-allowed";
            } else if (isAvailable) {
              if (showHeatmap) {
                backColor = `${tierInfo.color}25`;
                cushionColor = `${tierInfo.color}45`;
                strokeColor = tierInfo.color;
              } else {
                backColor = "rgba(16, 185, 129, 0.15)";
                cushionColor = "rgba(16, 185, 129, 0.35)";
                strokeColor = "#10B981";
              }
            }

            const rot = seat.rotation || 0;

            return (
              <g
                key={seat.id}
                transform={`translate(${seat.x}, ${seat.y}) rotate(${rot})`}
                className={`transition-all duration-200 ${cursor} group`}
                onClick={() => onSeatClick(seat)}
                onMouseEnter={() => handleMouseEnter(seat)}
                onMouseLeave={() => handleMouseLeave(seat)}
              >
                {/* Armrests (Left & Right) */}
                <rect
                  x="-18"
                  y="-4"
                  width="4"
                  height="26"
                  rx="2"
                  fill="#2A3346"
                  stroke={strokeColor}
                  strokeWidth="0.8"
                />
                <rect
                  x="14"
                  y="-4"
                  width="4"
                  height="26"
                  rx="2"
                  fill="#2A3346"
                  stroke={strokeColor}
                  strokeWidth="0.8"
                />

                {/* Curved Upper Backrest */}
                <path
                  d="M -14,-10 C -8,-14 8,-14 14,-10 L 14,-2 L -14,-2 Z"
                  fill={backColor}
                  stroke={strokeColor}
                  strokeWidth="1.2"
                  filter={filter}
                  className="transition-all duration-200 group-hover:brightness-125"
                />

                {/* Contoured Cushion Base */}
                <rect
                  x="-14"
                  y="0"
                  width="28"
                  height="22"
                  rx="5"
                  fill={cushionColor}
                  stroke={strokeColor}
                  strokeWidth={isMine ? "2" : "1.2"}
                  filter={filter}
                  className="transition-all duration-200 group-hover:brightness-125"
                />

                {/* Seat Content: Number / Lock / You */}
                {isBooked ? (
                  <circle cx="0" cy="11" r="3" fill="#EF4444" opacity="0.6" />
                ) : isMine ? (
                  <text
                    x="0"
                    y="15"
                    fill="#FFFFFF"
                    fontSize="9"
                    fontWeight="900"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    YOU
                  </text>
                ) : isHeldByOther ? (
                  <g transform="translate(-4, 7)">
                    <rect x="1" y="3" width="6" height="5" rx="1" fill="#FDE68A" />
                    <path d="M 2.5,3 L 2.5,1.5 C 2.5,0.5 5.5,0.5 5.5,1.5 L 5.5,3" fill="none" stroke="#FDE68A" strokeWidth="1" />
                  </g>
                ) : (
                  <text
                    x="0"
                    y="14"
                    fill={showHeatmap ? "#FFFFFF" : "#CBD5E1"}
                    fontSize="9"
                    fontWeight="700"
                    textAnchor="middle"
                    fontFamily="sans-serif"
                    className="group-hover:fill-white"
                  >
                    {seat.col}
                  </text>
                )}

                {/* LIVE PRESENCE BADGE (Ephemeral Viewer Count) */}
                {viewerCount > 0 && (
                  <g transform="translate(0, -18)" className="animate-bounce">
                    <rect
                      x="-14"
                      y="-8"
                      width="28"
                      height="16"
                      rx="8"
                      fill="#7C3AED"
                      stroke="#C4B5FD"
                      strokeWidth="1.2"
                    />
                    <text
                      x="0"
                      y="3.5"
                      fill="#FFFFFF"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      👀 {viewerCount}
                    </text>
                  </g>
                )}

                {/* ACTIVE HOLD COUNTDOWN BADGE ON USER'S SEAT */}
                {isMine && seat.ttlSeconds > 0 && (
                  <g transform="translate(0, 34)">
                    <rect
                      x="-19"
                      y="-8"
                      width="38"
                      height="16"
                      rx="8"
                      fill="#0284C7"
                      stroke="#BAE6FD"
                      strokeWidth="1.2"
                    />
                    <text
                      x="0"
                      y="3.5"
                      fill="#FFFFFF"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      fontFamily="monospace"
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

        {/* Footer info strip */}
        <div className="mt-4 pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-slate-300 font-medium">Real-Time Invariant: Redis Single-Threaded Atomic NX</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-500">
            <span>72 Luxury Recliners</span>
            <span>•</span>
            <span>Room: event:venue-grand-hall</span>
            <span>•</span>
            <span>ACID Postgres Ledger</span>
          </div>
        </div>
      </div>
    </div>
  );
}
