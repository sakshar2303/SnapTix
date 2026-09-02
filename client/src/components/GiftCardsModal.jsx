"use client";

import React, { useState } from "react";
import { Gift, X, Check, Copy, Sparkles } from "lucide-react";

export default function GiftCardsModal({ isOpen, onClose }) {
  const [amount, setAmount] = useState(1000);
  const [recipient, setRecipient] = useState("");
  const [generatedCode, setGeneratedCode] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePurchase = (e) => {
    e.preventDefault();
    const randomCode = `GIFT-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${amount}`;
    setGeneratedCode(randomCode);
  };

  const handleCopy = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl text-[#222433] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-[#F84464]" />
            <h3 className="font-bold text-base text-[#222433]">SnapTix Gift Cards</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Gift Card Visual */}
        <div className="p-6">
          <div className="w-full h-40 rounded-xl bg-gradient-to-tr from-[#333545] via-[#222433] to-[#F84464] p-5 text-white flex flex-col justify-between shadow-lg relative overflow-hidden mb-5">
            <div className="flex items-center justify-between relative z-10">
              <span className="font-black tracking-tight text-lg">Snap<span className="text-[#F84464]">Tix</span></span>
              <span className="px-2 py-0.5 rounded bg-white/20 text-xs font-bold backdrop-blur-xs">
                E-GIFT VOUCHER
              </span>
            </div>
            <div className="relative z-10">
              <div className="text-2xl font-black">₹{amount}.00</div>
              <div className="text-xs text-white/80 mt-0.5">
                {recipient ? `For: ${recipient}` : "Valid across all movies & live events"}
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none"></div>
          </div>

          {generatedCode ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2 animate-in zoom-in-95">
              <span className="text-xs font-bold text-emerald-800 flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Gift Card Generated Successfully!
              </span>
              <div className="p-2.5 bg-white rounded-lg border border-emerald-200 font-mono font-black text-sm text-[#222433] flex items-center justify-between">
                <span>{generatedCode}</span>
                <button
                  onClick={handleCopy}
                  className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <p className="text-[11px] text-emerald-700">
                Share this voucher code with {recipient || "your friend"} to redeem on SnapTix!
              </p>
            </div>
          ) : (
            <form onSubmit={handlePurchase} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select Denomination
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[500, 1000, 2500].map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setAmount(amt)}
                      className={`py-2 rounded-lg text-xs font-bold border transition cursor-pointer ${
                        amount === amt
                          ? "border-[#F84464] bg-[#F84464]/10 text-[#F84464]"
                          : "border-slate-200 hover:border-slate-300 text-slate-700"
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-[#222433] focus:outline-none focus:border-[#F84464]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-[#F84464] hover:bg-[#E03352] text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                Purchase Gift Card (₹{amount})
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
