"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import {
  CheckCircle,
  QrCode,
  Film,
  X,
  Download,
} from "lucide-react";

export default function BookingModal({ booking, venueInfo, selectedShowtime, onClose }) {
  useEffect(() => {
    if (booking) {
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ["#F84464", "#1EA83C", "#00B9F5", "#222433"],
        });
      } catch (err) {
        // fallback
      }
    }
  }, [booking]);

  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl text-[#222433] overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-1.5 text-white/80 hover:text-white rounded-full bg-black/20 hover:bg-black/40 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Crimson Banner */}
        <div className="bg-[#F84464] px-6 py-4 text-center relative">
          <span className="text-[10px] font-black uppercase tracking-widest text-white/90">
            OFFICIAL SNAPTIX M-TICKET
          </span>
          <h3 className="text-xl font-black text-white mt-0.5">
            Booking Confirmed!
          </h3>
        </div>

        {/* Ticket Body */}
        <div className="p-6">
          {/* Movie Title & Format */}
          <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-4">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="px-1.5 py-0.2 rounded bg-[#F84464]/10 text-[#F84464] text-[10px] font-bold border border-[#F84464]/20">
                  {venueInfo?.format || "IMAX 2D"}
                </span>
                <span className="text-[10px] text-slate-400">{venueInfo?.rating || "UA 16+"}</span>
              </div>
              <h4 className="font-black text-lg text-[#222433]">
                {venueInfo?.title || "DUNE: PART TWO"}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {venueInfo?.subtitle || "PVR INOX: Phoenix Palladium • Audi 4"}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-[#F84464]">
              <Film className="w-5 h-5" />
            </div>
          </div>

          {/* Show Details Grid */}
          <div className="grid grid-cols-2 gap-3 py-1 text-xs mb-4">
            <div>
              <span className="text-[10px] uppercase text-slate-400 font-semibold block">
                SEAT NUMBER
              </span>
              <span className="font-mono font-black text-2xl text-[#1EA83C]">
                {booking.seatId}
              </span>
              <span className="text-[11px] text-slate-500 block">
                {booking.tier} Tier
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-400 font-semibold block">
                SHOWTIME
              </span>
              <span className="font-bold text-sm text-[#222433] block">
                Today, {selectedShowtime || "07:30 PM"}
              </span>
              <span className="text-[11px] text-emerald-600 font-bold block">
                ₹{booking.price}.00 Paid
              </span>
            </div>
          </div>

          {/* QR Code Entry Pass */}
          <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4 flex items-center justify-between gap-4">
            <div>
              <span className="text-[9px] text-slate-400 uppercase font-bold block">
                BOOKING ID / M-TICKET
              </span>
              <span className="text-xs font-mono font-bold text-[#222433] truncate max-w-[200px] block">
                {booking.bookingId || "BMS-DURABLE-0x49A"}
              </span>
              <span className="text-[10px] text-emerald-600 flex items-center gap-1 mt-1 font-medium">
                <CheckCircle className="w-3 h-3" /> Committed to Neon Postgres
              </span>
            </div>
            <div className="w-14 h-14 rounded-lg bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0 shadow-xs">
              <QrCode className="w-full h-full text-black" />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={() => alert("M-Ticket pass saved to your device wallet!")}
              className="flex-1 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save M-Ticket</span>
            </button>

            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg bg-[#F84464] hover:bg-[#E03352] text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Book Another Seat</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
