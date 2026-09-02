"use client";

import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import {
  CheckCircle,
  QrCode,
  X,
  Download,
  Share2,
  Ticket,
  MapPin,
  Clock,
  Calendar,
  Star,
  Zap,
  Sparkles,
} from "lucide-react";
import { SnapTixMark } from "./SnapTixLogo";

function generateQRPattern(bookingId) {
  // Deterministic tiny QR-like pattern based on booking ID hash
  const seed = bookingId ? bookingId.charCodeAt(0) + bookingId.length : 42;
  return Array.from({ length: 49 }, (_, i) => (((seed * (i + 1) * 7) % 13 > 5) ? 1 : 0));
}

export default function BookingModal({ booking, venueInfo, selectedShowtime, onClose }) {
  const [showDownloadAnim, setShowDownloadAnim] = useState(false);
  const [showSnapPoints, setShowSnapPoints] = useState(false);
  const snapPointsEarned = booking ? Math.floor((booking.price || 0) * 0.1) + 50 : 0;

  useEffect(() => {
    if (booking) {
      // Multi-burst confetti
      const burst = (origin, colors) =>
        confetti({
          particleCount: 70,
          spread: 80,
          origin,
          colors,
          scalar: 1.1,
          gravity: 0.9,
        });

      try {
        setTimeout(() => burst({ x: 0.3, y: 0.5 }, ["#F84464", "#ff6b87", "#222433"]), 0);
        setTimeout(() => burst({ x: 0.7, y: 0.5 }, ["#1EA83C", "#00B9F5", "#FFD700"]), 150);
        setTimeout(() => burst({ x: 0.5, y: 0.4 }, ["#F84464", "#ffffff", "#1EA83C"]), 300);
      } catch (_) {}

      // Show SnapPoints badge after a short delay
      setTimeout(() => setShowSnapPoints(true), 1200);
      setTimeout(() => setShowSnapPoints(false), 4500);
    }
  }, [booking]);

  if (!booking) return null;

  const qrPattern = generateQRPattern(booking.bookingId || "BMS-X");
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  const handleDownload = () => {
    setShowDownloadAnim(true);
    setTimeout(() => setShowDownloadAnim(false), 2000);
    // In a real app: generate PDF with jsPDF / html2canvas
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      {/* SnapPoints Earned Float-Up Badge */}
      {showSnapPoints && (
        <div className="fixed top-1/4 left-1/2 -translate-x-1/2 z-[60] animate-bounce pointer-events-none">
          <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-2xl border border-amber-300">
            <Zap className="w-5 h-5 fill-white" />
            <div>
              <p className="text-[10px] font-semibold opacity-80">SNAPPOINTS EARNED</p>
              <p className="text-2xl font-black leading-tight">+{snapPointsEarned}</p>
            </div>
          </div>
        </div>
      )}
      <div className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl text-[#222433]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-10 p-1.5 text-white/80 hover:text-white rounded-full bg-black/30 hover:bg-black/50 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Banner */}
        <div className="bg-gradient-to-br from-[#F84464] to-[#c22040] px-6 py-5 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-16 h-16 rounded-full border-2 border-white"
                style={{
                  left: `${(i * 15) % 100}%`,
                  top: `${(i * 25) % 100}%`,
                  opacity: 0.3,
                }}
              />
            ))}
          </div>
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/80 block">
              OFFICIAL SNAPTIX M-TICKET
            </span>
            <h3 className="text-2xl font-black text-white mt-1">Booking Confirmed!</h3>
          </div>
        </div>

        {/* Ticket Notch Divider */}
        <div className="relative flex items-center -mt-px">
          <div className="w-6 h-6 rounded-full bg-slate-100 -ml-3 shrink-0 border border-slate-200" />
          <div className="flex-1 border-t-2 border-dashed border-slate-200 mx-2" />
          <div className="w-6 h-6 rounded-full bg-slate-100 -mr-3 shrink-0 border border-slate-200" />
        </div>

        {/* Ticket Body */}
        <div className="px-6 py-4 space-y-4">
          {/* Show Name */}
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-black text-base text-[#222433] leading-tight">
                {venueInfo?.title || "DUNE: PART TWO"}
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#F84464]" />
                {venueInfo?.subtitle || "PVR INOX: Phoenix Palladium"}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="px-2 py-0.5 rounded bg-[#F84464]/10 text-[#F84464] text-[10px] font-bold border border-[#F84464]/20">
                  {venueInfo?.format || "IMAX 2D"}
                </span>
                <span className="text-[10px] text-slate-400">{venueInfo?.rating || "UA 16+"}</span>
              </div>
            </div>
            <div className="shrink-0">
              <SnapTixMark size={36} />
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-slate-50 rounded-xl p-2.5 text-center border border-slate-100">
              <Ticket className="w-3.5 h-3.5 mx-auto text-[#F84464] mb-1" />
              <span className="text-[10px] text-slate-400 block">SEAT</span>
              <span className="font-black text-[#222433] text-base font-mono">
                {booking.seatId}
              </span>
            </div>
            <div className="bg-slate-50 rounded-xl p-2.5 text-center border border-slate-100">
              <Clock className="w-3.5 h-3.5 mx-auto text-indigo-500 mb-1" />
              <span className="text-[10px] text-slate-400 block">TIME</span>
              <span className="font-bold text-[#222433] text-[11px]">{selectedShowtime || "07:30 PM"}</span>
            </div>
            <div className="bg-slate-50 rounded-xl p-2.5 text-center border border-slate-100">
              <Calendar className="w-3.5 h-3.5 mx-auto text-emerald-500 mb-1" />
              <span className="text-[10px] text-slate-400 block">DATE</span>
              <span className="font-bold text-[#222433] text-[11px]">{dateStr}</span>
            </div>
          </div>

          {/* Tier & Price Row */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200">
            <div>
              <p className="text-[10px] text-emerald-600 font-semibold">{booking.tier} Tier</p>
              <p className="font-black text-emerald-800 text-base">₹{booking.price}.00</p>
            </div>
            <div className="flex items-center gap-1 text-emerald-600 text-[11px] font-bold">
              <CheckCircle className="w-4 h-4" />
              <span>Paid & Confirmed</span>
            </div>
          </div>

          {/* QR Code & Booking ID */}
          <div className="rounded-2xl bg-white border-2 border-slate-100 p-4 flex items-center gap-4 shadow-xs">
            {/* Mini QR pattern */}
            <div className="w-16 h-16 shrink-0">
              <div className="grid gap-px" style={{ gridTemplateColumns: "repeat(7, 1fr)" }}>
                {qrPattern.map((cell, i) => (
                  <div
                    key={i}
                    className="aspect-square"
                    style={{ backgroundColor: cell ? "#222433" : "#ffffff", borderRadius: 1 }}
                  />
                ))}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[9px] text-slate-400 uppercase font-bold block">
                BOOKING ID / M-TICKET
              </span>
              <span className="text-[11px] font-mono font-bold text-[#222433] truncate block">
                {booking.bookingId || "BMS-DURABLE-0x49A"}
              </span>
              <span className="text-[10px] text-emerald-600 flex items-center gap-1 mt-1 font-medium">
                <Zap className="w-3 h-3" /> Committed to Postgres Ledger
              </span>
            </div>
          </div>
        </div>

        {/* Ticket Bottom Notch */}
        <div className="relative flex items-center">
          <div className="w-6 h-6 rounded-full bg-slate-100 -ml-3 shrink-0 border border-slate-200" />
          <div className="flex-1 border-t-2 border-dashed border-slate-200 mx-2" />
          <div className="w-6 h-6 rounded-full bg-slate-100 -mr-3 shrink-0 border border-slate-200" />
        </div>

        {/* Action Buttons */}
        <div className="px-6 pb-6 pt-3 flex items-center gap-3">
          <button
            onClick={handleDownload}
            className={`flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer ${
              showDownloadAnim ? "bg-emerald-50 border-emerald-300 text-emerald-700" : "hover:bg-slate-50"
            }`}
          >
            {showDownloadAnim ? (
              <><CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Saved!</>
            ) : (
              <><Download className="w-3.5 h-3.5" /> Download Ticket</>
            )}
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-[#F84464] hover:bg-[#E03352] text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Ticket className="w-3.5 h-3.5" />
            Book Another
          </button>
        </div>
      </div>
    </div>
  );
}
