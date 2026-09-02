"use client";

import React, { useState } from "react";
import { Radio, X, Check, Calendar, MapPin, Users } from "lucide-react";

export default function ListYourShowModal({ isOpen, onClose, onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "Music Concert",
    city: "Mumbai",
    capacity: "500-2000",
    email: "",
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (onSubmitSuccess) {
      onSubmitSuccess(`Inquiry submitted for "${formData.name}". Our partner team will reach out within 2 hours!`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl text-[#222433] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#F84464]" />
            <div>
              <h3 className="font-bold text-base text-[#222433]">List Your Show on SnapTix</h3>
              <p className="text-xs text-slate-500">Sell tickets to millions of fans with real-time concurrency protection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6 space-y-3 animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="font-black text-lg text-[#222433]">Inquiry Received!</h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Thank you for listing <strong>{formData.name}</strong>. Our partnerships desk has received your specs and will activate your ticketing room on SnapTix shortly.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2 rounded-lg bg-[#333545] hover:bg-[#222433] text-white text-xs font-bold transition cursor-pointer"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Event / Show Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Arijit Singh Live Symphony"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-[#222433] focus:outline-none focus:border-[#F84464]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Event Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-[#222433] focus:outline-none focus:border-[#F84464]"
                  >
                    <option>Music Concert</option>
                    <option>Standup Comedy</option>
                    <option>Theatre & Play</option>
                    <option>Sports Tournament</option>
                    <option>Workshop / Conference</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Host City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-[#222433] focus:outline-none focus:border-[#F84464]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Expected Audience Capacity
                </label>
                <select
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-[#222433] focus:outline-none focus:border-[#F84464]"
                >
                  <option>Under 500 attendees</option>
                  <option>500 - 2,000 attendees</option>
                  <option>2,000 - 10,000 attendees</option>
                  <option>10,000+ Stadium Scale (High Concurrency)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Organizer Contact Email
                </label>
                <input
                  type="email"
                  placeholder="organizer@eventteam.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-[#222433] focus:outline-none focus:border-[#F84464]"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-[#F84464] hover:bg-[#E03352] text-white font-bold transition shadow-md cursor-pointer"
                >
                  Submit Event For Onboarding
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
