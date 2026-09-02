"use client";

import React, { useState } from "react";
import { Building2, X, Check, ShieldCheck } from "lucide-react";

export default function CorporatesModal({ isOpen, onClose, onSubmitSuccess }) {
  const [company, setCompany] = useState("");
  const [headcount, setHeadcount] = useState("50-100");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (onSubmitSuccess) {
      onSubmitSuccess(`Corporate inquiry for ${company} registered! Dedicated relationship manager assigned.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl text-[#222433] overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#00B9F5]" />
            <div>
              <h3 className="font-bold text-base text-[#222433]">Corporate Bookings</h3>
              <p className="text-xs text-slate-500">Bulk cinema screenings, employee rewards & vouchers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6 space-y-3 animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-600 mx-auto flex items-center justify-center">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="font-black text-lg text-[#222433]">Corporate Desk Notified</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Thank you, <strong>{company}</strong>. We will configure your corporate discount rate with custom tax invoicing.
              </p>
              <button
                onClick={onClose}
                className="mt-3 px-6 py-2 rounded-lg bg-slate-800 text-white text-xs font-bold hover:bg-slate-900 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company / Organization</label>
                <input
                  type="text"
                  placeholder="e.g. Google India / TCS"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-[#222433] focus:outline-none focus:border-[#00B9F5]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Number of Passes / Headcount</label>
                <select
                  value={headcount}
                  onChange={(e) => setHeadcount(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-[#222433] focus:outline-none focus:border-[#00B9F5]"
                >
                  <option>25 - 50 Seats (Private Audi Bay)</option>
                  <option>50 - 150 Seats (Full Audi Hall)</option>
                  <option>200+ Passes (Multiplex Takeover)</option>
                </select>
              </div>

              <div className="p-3 rounded-lg bg-sky-50 text-sky-900 border border-sky-200 text-[11px] leading-relaxed">
                Includes dedicated check-in lane, custom food & beverage vouchers, and zero platform booking surcharge.
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-[#00B9F5] hover:bg-[#00A2D6] text-white font-bold transition shadow-md cursor-pointer"
              >
                Request Corporate Quote
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
