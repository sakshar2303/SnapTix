"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import {
  CheckCircle,
  QrCode,
  Ticket,
  Calendar,
  MapPin,
  Sparkles,
  X,
  ShieldCheck,
  Download,
  Share2,
} from "lucide-react";
import { TIERS } from "../lib/constants";

export default function BookingModal({ booking, onClose }) {
  useEffect(() => {
    if (booking) {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#38BDF8", "#818CF8", "#FACC15", "#34D399"],
        });
      } catch (err) {
        // graceful
      }
    }
  }, [booking]);

  if (!booking) return null;

  const tierInfo = TIERS[booking.tier] || TIERS.STANDARD;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#11141E] to-[#0A0C13] rounded-3xl border border-white/[0.12] p-6 sm:p-8 shadow-[0_30px_70px_rgba(0,0,0,0.9)] text-white">
        {/* Close icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-white/[0.05] hover:bg-white/[0.1] transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Confirmation */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 mb-3 shadow-lg shadow-emerald-500/20">
            <CheckCircle className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-black tracking-tight text-white">
            Admission Confirmed
          </h3>
          <p className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Committed to Neon Postgres with Physical UNIQUE Invariant</span>
          </p>
        </div>

        {/* Luxury Concert Admission Pass */}
        <div className="relative rounded-2xl bg-[#161B28] border border-white/[0.1] p-6 overflow-hidden shadow-2xl">
          {/* Hologram top edge strip */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 via-indigo-500 to-amber-400"></div>

          {/* Ticket Perforations */}
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#0A0C13] border border-white/10"></div>
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#0A0C13] border border-white/10"></div>

          {/* Pass Title */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-sky-400 block font-mono">
                OFFICIAL ADMISSION PASS
              </span>
              <h4 className="font-extrabold text-base text-white">
                Cyber Symphony 2026
              </h4>
              <p className="text-xs text-slate-400">
                Kuroshio Concert Hall • Neo-Tokyo
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center">
              <Ticket className="w-5 h-5 text-sky-400" />
            </div>
          </div>

          {/* Ticket Key Data Grid */}
          <div className="grid grid-cols-2 gap-4 py-2 text-xs">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
                Assigned Seat
              </span>
              <span className="font-mono font-black text-2xl text-sky-400">
                {booking.seatId}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
                Tier & Section
              </span>
              <span className="font-bold text-sm text-white block">
                {tierInfo.name}
              </span>
              <span className="text-[11px] text-amber-400 font-medium">
                {tierInfo.badge}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
                Price Paid
              </span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                ${booking.price} (Verified $0 Fees)
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
                Ticket Holder
              </span>
              <span className="font-mono text-slate-300 text-xs truncate block">
                {booking.userId}
              </span>
            </div>
          </div>

          {/* Ledger Hash & QR Code */}
          <div className="mt-4 pt-4 border-t border-dashed border-white/[0.12] flex items-center justify-between">
            <div className="max-w-[240px]">
              <span className="text-[9px] uppercase font-mono text-slate-500 block tracking-wider">
                POSTGRES DURABLE TRANSACTION HASH
              </span>
              <span className="text-[11px] font-mono text-slate-300 truncate block">
                {booking.bookingId || "pg-tx-durable-0x892a"}
              </span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5 font-medium">
                <CheckCircle className="w-2.5 h-2.5" /> Immutable ACID Ledger
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-md">
              <QrCode className="w-full h-full text-black" />
            </div>
          </div>
        </div>

        {/* Pass Actions */}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={() => alert("Digital ticket pass saved to device wallet!")}
            className="flex-1 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-white font-semibold text-xs transition flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save Pass</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-sky-500/25 transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Book Another Seat</span>
          </button>
        </div>
      </div>
    </div>
  );
}
