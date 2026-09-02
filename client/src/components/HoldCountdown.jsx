"use client";

import React, { useEffect, useState } from "react";
import { Clock, X, Tag, ShoppingCart, Zap, Ticket } from "lucide-react";
import { TIERS } from "../lib/constants";

const CONVENIENCE_FEE = 23;

export default function HoldCountdown({
  heldSeat,
  heldSeats = [],
  selectedSeats = [],
  venueInfo,
  selectedShowtime,
  appliedPromo,
  onConfirmBooking,
  onHoldSelectedSeats,
  onClearSelection,
  onReleaseSeat,
  isSubmitting,
}) {
  const [secondsLeft, setSecondsLeft] = useState(0);

  // Timer uses heldSeat (server-provided, has expiresAt) not heldSeats[0] (local cart, no expiresAt)
  const primaryHeld = heldSeat;

  useEffect(() => {
    if (!primaryHeld || !primaryHeld.expiresAt) return;

    const calculateRemaining = () => {
      const remaining = Math.max(
        0,
        Math.round((primaryHeld.expiresAt - Date.now()) / 1000)
      );
      setSecondsLeft(remaining);
    };

    calculateRemaining();
    const interval = setInterval(calculateRemaining, 1000);
    return () => clearInterval(interval);
  }, [primaryHeld]);

  // Nothing to show
  const hasCart = selectedSeats.length > 0;
  const hasHeld = heldSeats.length > 0 || !!heldSeat;
  if (!hasCart && !hasHeld) return null;

  const tierInfo = TIERS[heldSeat?.tier] || TIERS.PREFERRED;
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isUrgent = secondsLeft <= 60 && hasHeld;

  // Price calculation for CART mode (before holding)
  const cartTotal = selectedSeats.reduce((sum, s) => sum + (s.price || 0), 0);

  // Price calculation for HELD mode
  const activeSeats = heldSeats.length > 0 ? heldSeats : (heldSeat ? [heldSeat] : []);
  const baseTotal = activeSeats.reduce((sum, s) => sum + (s.price || 0), 0);
  const discountAmount = appliedPromo ? Math.min(baseTotal - 10, appliedPromo.discountAmount || 0) : 0;
  const finalPrice = Math.max(10, baseTotal - discountAmount) + CONVENIENCE_FEE;

  // ─── CART MODE (seats selected but not yet held) ───
  if (hasCart && !hasHeld) {
    const cartWithFee = cartTotal + CONVENIENCE_FEE;
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-indigo-500 shadow-[0_-10px_30px_rgba(0,0,0,0.12)] animate-in slide-in-from-bottom duration-200">
        {/* Cart Header Bar */}
        <div className="py-1 px-4 text-center text-xs font-semibold flex items-center justify-center gap-1.5 bg-indigo-50 text-indigo-800 border-b border-indigo-200">
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>
            {selectedSeats.length} seat{selectedSeats.length > 1 ? "s" : ""} selected — click more to add or proceed to pay
          </span>
        </div>

        {/* Cart Dock */}
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Selected Seats Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {selectedSeats.map((seat) => (
              <div
                key={seat.id}
                className="flex items-center gap-1.5 pl-2 pr-1 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800"
              >
                <Ticket className="w-3 h-3" />
                <span className="text-xs font-bold font-mono">{seat.label}</span>
                <span className="text-[10px] text-indigo-600 font-medium">₹{seat.price}</span>
              </div>
            ))}

            {/* Subtotal */}
            <div className="text-sm font-black text-[#222433] pl-2">
              = ₹{cartTotal} <span className="text-xs text-slate-500 font-medium">(+₹{CONVENIENCE_FEE} fee)</span>
              <span className="ml-2 text-base font-black text-indigo-700">₹{cartWithFee}</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end shrink-0">
            <button
              onClick={onClearSelection}
              className="px-3 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> Clear
            </button>

            <button
              onClick={onHoldSelectedSeats}
              className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              Lock {selectedSeats.length} Seat{selectedSeats.length > 1 ? "s" : ""} & Pay
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── HELD MODE (seats are atomically held via Redis) ───
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-[#F84464] shadow-[0_-10px_30px_rgba(0,0,0,0.12)] animate-in slide-in-from-bottom duration-200">
      {/* Urgency countdown banner */}
      <div
        className={`py-1 px-4 text-center text-xs font-semibold flex items-center justify-center gap-1.5 ${
          isUrgent
            ? "bg-rose-600 text-white animate-pulse"
            : "bg-amber-50 text-amber-900 border-b border-amber-200"
        }`}
      >
        <Clock className="w-3.5 h-3.5" />
        <span>
          {activeSeats.length > 1
            ? `${activeSeats.length} seats reserved for you.`
            : `Seat ${primaryHeld?.label} reserved for you.`}{" "}
          Auto-releases in{" "}
          <strong className="font-mono">
            {minutes}:{seconds.toString().padStart(2, "0")}
          </strong>
        </span>
      </div>

      {/* Checkout Dock */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Held Seat Summary */}
        <div className="flex items-start gap-3 w-full sm:w-auto">
          {/* Seat chips for all held seats */}
          <div className="flex flex-wrap gap-1.5">
            {activeSeats.map((seat) => (
              <div
                key={seat.id}
                className="flex flex-col items-center justify-center w-11 h-11 rounded-lg bg-[#1EA83C] text-white font-black shadow-xs"
              >
                <span className="text-[8px] uppercase font-normal opacity-80">SEAT</span>
                <span className="text-sm leading-none font-mono">{seat.label || seat.id}</span>
              </div>
            ))}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-[#222433] text-base">
                {activeSeats[0]?.section || tierInfo.name}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                ({activeSeats.length} Ticket{activeSeats.length > 1 ? "s" : ""})
              </span>
              {appliedPromo && (
                <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-0.5">
                  <Tag className="w-2.5 h-2.5" /> {appliedPromo.code} applied (-₹{discountAmount})
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
              <div className="flex items-center gap-1.5">
                {appliedPromo && (
                  <span className="line-through text-slate-400">₹{baseTotal}</span>
                )}
                <span className="font-black text-[#222433] text-sm">
                  ₹{finalPrice}.00 <span className="text-[10px] text-slate-400 font-normal">incl. fee</span>
                </span>
              </div>
              <span>• {venueInfo?.title || "Dune: Part Two"} ({selectedShowtime || "07:30 PM"})</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={() => onReleaseSeat(activeSeats[0])}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>

          <button
            onClick={() => onConfirmBooking({ ...activeSeats[0], price: finalPrice })}
            disabled={isSubmitting || (secondsLeft <= 0 && heldSeats.length === 0 && !heldSeat)}
            className="flex-1 sm:flex-none px-8 py-2.5 rounded-lg bg-[#F84464] hover:bg-[#E03352] text-white font-bold text-sm shadow-md transition transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                <span>Securing...</span>
              </>
            ) : (
              <span>Pay ₹{finalPrice}.00</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
