"use client";

import React, { useState } from "react";
import { Sparkles, Radio, Zap, User, RotateCcw, ShieldCheck, Activity } from "lucide-react";
import { getUserColor } from "../lib/socket";

export default function Header({
  userId,
  isConnected,
  velocity = 0,
  onReset,
  onOpenSystemInfo,
}) {
  const [resetting, setResetting] = useState(false);
  const userColor = userId ? getUserColor(userId) : "#6366f1";

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
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                SnapTix
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Real-Time
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Zero-Double-Booking Concurrent Engine
            </p>
          </div>
        </div>

        {/* Live Velocity & Status Tickers */}
        <div className="hidden md:flex items-center gap-4 text-xs">
          {/* Velocity Ticker */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300">
            <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Velocity:</span>
            <span className="font-bold text-amber-400">{velocity} booked</span>
            <span className="text-slate-500">/ 2 min</span>
          </div>

          {/* WebSocket Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800">
            <span className="relative flex h-2 w-2">
              {isConnected ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              )}
            </span>
            <span className={isConnected ? "text-emerald-400 font-medium" : "text-rose-400"}>
              {isConnected ? "Live Socket" : "Reconnecting..."}
            </span>
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Concurrency Architecture Explainer Button */}
          <button
            onClick={onOpenSystemInfo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition"
            title="View Concurrency Control Strategy & Proof"
          >
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">System Proof</span>
          </button>

          {/* Reset Demo State Button */}
          <button
            onClick={handleResetClick}
            disabled={resetting}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-400 hover:text-rose-400 transition"
            title="Reset seat holds for demo"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${resetting ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Reset Holds</span>
          </button>

          {/* Current Anonymous User Identity */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-inner"
              style={{ backgroundColor: `${userColor}20`, color: userColor, border: `1px solid ${userColor}50` }}
            >
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-[11px] leading-tight text-slate-400">Session ID</div>
              <div className="text-xs font-bold font-mono tracking-tight text-white">{userId}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
