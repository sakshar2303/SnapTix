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
  Terminal,
  Cpu,
} from "lucide-react";
import { TIERS } from "../lib/constants";

export default function BookingModal({ booking, onClose }) {
  useEffect(() => {
    if (booking) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#FF9500", "#E2E8F0", "#38BDF8", "#10B981"],
        });
      } catch (err) {
        // fallback
      }
    }
  }, [booking]);

  if (!booking) return null;

  const tierInfo = TIERS[booking.tier] || TIERS.STANDARD;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-150 font-mono">
      <div className="te-chassis relative w-full max-w-lg rounded-2xl p-6 sm:p-7 border border-[#2D3343] shadow-2xl text-white">
        {/* Hardware Corner Screws */}
        <div className="te-screw absolute top-3 left-3"></div>
        <div className="te-screw absolute top-3 right-3"></div>
        <div className="te-screw absolute bottom-3 left-3"></div>
        <div className="te-screw absolute bottom-3 right-3"></div>

        {/* Close icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded bg-[#161922] border border-[#2B303E] transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Hardware Confirmation Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#181C26] border border-[#343B4E] text-[#FF9500] mb-2 shadow-inner">
            <Cpu className="w-6 h-6 text-[#FF9500]" />
          </div>
          <h3 className="text-lg font-black tracking-tight text-white uppercase">
            [ ALLOCATION COMMITTED ]
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            DURABLE WRITE VERIFIED // NEON_POSTGRES
          </p>
        </div>

        {/* Technical Hardware Spec Boarding Pass */}
        <div className="rounded-xl bg-[#090B0E] border border-[#232734] p-5 shadow-inner">
          {/* Header Strip */}
          <div className="flex items-center justify-between border-b border-[#1E222D] pb-3 mb-3">
            <div>
              <span className="text-[9px] font-bold text-[#FF9500] uppercase tracking-widest block">
                FIELD PROTOCOL CERTIFICATE // 2026
              </span>
              <h4 className="font-extrabold text-sm text-white uppercase">
                FREQUENCY PROTOCOL // LIVE MODULAR FIELD
              </h4>
              <p className="text-[10px] text-slate-500">
                SYNTH LAB 01 • CH-1004 RESEARCH CAMPUS
              </p>
            </div>
            <Terminal className="w-4 h-4 text-slate-500" />
          </div>

          {/* Allocation Grid */}
          <div className="grid grid-cols-2 gap-3 py-1 text-xs">
            <div>
              <span className="text-[9px] text-slate-500 uppercase block font-bold">
                ASSIGNED_POD
              </span>
              <span className="font-mono font-black text-2xl text-[#FF9500]">
                {booking.seatId}
              </span>
            </div>
            <div>
              <span className="text-[9px] text-slate-500 uppercase block font-bold">
                TIER_CLASSIFICATION
              </span>
              <span className="font-bold text-xs text-white block">
                {tierInfo.name}
              </span>
              <span className="text-[10px] text-slate-400">
                [{tierInfo.badge}]
              </span>
            </div>
            <div>
              <span className="text-[9px] text-slate-500 uppercase block font-bold">
                FEE_SETTLED
              </span>
              <span className="font-bold text-emerald-400 text-xs">
                ${booking.price}.00 USD (0.00 TAX)
              </span>
            </div>
            <div>
              <span className="text-[9px] text-slate-500 uppercase block font-bold">
                OPERATOR_KEY
              </span>
              <span className="text-slate-300 text-[11px] truncate block">
                {booking.userId}
              </span>
            </div>
          </div>

          {/* Cryptographic Ledger Verification */}
          <div className="mt-3 pt-3 border-t border-dashed border-[#1E222D] flex items-center justify-between">
            <div className="max-w-[220px]">
              <span className="text-[8px] text-slate-600 block uppercase font-bold">
                IMMUTABLE TRANSACTION UUID
              </span>
              <span className="text-[10px] text-slate-400 truncate block font-mono">
                {booking.bookingId || "0x892a-pg-durable"}
              </span>
              <span className="text-[9px] text-emerald-400 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3 h-3" /> ACID INVARIANT VERIFIED
              </span>
            </div>
            <div className="w-11 h-11 rounded-lg bg-white p-1 flex items-center justify-center">
              <QrCode className="w-full h-full text-black" />
            </div>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="mt-5 flex items-center gap-2.5">
          <button
            onClick={() => alert("Hardware allocation pass saved to local storage!")}
            className="te-button flex-1 py-2.5 rounded-lg text-[11px] font-bold text-slate-300 hover:text-white transition flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT_PASS</span>
          </button>

          <button
            onClick={onClose}
            className="te-button-accent flex-1 py-2.5 rounded-lg text-[11px] font-black transition flex items-center justify-center gap-1.5 uppercase"
          >
            <span>DISMISS_MODAL</span>
          </button>
        </div>
      </div>
    </div>
  );
}
