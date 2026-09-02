"use client";

import React, { useState, useRef } from "react";
import { Lock, Clock, Eye, Sliders, Radio, Cpu, Terminal } from "lucide-react";
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

  return (
    <div className="relative w-full max-w-5xl mx-auto select-none font-mono">
      {/* Precision Hardware LCD Telemetry HUD */}
      <div className="mb-3 h-13 w-full flex items-center justify-between px-4 py-2 rounded-xl bg-[#101217] border border-[#232734] shadow-inner text-xs">
        {hoveredSeat ? (
          <div className="w-full flex items-center justify-between gap-4 animate-in fade-in duration-100">
            <div className="flex items-center gap-3">
              <div
                className="w-7 h-7 rounded bg-[#181B24] border border-[#343A4C] flex items-center justify-center font-bold text-xs shadow-inner"
                style={{ color: TIERS[hoveredSeat.tier]?.color || "#FF9500" }}
              >
                {hoveredSeat.id}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-xs">
                    {hoveredSeat.section || "SECTOR A"}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    // ${hoveredSeat.price}.00 USD
                  </span>
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-black/40 border border-white/10"
                    style={{ color: TIERS[hoveredSeat.tier]?.color }}
                  >
                    {TIERS[hoveredSeat.tier]?.badge}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {hoveredSeat.sightline || "0.1ms Phase Coherence • Direct Line"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[10px]">
              {presenceMap[hoveredSeat.id] > 0 && (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-purple-950/40 border border-purple-500/40 text-purple-300">
                  <Eye className="w-3 h-3" />
                  <span>{presenceMap[hoveredSeat.id]} MONITORS</span>
                </div>
              )}
              <div className="text-slate-400">
                STATE:{" "}
                <span
                  className={`font-bold ${
                    hoveredSeat.status === "booked"
                      ? "text-rose-400"
                      : hoveredSeat.status === "held"
                      ? "text-amber-400"
                      : "text-emerald-400"
                  }`}
                >
                  [{hoveredSeat.status?.toUpperCase()}]
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-[#FF9500]" />
              <span>HOVER MODULAR POD TO INSPECT PHASE DELAY & OCCUPANCY</span>
            </div>
            <div className="hidden sm:flex items-center gap-3 text-slate-500 text-[10px]">
              <span>[RADIAL POLAR ARRAY]</span>
              <span>•</span>
              <span>[POLAR ORIGIN: 0x450,-120]</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Hardware Chassis Faceplate */}
      <div className="relative w-full rounded-2xl bg-[#101217] border border-[#252936] p-6 sm:p-7 shadow-2xl overflow-hidden">
        {/* Hardware Corner Hex Rivet Screws */}
        <div className="te-screw absolute top-3 left-3"></div>
        <div className="te-screw absolute top-3 right-3"></div>
        <div className="te-screw absolute bottom-3 left-3"></div>
        <div className="te-screw absolute bottom-3 right-3"></div>

        <svg
          viewBox="0 0 900 530"
          className="w-full h-auto drop-shadow-xl"
          style={{ maxHeight: "660px" }}
        >
          {/* Polar Radar Range Arcs */}
          <path
            d="M 140,240 A 480,480 0 0,0 760,240"
            fill="none"
            stroke="#1D212B"
            strokeDasharray="2 4"
            strokeWidth="1.2"
          />
          <path
            d="M 80,370 A 610,610 0 0,0 820,370"
            fill="none"
            stroke="#1D212B"
            strokeDasharray="2 4"
            strokeWidth="1.2"
          />

          {/* Sector Boundary Label Coordinates */}
          <text x="80" y="195" fill="#FF9500" fontSize="9" fontWeight="800" opacity="0.8" fontFamily="monospace">
            [SECTOR A-B // VIP FIELD]
          </text>
          <text x="50" y="325" fill="#E2E8F0" fontSize="9" fontWeight="800" opacity="0.6" fontFamily="monospace">
            [SECTOR C-E // CONSOLE ROW]
          </text>
          <text x="35" y="460" fill="#8E95A5" fontSize="9" fontWeight="800" opacity="0.6" fontFamily="monospace">
            [SECTOR F-H // PERIMETER]
          </text>

          {/* Center Angle Crosshair Marks */}
          <text x="450" y="515" fill="#3E4456" fontSize="8" fontWeight="700" textAnchor="middle" fontFamily="monospace">
            + 00.00° CENTER AXIS
          </text>
          <text x="300" y="515" fill="#3E4456" fontSize="8" fontWeight="700" textAnchor="middle" fontFamily="monospace">
            - 18.20° L-AISLE
          </text>
          <text x="600" y="515" fill="#3E4456" fontSize="8" fontWeight="700" textAnchor="middle" fontFamily="monospace">
            + 18.20° R-AISLE
          </text>

          {/* Render Modular Hardware Pods */}
          {seats.map((seat) => {
            const isMine = seat.isMine || (seat.heldBy && seat.heldBy === myUserId);
            const isHeldByOther = seat.status === "held" && !isMine;
            const isBooked = seat.status === "booked";
            const isAvailable = seat.status === "available";

            const viewerCount = presenceMap[seat.id] || 0;
            const tierInfo = TIERS[seat.tier] || TIERS.STANDARD;

            // Teenage Engineering Modular Capsule Styling
            let podBodyColor = "#161922";
            let podBorderColor = "#2C313F";
            let diodeColor = tierInfo.color;
            let cursor = "cursor-pointer";

            if (isBooked) {
              podBodyColor = "#0A0B0E";
              podBorderColor = "#1B1D24";
              diodeColor = "#333742";
              cursor = "cursor-not-allowed opacity-30";
            } else if (isMine) {
              podBodyColor = "#0C2333";
              podBorderColor = "#38BDF8";
              diodeColor = "#38BDF8";
            } else if (isHeldByOther) {
              podBodyColor = "#281708";
              podBorderColor = "#FF9500";
              diodeColor = "#FF9500";
              cursor = "cursor-not-allowed";
            } else if (isAvailable) {
              if (showHeatmap) {
                podBorderColor = tierInfo.color;
                podBodyColor = "#181B24";
              } else {
                podBorderColor = "#10B981";
                podBodyColor = "#161922";
                diodeColor = "#10B981";
              }
            }

            const rot = seat.rotation || 0;

            return (
              <g
                key={seat.id}
                transform={`translate(${seat.x}, ${seat.y}) rotate(${rot})`}
                className={`transition-all duration-150 ${cursor} group`}
                onClick={() => onSeatClick(seat)}
                onMouseEnter={() => handleMouseEnter(seat)}
                onMouseLeave={() => handleMouseLeave(seat)}
              >
                {/* CNC Bezel Frame */}
                <rect
                  x="-15"
                  y="-10"
                  width="30"
                  height="30"
                  rx="4"
                  fill={podBodyColor}
                  stroke={podBorderColor}
                  strokeWidth={isMine ? "2" : "1.2"}
                  className="transition-all duration-150 group-hover:brightness-125"
                />

                {/* Tactile Push Pad Inset */}
                <rect
                  x="-11"
                  y="-6"
                  width="22"
                  height="16"
                  rx="2"
                  fill="#0B0C10"
                  stroke="#1E222D"
                  strokeWidth="0.8"
                />

                {/* Status Indicator Diode (LED) */}
                <circle
                  cx="0"
                  cy="14"
                  r="2"
                  fill={diodeColor}
                  opacity={isBooked ? 0.3 : 1}
                />

                {/* Engraved Monospace Pod Label */}
                {isBooked ? (
                  <text
                    x="0"
                    y="5"
                    fill="#475569"
                    fontSize="7"
                    fontWeight="800"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    BKD
                  </text>
                ) : isMine ? (
                  <text
                    x="0"
                    y="5"
                    fill="#38BDF8"
                    fontSize="8"
                    fontWeight="900"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    YOU
                  </text>
                ) : isHeldByOther ? (
                  <text
                    x="0"
                    y="5"
                    fill="#FF9500"
                    fontSize="7"
                    fontWeight="800"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    LCK
                  </text>
                ) : (
                  <text
                    x="0"
                    y="5"
                    fill="#F1F5F9"
                    fontSize="8"
                    fontWeight="700"
                    textAnchor="middle"
                    fontFamily="monospace"
                    className="group-hover:fill-white"
                  >
                    {seat.label}
                  </text>
                )}

                {/* LIVE PRESENCE BADGE (Ephemeral Viewer Count) */}
                {viewerCount > 0 && (
                  <g transform="translate(0, -18)">
                    <rect
                      x="-13"
                      y="-7"
                      width="26"
                      height="14"
                      rx="3"
                      fill="#7C3AED"
                      stroke="#C4B5FD"
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="3"
                      fill="#FFFFFF"
                      fontSize="8"
                      fontWeight="bold"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      👀 {viewerCount}
                    </text>
                  </g>
                )}

                {/* ACTIVE HOLD TIME TAG ON OPERATOR POD */}
                {isMine && seat.ttlSeconds > 0 && (
                  <g transform="translate(0, 28)">
                    <rect
                      x="-18"
                      y="-6"
                      width="36"
                      height="13"
                      rx="2"
                      fill="#0C2333"
                      stroke="#38BDF8"
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="3.5"
                      fill="#38BDF8"
                      fontSize="8"
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

        {/* Bottom Hardware Spec Strip */}
        <div className="mt-4 pt-3 border-t border-[#1F232F] flex flex-wrap items-center justify-between text-[10px] text-slate-500 font-mono gap-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF9500] animate-pulse"></span>
            <span className="text-slate-400 font-bold">LOCK_ENGINE: REDIS_SET_NX_EX_300</span>
          </div>
          <div>
            <span>POLAR ARRAY: 72 PODS</span>
            <span className="mx-2">•</span>
            <span>CHAMBER: 01-A</span>
            <span className="mx-2">•</span>
            <span>STORE: NEON_POSTGRES</span>
          </div>
        </div>
      </div>
    </div>
  );
}
