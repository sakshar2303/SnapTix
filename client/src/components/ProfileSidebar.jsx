"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  Star,
  Ticket,
  Heart,
  Settings,
  LogOut,
  ChevronRight,
  Gift,
  Wallet,
  Bell,
  Shield,
  Crown,
  Film,
  Music,
  Trophy,
  Calendar,
  MapPin,
  Clock,
  Check,
  Zap,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

const DEMO_BOOKINGS = [
  {
    id: "BK-9182",
    title: "Dune: Part Two",
    venue: "PVR IMAX: Phoenix Palladium",
    date: "30 Aug 2026",
    time: "07:30 PM",
    seats: ["D4", "D5"],
    amount: 760,
    status: "confirmed",
    category: "Movies",
  },
  {
    id: "BK-8764",
    title: "Coldplay: Music of the Spheres",
    venue: "DY Patil Stadium, Navi Mumbai",
    date: "14 Sep 2026",
    time: "07:30 PM",
    seats: ["FLOOR ARENA: F12"],
    amount: 490,
    status: "upcoming",
    category: "Events",
  },
  {
    id: "BK-7241",
    title: "Mughal-e-Azam: The Musical",
    venue: "NCPA Jamshed Bhabha Theatre",
    date: "12 Aug 2026",
    time: "07:30 PM",
    seats: ["C3", "C4"],
    amount: 800,
    status: "completed",
    category: "Plays",
  },
];

const OFFERS = [
  { code: "SNAP20", title: "20% Off IMAX", desc: "Valid on IMAX tickets", color: "#F84464" },
  { code: "HDFC15", title: "₹150 Bank Off", desc: "HDFC Debit/Credit Card", color: "#2DC44D" },
  { code: "FIRST50", title: "₹50 First Booking", desc: "New users only", color: "#00B9F5" },
];

