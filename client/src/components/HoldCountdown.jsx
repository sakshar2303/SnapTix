"use client";

import React, { useEffect, useState } from "react";
import { Clock, ShieldCheck, Check, X, AlertTriangle, Sparkles, Ticket } from "lucide-react";
import { TIERS } from "../lib/constants";

export default function HoldCountdown({
  heldSeat,
  onConfirmBooking,
  onReleaseSeat,
  isSubmitting,
}) {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (!heldSeat || !heldSeat.expiresAt) return;

    const calculateRemaining = () => {
      const remaining = Math.max(
        0,
        Math.round((heldSeat.expiresAt - Date.now()) / 1000)
      );
      setSecondsLeft(remaining);
    };

    calculateRemaining();
    const interval = setInterval(calculateRemaining, 1000);
    return () => clearInterval(interval);
  }, [heldSeat]);

  if (!heldSeat) return null;

  const tierInfo = TIERS[heldSeat.tier] || TIERS.STANDARD;
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isUrgent = secondsLeft <= 60;

  // Circular gauge calculations (radius 22, circumference 138.2)
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (Math.min(300, secondsLeft) / 300) * circumference;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 animate-in slide-in-from-bottom-6 duration-300">
      <div
        className={`relative rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-2xl border transition-all ${
          isUrgent
            ? "bg-[#14080D]/95 border-rose-500/70 shadow-rose-950/50 ring-1 ring-rose-500/30"
            : "bg-[#0A0D14]/95 border-sky-500/50 shadow-[0_20px_50px_rgba(0,0,0,0.8)] ring-1 ring-sky-500/20"
        }`}
      >
        {/* Subtle decorative ticket notch cutouts */}
        <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#07080B] border border-white/10 hidden sm:block"></div>
        <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#07080B] border border-white/10 hidden sm:block"></div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
          {/* Seat & Tier Details */}
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div
              className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-mono shadow-inner shrink-0"
              style={{
                backgroundColor: `${tierInfo.color}18`,
                border: `1.5px solid ${tierInfo.color}`,
              }}
            >
              <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: tierInfo.color }}>
                SEAT
              </span>
              <span className="text-xl font-black text-white leading-none">
                {heldSeat.label}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base">
                  {tierInfo.name}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/[0.06] text-slate-200 border border-white/[0.08] font-mono font-bold">
                  ${heldSeat.price}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Exclusive Hold Granted • Zero Collision Risk</span>
              </p>
            </div>
          </div>

          {/* Analog Circular Countdown Clock & Timer */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="relative flex items-center justify-center w-12 h-12 shrink-0">
              <svg className="w-12 h-12 transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r={radius}
                  stroke="#1E293B"
                  strokeWidth="3.5"
                  fill="transparent"
                />
                <circle
                  cx="24"
                  cy="24"
                  r={radius}
                  stroke={isUrgent ? "#F43F5E" : "#38BDF8"}
                  strokeWidth="3.5"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000"
                />
              </svg>
              <Clock className={`absolute w-4 h-4 ${isUrgent ? "text-rose-400 animate-pulse" : "text-sky-400"}`} />
            </div>

            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                Hold Auto-Expires In
              </div>
              <div
                className={`font-mono text-xl sm:text-2xl font-black tracking-tight leading-none ${
                  isUrgent ? "text-rose-400 animate-pulse" : "text-sky-300"
                }`}
              >
                {minutes}:{seconds.toString().padStart(2, "0")}
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls & Fee Breakdown */}
        <div className="mt-4 pt-3.5 border-t border-white/[0.08] flex items-center justify-between gap-3">
          <button
            onClick={() => onReleaseSeat(heldSeat)}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-slate-400 hover:text-white transition flex items-center gap-1.5"
          >
            <X className="w-3.5 h-3.5" />
            <span>Release</span>
          </button>

          <button
            onClick={() => onConfirmBooking(heldSeat)}
            disabled={isSubmitting || secondsLeft <= 0}
            className="flex-1 py-2.5 px-6 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-500 hover:from-sky-400 hover:via-indigo-400 hover:to-emerald-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-sky-500/25 transition transform active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Committing to Postgres Ledger...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Finalize Ticket (${heldSeat.price} • $0 Fees)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
