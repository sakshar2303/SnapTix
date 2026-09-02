"use client";

import React, { useState } from "react";
import { Tag, X, Check, Gift, Percent, ShieldCheck } from "lucide-react";

export const PROMO_OFFERS = [
  {
    code: "SNAP50",
    title: "Flat ₹50 OFF",
    description: "Valid on any movie or live concert booking with zero minimum spend.",
    discountAmount: 50,
    type: "flat",
    bank: "All Payment Methods",
    color: "#F84464",
  },
  {
    code: "IMAX20",
    title: "20% Discount (up to ₹100)",
    description: "Exclusive discount on IMAX 2D & 3D cinematic formats.",
    discountAmount: 80,
    type: "percent",
    bank: "HDFC & ICICI Cards",
    color: "#2DC44D",
  },
  {
    code: "BMS100",
    title: "Flat ₹100 OFF",
    description: "Special weekend flash code for premium Recliner & VIP tickets.",
    discountAmount: 100,
    type: "flat",
    bank: "SnapTix Pay & UPI",
    color: "#00B9F5",
  },
];

export default function OffersModal({ isOpen, onClose, activeCode, onApplyPromo }) {
  const [customCode, setCustomCode] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleCustomApply = () => {
    const found = PROMO_OFFERS.find(
      (o) => o.code.toUpperCase() === customCode.trim().toUpperCase()
    );
    if (found) {
      setError("");
      onApplyPromo(found);
      onClose();
    } else {
      setError("Invalid or expired coupon code. Try SNAP50 or BMS100.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl text-[#222433] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#F84464]" />
            <h3 className="font-bold text-base text-[#222433]">Offers & Promo Codes</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Enter Code Input */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
          <input
            type="text"
            placeholder="Enter promo code (e.g. SNAP50)"
            value={customCode}
            onChange={(e) => {
              setCustomCode(e.target.value);
              setError("");
            }}
            className="flex-1 px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-[#222433] uppercase font-bold focus:outline-none focus:border-[#F84464]"
          />
          <button
            onClick={handleCustomApply}
            className="px-4 py-2 rounded-lg bg-[#F84464] hover:bg-[#E03352] text-white text-xs font-bold transition cursor-pointer"
          >
            Apply
          </button>
        </div>
        {error && (
          <div className="px-4 py-2 bg-rose-50 text-rose-600 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Available Codes List */}
        <div className="p-6 space-y-3.5 max-h-[55vh] overflow-y-auto">
          {PROMO_OFFERS.map((offer) => {
            const isApplied = activeCode === offer.code;
            return (
              <div
                key={offer.code}
                className={`p-4 rounded-xl border transition flex items-start justify-between gap-4 ${
                  isApplied
                    ? "border-emerald-500 bg-emerald-50/40"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono font-black text-xs text-[#222433]">
                      {offer.code}
                    </span>
                    <span className="font-bold text-xs text-[#1EA83C]">
                      {offer.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mb-1.5 leading-relaxed">
                    {offer.description}
                  </p>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Applicable with {offer.bank}
                  </span>
                </div>

                <button
                  onClick={() => {
                    onApplyPromo(offer);
                    onClose();
                  }}
                  disabled={isApplied}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition cursor-pointer ${
                    isApplied
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 hover:bg-[#F84464] hover:text-white text-slate-700"
                  }`}
                >
                  {isApplied ? (
                    <span className="flex items-center gap-1">
                      <Check className="w-3 h-3" /> Applied
                    </span>
                  ) : (
                    "Apply"
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-500">
          Discount is deducted immediately from your ticket total upon checkout
        </div>
      </div>
    </div>
  );
}