export default function ProfileSidebar({ isOpen, onClose, userId, onSwitchUser }) {
  const [mode, setMode] = useState("login"); // 'login' | 'signup' | 'dashboard'
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("bookings");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState("");
  const sidebarRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleInput = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.email.includes("@")) return setFormError("Enter a valid email address.");
    if (form.password.length < 6) return setFormError("Password must be at least 6 characters.");
    setFormLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setUser({
      name: form.email.split("@")[0].replace(/[^a-zA-Z]/g, " ").trim() || "Cinephile",
      email: form.email,
      avatar: form.email[0].toUpperCase(),
      tier: "Gold Member",
      walletBalance: 340,
      snapPoints: 1280,
      joinedDate: "Mar 2024",
    });
    setMode("dashboard");
    setFormLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setFormError("Please enter your full name.");
    if (!form.email.includes("@")) return setFormError("Enter a valid email address.");
    if (!form.phone.match(/^\d{10}$/)) return setFormError("Enter a valid 10-digit phone number.");
    if (form.password.length < 6) return setFormError("Password must be at least 6 characters.");
    setFormLoading(true);
    await new Promise((r) => setTimeout(r, 1100));
    setUser({
      name: form.name,
      email: form.email,
      avatar: form.name[0].toUpperCase(),
      tier: "New Member",
      walletBalance: 50,
      snapPoints: 50,
      joinedDate: "Sep 2026",
    });
    setMode("dashboard");
    setFormLoading(false);
  };

  const handleLogout = () => {
    setUser(null);
    setMode("login");
    setForm({ name: "", email: "", phone: "", password: "" });
    setFormError("");
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  const tabs = [
    { id: "bookings", label: "My Bookings", icon: Ticket },
    { id: "wallet", label: "Wallet & Offers", icon: Wallet },
    { id: "profile", label: "Profile", icon: Settings },
  ];

  const categoryIcon = (cat) => {
    if (cat === "Movies") return <Film className="w-3.5 h-3.5 text-indigo-500" />;
    if (cat === "Events") return <Music className="w-3.5 h-3.5 text-purple-500" />;
    if (cat === "Sports") return <Trophy className="w-3.5 h-3.5 text-amber-500" />;
    if (cat === "Plays") return <Star className="w-3.5 h-3.5 text-pink-500" />;
    return <Calendar className="w-3.5 h-3.5 text-slate-500" />;
  };

  const statusStyle = {
    confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    upcoming: "bg-indigo-50 text-indigo-700 border-indigo-200",
    completed: "bg-slate-50 text-slate-500 border-slate-200",
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full w-full max-w-sm z-50 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* ─── HEADER ─── */}
        <div className="bg-[#333545] px-5 pt-5 pb-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {mode === "dashboard" && user ? (
              <>
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#F84464] to-[#ff6b87] flex items-center justify-center text-white text-lg font-black shadow-lg">
                  {user.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold text-sm">{user.name}</span>
                    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[10px] font-bold border border-amber-400/30">
                      <Crown className="w-2.5 h-2.5" /> {user.tier}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5">{user.email}</p>
                </div>
              </>
            ) : (
              <div>
                <p className="text-white font-bold text-base">
                  {mode === "login" ? "Sign In to SnapTix" : "Create Account"}
                </p>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  {mode === "login"
                    ? "Access bookings, wallet & exclusive offers"
                    : "Join millions of entertainment seekers"}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ─── QUICK STATS BAR (Dashboard only) ─── */}
        {mode === "dashboard" && user && (
          <div className="bg-[#1F2533] px-5 py-3 flex items-center justify-around border-b border-[#292B38] shrink-0">
            <div className="text-center">
              <div className="text-white font-black text-base">₹{user.walletBalance}</div>
              <div className="text-slate-400 text-[10px] font-medium">Wallet</div>
            </div>
            <div className="w-px h-8 bg-[#404356]"></div>
            <div className="text-center">
              <div className="text-amber-400 font-black text-base">{user.snapPoints}</div>
              <div className="text-slate-400 text-[10px] font-medium">SnapPoints</div>
            </div>
            <div className="w-px h-8 bg-[#404356]"></div>
            <div className="text-center">
              <div className="text-emerald-400 font-black text-base">{DEMO_BOOKINGS.length}</div>
              <div className="text-slate-400 text-[10px] font-medium">Bookings</div>
            </div>
          </div>
        )}

        {/* ─── TAB BAR (Dashboard only) ─── */}
        {mode === "dashboard" && (
          <div className="flex items-center border-b border-slate-200 px-4 bg-white shrink-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-3 text-xs font-semibold border-b-2 transition cursor-pointer -mb-px ${
                  activeTab === tab.id
                    ? "border-[#F84464] text-[#F84464]"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* ─── SCROLLABLE BODY ─── */}
        <div className="flex-1 overflow-y-auto">

          {/* ── LOGIN FORM ── */}
          {mode === "login" && (
            <div className="p-5 space-y-4">
              <form onSubmit={handleLogin} className="space-y-3.5">
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleInput}
                    placeholder="Email address"
                    required
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm text-[#222433] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F84464]/30 focus:border-[#F84464] transition"
                  />
                </div>

                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleInput}
                    placeholder="Password"
                    required
                    className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-slate-200 text-sm text-[#222433] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F84464]/30 focus:border-[#F84464] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {formError && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full py-2.5 rounded-xl bg-[#F84464] hover:bg-[#e03254] text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-70"
                >
                  {formLoading ? (
                    <span className="animate-spin rounded-full w-4 h-4 border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      Sign In <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-200"></div>
                <span className="text-xs text-slate-400">or continue with</span>
                <div className="flex-1 h-px bg-slate-200"></div>
              </div>

              {/* Social Logins */}
              <div className="grid grid-cols-2 gap-2.5">
                <button className="flex items-center justify-center gap-2 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition text-xs font-medium text-slate-700 cursor-pointer">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button className="flex items-center justify-center gap-2 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition text-xs font-medium text-slate-700 cursor-pointer">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  OTP / Mobile
                </button>
              </div>

              <p className="text-center text-xs text-slate-500">
                New to SnapTix?{" "}
                <button
                  onClick={() => { setMode("signup"); setFormError(""); }}
                  className="text-[#F84464] font-semibold hover:underline cursor-pointer"
                >
                  Create Account
                </button>
              </p>
            </div>
          )}

          {/* ── SIGNUP FORM ── */}
          {mode === "signup" && (
            <div className="p-5 space-y-4">
              <form onSubmit={handleSignup} className="space-y-3.5">
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleInput}
                    placeholder="Full Name"
                    required
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm text-[#222433] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F84464]/30 focus:border-[#F84464] transition"
                  />
                </div>

                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleInput}
                    placeholder="Email address"
                    required
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm text-[#222433] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F84464]/30 focus:border-[#F84464] transition"
                  />
                </div>

                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleInput}
                    placeholder="Mobile Number (10 digits)"
                    maxLength={10}
                    required
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm text-[#222433] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F84464]/30 focus:border-[#F84464] transition"
                  />
                </div>

                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleInput}
                    placeholder="Create Password (min 6 chars)"
                    required
                    className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-slate-200 text-sm text-[#222433] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F84464]/30 focus:border-[#F84464] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {formError && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full py-2.5 rounded-xl bg-[#F84464] hover:bg-[#e03254] text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-70"
                >
                  {formLoading ? (
                    <span className="animate-spin rounded-full w-4 h-4 border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      Create Account <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-xs text-slate-500">
                Already have an account?{" "}
                <button
                  onClick={() => { setMode("login"); setFormError(""); }}
                  className="text-[#F84464] font-semibold hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </p>

              <p className="text-center text-[10px] text-slate-400 leading-relaxed">
                By signing up, you agree to SnapTix&apos;s Terms of Service and Privacy Policy.
              </p>
            </div>
          )}

          {/* ── DASHBOARD ── */}
          {mode === "dashboard" && user && (
            <div className="pb-6">

              {/* ── BOOKINGS TAB ── */}
              {activeTab === "bookings" && (
                <div className="p-4 space-y-3">
                  {DEMO_BOOKINGS.map((b) => (
                    <div
                      key={b.id}
                      className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs hover:shadow-sm transition"
                    >
                      {/* Card Top */}
                      <div className="px-4 py-3 border-b border-slate-100 flex items-start justify-between">
                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5">{categoryIcon(b.category)}</div>
                          <div>
                            <p className="font-bold text-xs text-[#222433] leading-tight">{b.title}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                              <MapPin className="w-2.5 h-2.5" /> {b.venue}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${statusStyle[b.status]}`}
                        >
                          {b.status}
                        </span>
                      </div>

                      {/* Card Bottom */}
                      <div className="px-4 py-2.5 flex items-center justify-between bg-slate-50/60">
                        <div className="flex items-center gap-3 text-[11px] text-slate-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {b.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {b.time}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] font-black text-[#222433]">₹{b.amount}</span>
                          <div className="text-[10px] text-slate-400">{b.seats.join(", ")}</div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="pt-1">
                    <button className="w-full py-2.5 rounded-xl border border-[#F84464]/40 text-[#F84464] text-xs font-semibold hover:bg-[#F84464]/5 transition cursor-pointer flex items-center justify-center gap-1.5">
                      View All Booking History <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* ── WALLET & OFFERS TAB ── */}
              {activeTab === "wallet" && (
                <div className="p-4 space-y-4">
                  {/* Wallet Card */}
                  <div className="rounded-2xl bg-gradient-to-br from-[#F84464] to-[#c22040] p-5 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-white/10 -translate-y-1/4 translate-x-1/4"></div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-black/10 translate-y-1/3 -translate-x-1/3"></div>
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Wallet className="w-4 h-4 opacity-80" />
                        <span className="text-xs font-semibold opacity-80">SnapTix Wallet</span>
                      </div>
                      <div className="text-3xl font-black tracking-tight">₹{user.walletBalance}</div>
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-bold">
                          <Zap className="w-3 h-3 fill-amber-300 text-amber-300" />
                          {user.snapPoints} SnapPoints
                        </div>
                        <div className="text-[10px] opacity-70">≈ ₹{Math.floor(user.snapPoints * 0.1)} value</div>
                      </div>
                    </div>
                  </div>

                  {/* Add Money CTA */}
                  <button className="w-full py-2.5 rounded-xl border-2 border-dashed border-slate-200 hover:border-[#F84464]/40 text-xs font-semibold text-slate-600 hover:text-[#F84464] transition cursor-pointer flex items-center justify-center gap-2">
                    + Add Money to Wallet
                  </button>

                  {/* Promo Codes */}
                  <div>
                    <p className="text-xs font-black text-[#222433] mb-2.5 flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5 text-[#F84464]" />
                      Active Promo Codes
                    </p>
                    <div className="space-y-2">
                      {OFFERS.map((offer) => (
                        <div
                          key={offer.code}
                          className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:shadow-xs transition"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-black shrink-0"
                              style={{ backgroundColor: offer.color }}
                            >
                              %
                            </div>
                            <div>
                              <p className="font-bold text-xs text-[#222433]">{offer.title}</p>
                              <p className="text-[10px] text-slate-500">{offer.desc}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => copyCode(offer.code)}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-slate-700 transition cursor-pointer flex items-center gap-1"
                          >
                            {copiedCode === offer.code ? (
                              <><Check className="w-3 h-3 text-emerald-600" /> Copied!</>
                            ) : (
                              offer.code
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── PROFILE TAB ── */}
              {activeTab === "profile" && (
                <div className="p-4 space-y-3">
                  {/* Profile Fields */}
                  <div className="rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                    {[
                      { label: "Full Name", value: user.name, icon: User },
                      { label: "Email", value: user.email, icon: Mail },
                      { label: "Member Since", value: user.joinedDate, icon: Calendar },
                      { label: "Membership Tier", value: user.tier, icon: Crown },
                    ].map(({ label, value, icon: Icon }) => (
                      <div key={label} className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-3.5 h-3.5 text-slate-400" />
                          <div>
                            <p className="text-[10px] text-slate-400">{label}</p>
                            <p className="text-xs font-semibold text-[#222433]">{value}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                      </div>
                    ))}
                  </div>

                  {/* Settings Links */}
                  <div className="rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                    {[
                      { label: "Notifications", icon: Bell, color: "text-indigo-500" },
                      { label: "Privacy & Security", icon: Shield, color: "text-emerald-500" },
                      { label: "Linked Accounts", icon: Settings, color: "text-slate-500" },
                    ].map(({ label, icon: Icon, color }) => (
                      <button
                        key={label}
                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-3.5 h-3.5 ${color}`} />
                          <span className="text-xs font-medium text-[#222433]">{label}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                      </button>
                    ))}
                  </div>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}

            </div>
          )}
        </div>

        {/* ─── FOOTER (Auth state) ─── */}
        {(mode === "login" || mode === "signup") && (
          <div className="shrink-0 px-5 py-4 bg-slate-50 border-t border-slate-200">
            <div className="flex items-center gap-2 text-[11px] text-slate-500 justify-center">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>Your data is encrypted & secured by SnapTix</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
