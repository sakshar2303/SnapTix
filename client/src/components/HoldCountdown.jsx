"use client";

import React, { useEffect, useState } from "react";
import { Clock, ShieldCheck, Check, X, AlertTriangle } from "lucide-react";
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
  const percentLeft = Math.min(100, Math.max(0, (secondsLeft / 300) * 100));

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4 animate-in slide-in-from-bottom-8 duration-300">
      <div
        className={`p-4 sm:p-5 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all ${
          isUrgent
            ? "bg-rose-950/90 border-rose-500/80 shadow-rose-900/40 animate-pulse"
            : "bg-slate-900/95 border-sky-500/60 shadow-sky-950/50"
        }`}
      >
        {/* Top bar: Seat details & remaining time */}
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-sky-500/20 border-2 border-sky-400 flex flex-col items-center justify-center font-mono">
              <span className="text-[10px] uppercase font-bold text-sky-300">SEAT</span>
              <span className="text-lg font-black text-white leading-none">{heldSeat.label}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base">{tierInfo.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                  ${heldSeat.price}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Exclusive hold active • Zero risk of collision
              </p>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="text-right">
            <div className="flex items-center gap-1.5 justify-end font-mono">
              {isUrgent ? (
                <AlertTriangle className="w-4 h-4 text-rose-400 animate-bounce" />
              ) : (
                <Clock className="w-4 h-4 text-sky-400" />
              )}
              <span
                className={`text-xl sm:text-2xl font-black ${
                  isUrgent ? "text-rose-400" : "text-sky-300"
                }`}
              >
                {minutes}:{seconds.toString().padStart(2, "0")}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              Auto-Release Timer
            </div>
          </div>
        </div>

        {/* Linear progress bar */}
        <div className="w-full bg-slate-800 rounded-full h-1.5 mb-4 overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${
              isUrgent ? "bg-rose-500" : "bg-gradient-to-r from-sky-500 to-indigo-500"
            }`}
            style={{ width: `${percentLeft}%` }}
          ></div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onReleaseSeat(heldSeat)}
            disabled={isSubmitting}
            className="flex-1 py-2.5 px-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition flex items-center justify-center gap-1.5"
          >
            <X className="w-3.5 h-3.5 text-slate-400" />
            <span>Release Seat</span>
          </button>

          <button
            onClick={() => onConfirmBooking(heldSeat)}
            disabled={isSubmitting || secondsLeft <= 0}
            className="flex-2 py-2.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-500 hover:from-indigo-500 hover:via-sky-500 hover:to-emerald-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 transition transform active:scale-95 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Writing to Ledger...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Confirm & Finalize (${heldSeat.price})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
