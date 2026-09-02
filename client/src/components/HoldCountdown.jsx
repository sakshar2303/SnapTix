"use client";

import React, { useEffect, useState } from "react";
import { Clock, ShieldCheck, Check, X, AlertTriangle, Disc, Radio } from "lucide-react";
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

  // 12-segment hardware meter
  const totalSegments = 16;
  const activeSegments = Math.round((Math.min(300, secondsLeft) / 300) * totalSegments);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 animate-in slide-in-from-bottom-5 duration-200 font-mono">
      <div
        className={`te-chassis relative rounded-2xl p-4 sm:p-5 border transition-all ${
          isUrgent
            ? "border-rose-500 bg-[#160D10]"
            : "border-[#323847] bg-[#12141B]"
        }`}
      >
        {/* Hardware Corner Screws */}
        <div className="te-screw absolute top-2.5 left-2.5"></div>
        <div className="te-screw absolute top-2.5 right-2.5"></div>
        <div className="te-screw absolute bottom-2.5 left-2.5"></div>
        <div className="te-screw absolute bottom-2.5 right-2.5"></div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Hardware Module Identity */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-xl bg-[#090A0E] border border-[#252A38] flex flex-col items-center justify-center font-mono shadow-inner shrink-0">
              <span className="text-[9px] uppercase font-bold text-slate-500">
                POD
              </span>
              <span className="text-lg font-black text-[#FF9500] leading-none">
                {heldSeat.label}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-xs sm:text-sm">
                  {tierInfo.name}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#1C202B] border border-[#2B3142] text-slate-300 font-bold">
                  ${heldSeat.price}.00
                </span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>ATOMIC LOCK: SET_NX_EX_300</span>
              </div>
            </div>
          </div>

          {/* Tape / Audio Transport Countdown Readout */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* LED Segment Bar */}
            <div className="flex items-center gap-0.5 py-1 px-2 rounded bg-[#090A0E] border border-[#202532]">
              {Array.from({ length: totalSegments }).map((_, i) => (
                <span
                  key={i}
                  className={`w-1 h-3 rounded-[1px] transition-colors ${
                    i < activeSegments
                      ? isUrgent
                        ? "bg-rose-500 shadow-[0_0_4px_#f43f5e]"
                        : "bg-[#FF9500] shadow-[0_0_4px_#ff9500]"
                      : "bg-[#1C202B]"
                  }`}
                ></span>
              ))}
            </div>

            {/* LCD Digital Clock Readout */}
            <div className="px-3 py-1.5 rounded bg-[#090A0E] border border-[#252A38] text-right shadow-inner">
              <div className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">
                HOLD_TTL
              </div>
              <div
                className={`text-lg font-black tracking-widest font-mono leading-none ${
                  isUrgent ? "text-rose-400 animate-pulse" : "text-[#FF9500]"
                }`}
              >
                {minutes}:{seconds.toString().padStart(2, "0")}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-3.5 pt-3 border-t border-[#202430] flex items-center justify-between gap-2.5">
          <button
            onClick={() => onReleaseSeat(heldSeat)}
            disabled={isSubmitting}
            className="te-button px-3.5 py-2 rounded-lg text-[11px] font-bold text-slate-400 hover:text-white transition flex items-center gap-1.5"
          >
            <X className="w-3 h-3 text-slate-400" />
            <span>ABORT_HOLD</span>
          </button>

          <button
            onClick={() => onConfirmBooking(heldSeat)}
            disabled={isSubmitting || secondsLeft <= 0}
            className="te-button-accent flex-1 py-2 px-5 rounded-lg text-xs font-black transition flex items-center justify-center gap-2 uppercase tracking-wide"
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-black/40 border-t-black rounded-full animate-spin"></div>
                <span>COMMITTING_TO_LEDGER...</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>COMMIT_LEDGER (${heldSeat.price}.00 USD)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
