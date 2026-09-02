"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { CheckCircle, QrCode, Ticket, Calendar, MapPin, Sparkles, X } from "lucide-react";
import { TIERS } from "../lib/constants";

export default function BookingModal({ booking, onClose }) {
  useEffect(() => {
    if (booking) {
      // Fire festive confetti explosion
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#6366F1", "#38BDF8", "#10B981", "#F59E0B"],
        });
      } catch (err) {
        // Fallback gracefully if canvas-confetti is not loaded
      }
    }
  }, [booking]);

  if (!booking) return null;

  const tierInfo = TIERS[booking.tier] || TIERS.STANDARD;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl border border-indigo-500/30 p-6 sm:p-8 shadow-2xl shadow-indigo-500/20 text-white">
        {/* Close icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Success Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 mb-3 shadow-lg shadow-emerald-500/20">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight">
            Booking Confirmed!
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Durable record committed to Postgres ledger. Zero race risk.
          </p>
        </div>

        {/* Digital Ticket Card */}
        <div className="relative rounded-2xl bg-slate-800/70 border border-slate-700/80 p-5 overflow-hidden">
          {/* Decorative cutouts */}
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-950 border border-slate-700"></div>
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-950 border border-slate-700"></div>

          <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 mb-3">
            <div>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                Official Admission Pass
              </span>
              <h4 className="font-extrabold text-sm text-white">Cyber Symphony 2026</h4>
            </div>
            <Ticket className="w-5 h-5 text-indigo-400" />
          </div>

          <div className="grid grid-cols-2 gap-3 py-2 text-xs">
            <div>
              <span className="text-slate-400 text-[11px] block">Seat Number</span>
              <span className="font-mono font-black text-xl text-sky-400">{booking.seatId}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Tier</span>
              <span className="font-semibold text-white">{tierInfo.name}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Paid Amount</span>
              <span className="font-bold text-emerald-400">${booking.price}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Holder</span>
              <span className="font-mono text-slate-300">{booking.userId}</span>
            </div>
          </div>

          {/* Booking UUID & Barcode simulation */}
          <div className="mt-4 pt-3 border-t border-dashed border-slate-700/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 font-mono block">DURABLE BOOKING ID</span>
              <span className="text-[11px] font-mono text-slate-300 font-semibold truncate max-w-[200px] block">
                {booking.bookingId || "pg-tx-completed"}
              </span>
            </div>
            <div className="w-10 h-10 rounded bg-white p-1 flex items-center justify-center">
              <QrCode className="w-8 h-8 text-black" />
            </div>
          </div>
        </div>

        {/* Dismiss CTA */}
        <button
          onClick={onClose}
          className="mt-6 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Book Another Seat</span>
        </button>
      </div>
    </div>
  );
}
