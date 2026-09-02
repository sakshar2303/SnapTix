"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  RotateCcw,
  User,
  Zap,
  Activity,
  Cpu,
  Radio,
  Sliders,
  Terminal,
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
  const userColor = userId ? getUserColor(userId) : "#FF9500";

  const handleResetClick = async () => {
    if (confirm("Execute hardware inventory reset on all active holds?")) {
      setResetting(true);
      try {
        await onReset();
      } finally {
        setTimeout(() => setResetting(false), 400);
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#242834] bg-[#101217]/95 backdrop-blur-md">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 font-mono">
        {/* Brand & Hardware Chassis Label */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#161922] border border-[#2D3241] shadow-inner">
            <span className="flex h-2 w-2 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isConnected ? "bg-amber-400" : "bg-rose-500"}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isConnected ? "bg-[#FF9500]" : "bg-rose-500"}`}></span>
            </span>
            <span className="font-extrabold text-sm tracking-tight text-white uppercase">
              OP-TIX
            </span>
            <span className="text-[10px] font-bold text-slate-500 tracking-wider">
              // REV.4
            </span>
          </div>

          <div className="hidden sm:block text-[11px] text-slate-400 font-medium">
            SYNTH LAB 01 <span className="text-slate-600">•</span> FIELD ACOUSTICS
          </div>
        </div>

        {/* Center Hardware LCD Display Telemetry */}
        <div className="hidden lg:flex items-center gap-2.5 text-xs">
          {/* WebSocket Ping Gauge */}
          <div className="flex items-center gap-2 px-3 py-1 rounded bg-[#090A0D] border border-[#202430] text-[#FF9500] font-mono text-[11px] shadow-inner">
            <Radio className="w-3 h-3 text-[#FF9500] animate-pulse" />
            <span className="text-slate-500">WS.PING:</span>
            <span className="font-bold">{isConnected ? `${String(latency).padStart(2, "0")}MS` : "OFFLINE"}</span>
          </div>

          {/* Redis Lock State Indicator */}
          <div className="flex items-center gap-2 px-3 py-1 rounded bg-[#090A0D] border border-[#202430] text-emerald-400 font-mono text-[11px] shadow-inner">
            <Zap className="w-3 h-3 text-emerald-400" />
            <span className="text-slate-500">LOCK:</span>
            <span className="font-bold tracking-tight">SET_NX_EX</span>
          </div>

          {/* Booking Velocity Rate */}
          <div className="flex items-center gap-2 px-3 py-1 rounded bg-[#090A0D] border border-[#202430] text-slate-200 font-mono text-[11px] shadow-inner">
            <Activity className="w-3 h-3 text-sky-400" />
            <span className="text-slate-500">RATE:</span>
            <span className="font-bold text-white">{String(velocity).padStart(2, "0")}_TX/2M</span>
          </div>
        </div>

        {/* Right Tactical Action Controls */}
        <div className="flex items-center gap-2">
          {/* Hardware Collision Simulator Trigger */}
          <button
            onClick={onSimulateRace}
            disabled={isSimulating}
            className="te-button flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#FF9500] hover:text-[#FFAE33] border border-[#FF9500]/30 transition"
            title="Fire 10 simultaneous concurrent requests to test zero double-booking"
          >
            <Zap className={`w-3.5 h-3.5 ${isSimulating ? "animate-spin text-white" : "text-[#FF9500]"}`} />
            <span className="text-[11px]">{isSimulating ? "FIRING_10X..." : "SIM_COLLISION"}</span>
          </button>

          {/* Architecture Proof Specs */}
          <button
            onClick={onOpenSystemInfo}
            className="te-button flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-slate-300 hover:text-white transition"
          >
            <Terminal className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">SPECS</span>
          </button>

          {/* Reset Chassis Button */}
          <button
            onClick={handleResetClick}
            disabled={resetting}
            className="te-button p-2 rounded-lg text-slate-400 hover:text-rose-400 transition"
            title="Reset active holds"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${resetting ? "animate-spin" : ""}`} />
          </button>

          {/* Operator Identity Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#242834]">
            <div className="px-2.5 py-1 rounded bg-[#161922] border border-[#2B303E] text-[11px] font-bold text-slate-300 flex items-center gap-1.5 shadow-inner">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF9500]"></span>
              <span className="text-slate-500">OP:</span>
              <span className="text-white font-mono">{userId}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
