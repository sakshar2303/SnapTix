"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  RotateCcw,
  User,
  Zap,
  Activity,
  Cpu,
  Flame,
  Radio,
  ExternalLink,
} from "lucide-react";
import { getUserColor } from "../lib/socket";

export default function Header({
  userId,
  isConnected,
  velocity = 0,
  latency = 14,
  onReset,
  onOpenSystemInfo,
  onSimulateRace,
  isSimulating = false,
}) {
  const [resetting, setResetting] = useState(false);
  const userColor = userId ? getUserColor(userId) : "#38BDF8";

  const handleResetClick = async () => {
    if (confirm("Reset all active seat holds to test concurrency from scratch?")) {
      setResetting(true);
      try {
        await onReset();
      } finally {
        setTimeout(() => setResetting(false), 500);
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#07090E]/90 backdrop-blur-xl">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand & Venue Label */}
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-sky-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-[#0B0E14] rounded-[11px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-sky-400" />
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border-2 border-[#0B0E14]"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-tight text-white font-mono">
                SnapTix
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-md bg-white/[0.06] text-slate-300 border border-white/[0.08]">
                Distributed Core
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block tracking-wide">
              Kuroshio Concert Hall • Neo-Tokyo
            </p>
          </div>
        </div>

        {/* Center Telemetry & Concurrency Status */}
        <div className="hidden lg:flex items-center gap-3 text-xs">
          {/* WebSocket Latency Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-slate-300 font-mono">
            <Radio className={`w-3.5 h-3.5 ${isConnected ? "text-emerald-400 animate-pulse" : "text-rose-400"}`} />
            <span className="text-slate-400">Cluster:</span>
            <span className={isConnected ? "text-emerald-300 font-bold" : "text-rose-400"}>
              {isConnected ? `${latency}ms WebSocket` : "Disconnected"}
            </span>
          </div>

          {/* Atomic Redis Lock Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-slate-300 font-mono">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Lock:</span>
            <span className="text-amber-300 font-bold">SET NX EX 300</span>
          </div>

          {/* Velocity Ticker */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-slate-300 font-mono">
            <Flame className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
            <span className="text-slate-400">Velocity:</span>
            <span className="text-white font-bold">{velocity} sold</span>
            <span className="text-slate-500 text-[10px]">/ 2m</span>
          </div>
        </div>

        {/* Action Controls & Session Identity */}
        <div className="flex items-center gap-2.5">
          {/* 10-Contender Instant Collision Test Button */}
          <button
            onClick={onSimulateRace}
            disabled={isSimulating}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/15 to-rose-500/15 hover:from-amber-500/25 hover:to-rose-500/25 border border-amber-500/40 text-amber-300 text-xs font-semibold shadow-sm transition active:scale-95"
            title="Simulate 10 simultaneous concurrent hold requests to test zero double-booking live"
          >
            <Zap className={`w-3.5 h-3.5 ${isSimulating ? "animate-spin text-amber-400" : ""}`} />
            <span>{isSimulating ? "Racing..." : "Test 10-User Collision"}</span>
          </button>

          {/* Concurrency Architecture Proof Button */}
          <button
            onClick={onOpenSystemInfo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-slate-200 hover:text-white transition"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden md:inline">Architecture Proof</span>
          </button>

          {/* Reset Demo State Button */}
          <button
            onClick={handleResetClick}
            disabled={resetting}
            className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-400 hover:text-rose-400 transition"
            title="Reset active holds"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${resetting ? "animate-spin" : ""}`} />
          </button>

          {/* Current User Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-white/[0.08]">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold shadow-inner"
              style={{
                backgroundColor: `${userColor}18`,
                color: userColor,
                border: `1px solid ${userColor}40`,
              }}
            >
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="text-left hidden xl:block">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold leading-tight">
                Active Session
              </div>
              <div className="text-xs font-bold font-mono text-white tracking-tight">
                {userId}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
