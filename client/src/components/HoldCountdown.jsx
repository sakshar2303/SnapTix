"use client";

import React, { useEffect, useState } from "react";
import { Clock, Check, X } from "lucide-react";
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

  const tierInfo = TIERS[heldSeat.tier] || TIERS.PREFERRED;
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isUrgent = secondsLeft <= 60;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-[#F84464] shadow-[0_-10px_30px_rgba(0,0,0,0.12)] animate-in slide-in-from-bottom duration-200">
      {/* Urgency countdown warning banner */}
      <div
        className={`py-1 px-4 text-center text-xs font-semibold flex items-center justify-center gap-1.5 ${
          isUrgent ? "bg-rose-600 text-white animate-pulse" : "bg-amber-50 text-amber-900 border-b border-amber-200"
        }`}
      >
        <Clock className="w-3.5 h-3.5" />
        <span>
          Seat {heldSeat.label} is reserved exclusively for you. Auto-releases in{" "}
          <strong className="font-mono">{minutes}:{seconds.toString().padStart(2, "0")}</strong>
        </span>
      </div>

      {/* Main Checkout Dock */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Selected Seat Details */}
        <div className="flex items-center gap-3.5 w-full sm:w-auto">
          <div className="w-11 h-11 rounded-lg bg-[#1EA83C] text-white flex flex-col items-center justify-center font-black shadow-xs">
            <span className="text-[9px] uppercase font-normal opacity-90">SEAT</span>
            <span className="text-base leading-none">{heldSeat.label}</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#222433] text-base">
                {heldSeat.section || tierInfo.name}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                (1 Ticket)
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-black text-[#222433] text-sm">
                ₹{heldSeat.price}.00
              </span>
              <span>• Audi 4 (IMAX 2D)</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={() => onReleaseSeat(heldSeat)}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>

          <button
            onClick={() => onConfirmBooking(heldSeat)}
            disabled={isSubmitting || secondsLeft <= 0}
            className="flex-1 sm:flex-none px-8 py-2.5 rounded-lg bg-[#F84464] hover:bg-[#E03352] text-white font-bold text-sm shadow-md transition transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                <span>Securing Ticket...</span>
              </>
            ) : (
              <>
                <span>Pay ₹{heldSeat.price}.00</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
