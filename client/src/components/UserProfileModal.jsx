"use client";

import React, { useState } from "react";
import { User, X, RefreshCw, Ticket, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function UserProfileModal({
  isOpen,
  onClose,
  userId,
  onSwitchUser,
  confirmedBooking,
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(userId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl text-[#222433] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#F84464]/10 border border-[#F84464]/20 flex items-center justify-center text-[#F84464]">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#222433]">User Profile & Identity</h3>
              <p className="text-xs text-slate-500">Active session for concurrent seat reservations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          {/* Active Session ID */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Active Booker UUID
            </span>
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-slate-800 text-xs truncate max-w-[240px]">
                {userId}
              </span>
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium text-[11px] transition cursor-pointer"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          {/* Switch Identity Button */}
          <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-200 text-indigo-950">
            <div className="font-bold mb-1 flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
              <span>Test Multi-User Concurrency</span>
            </div>
            <p className="text-[11px] text-indigo-700 mb-2.5 leading-relaxed">
              Generate a new distinct User ID to simulate a second attendee contending for the exact same seats in another tab or window.
            </p>
            <button
              onClick={() => {
                onSwitchUser();
                onClose();
              }}
              className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer"
            >
              Switch to New Random User Identity
            </button>
          </div>

          {/* Booked Tickets in this session */}
          <div>
            <div className="font-bold text-slate-700 mb-2 flex items-center gap-1">
              <Ticket className="w-3.5 h-3.5 text-[#F84464]" />
              <span>Recent Transaction History</span>
            </div>
            {confirmedBooking ? (
              <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-emerald-900">
                    Seat {confirmedBooking.seatId} ({confirmedBooking.tier})
                  </div>
                  <div className="text-[11px] text-emerald-700">
                    ₹{confirmedBooking.price}.00 • Neon Postgres Committed
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold">
                  CONFIRMED
                </span>
              </div>
            ) : (
              <div className="p-3 rounded-lg border border-dashed border-slate-200 text-center text-slate-400 text-xs">
                No tickets purchased in this session yet
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-500">
          Redis locking keys map 1-to-1 to your Booker UUID
        </div>
      </div>
    </div>
  );
}
