"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import {
  CheckCircle,
  QrCode,
  Film,
  MapPin,
  Calendar,
  Clock,
  X,
  ShieldCheck,
  Download,
} from "lucide-react";
import { TIERS } from "../lib/constants";

export default function BookingModal({ booking, onClose }) {
  useEffect(() => {
    if (booking) {
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ["#F84464", "#2DC44D", "#00B9F5", "#FFFFFF"],
        });
      } catch (err) {
        // fallback
      }
    }
  }, [booking]);

  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-[#1C222F] rounded-2xl border border-[#2F3A4E] shadow-2xl text-white overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-1.5 text-slate-300 hover:text-white rounded-full bg-black/40 hover:bg-black/60 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top BookMyShow Crimson Banner */}
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
          <div className="flex items-start justify-between border-b border-[#2C3648] pb-4 mb-4">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="px-1.5 py-0.2 rounded bg-[#F84464]/20 text-[#F84464] text-[10px] font-bold border border-[#F84464]/30">
                  IMAX 2D
                </span>
                <span className="text-[10px] text-slate-400">UA 16+</span>
              </div>
              <h4 className="font-black text-lg text-white">
                DUNE: PART TWO
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                PVR INOX: Phoenix Palladium • Audi 4
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#272F40] flex items-center justify-center text-[#F84464]">
              <Film className="w-5 h-5" />
            </div>
          </div>

          {/* Show Details Grid */}
          <div className="grid grid-cols-2 gap-3 py-1 text-xs mb-4">
            <div>
              <span className="text-[10px] uppercase text-slate-400 font-semibold block">
                SEAT NUMBER
              </span>
              <span className="font-mono font-black text-2xl text-[#2DC44D]">
                {booking.seatId}
              </span>
              <span className="text-[11px] text-slate-300 block">
                {booking.tier} Tier
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-400 font-semibold block">
                SHOWTIME
              </span>
              <span className="font-bold text-sm text-white block">
                Today, 07:30 PM
              </span>
              <span className="text-[11px] text-emerald-400 font-bold block">
                ₹{booking.price}.00 Paid
              </span>
            </div>
          </div>

          {/* QR Code Entry Pass */}
          <div className="rounded-xl bg-[#141822] border border-[#2B3446] p-4 flex items-center justify-between gap-4">
            <div>
              <span className="text-[9px] text-slate-400 uppercase font-bold block">
                BOOKING ID / M-TICKET
              </span>
              <span className="text-xs font-mono font-bold text-white truncate max-w-[200px] block">
                {booking.bookingId || "BMS-DURABLE-0x49A"}
              </span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                <CheckCircle className="w-3 h-3" /> Committed to Neon Postgres
              </span>
            </div>
            <div className="w-14 h-14 rounded-lg bg-white p-1 flex items-center justify-center shrink-0">
              <QrCode className="w-full h-full text-black" />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={() => alert("M-Ticket saved to your device!")}
              className="flex-1 py-2.5 rounded-lg bg-[#252C3B] hover:bg-[#323B4E] text-white font-semibold text-xs transition flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save M-Ticket</span>
            </button>

            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg bg-[#F84464] hover:bg-[#E03352] text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
            >
              <span>Book Another Seat</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
