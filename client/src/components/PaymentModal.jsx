"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  Lock,
  Shield,
  ChevronRight,
  Check,
  Tag,
  AlertCircle,
  Clock,
  Zap,
  ArrowLeft,
} from "lucide-react";

const PAYMENT_METHODS = [
  {
    id: "upi",
    label: "UPI",
    icon: Smartphone,
    desc: "GPay, PhonePe, Paytm, BHIM",
    color: "#00b9f5",
    badge: "Instant",
  },
  {
    id: "card",
    label: "Credit / Debit Card",
    icon: CreditCard,
    desc: "Visa, Mastercard, RuPay, Amex",
    color: "#F84464",
    badge: null,
  },
  {
    id: "wallet",
    label: "SnapTix Wallet",
    icon: Wallet,
    desc: "Balance: ₹340 Available",
    color: "#2DC44D",
    badge: "No OTP",
  },
  {
    id: "netbanking",
    label: "Net Banking",
    icon: Building2,
    desc: "50+ major banks supported",
    color: "#8b5cf6",
    badge: null,
  },
];

const UPI_APPS = [
  { id: "gpay", label: "GPay", color: "#4285F4" },
  { id: "phonepe", label: "PhonePe", color: "#5f259f" },
  { id: "paytm", label: "Paytm", color: "#00BAF2" },
  { id: "bhim", label: "BHIM", color: "#FF6B35" },
];

const CONVENIENCE_FEE = 23;

export default function PaymentModal({
  isOpen,
  onClose,
  heldSeat,
  venueInfo,
  selectedShowtime,
  appliedPromo,
  onPaymentSuccess, // called with seat data after payment succeeds
}) {
  const [selectedMethod, setSelectedMethod] = useState("upi");
  const [selectedUpiApp, setSelectedUpiApp] = useState("gpay");
  const [upiId, setUpiId] = useState("");
  const [upiMode, setUpiMode] = useState("app"); // 'app' | 'id'
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [step, setStep] = useState("method"); // 'method' | 'processing' | 'otp'
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [formError, setFormError] = useState("");

  // Countdown for OTP
  useEffect(() => {
    if (step !== "otp") return;
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(timer); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

  if (!isOpen || !heldSeat) return null;

  const basePrice = heldSeat.price || 0;
  const promoDiscount = appliedPromo
    ? appliedPromo.code === "SNAP20"
      ? Math.round(basePrice * 0.2)
      : appliedPromo.code === "HDFC15"
      ? 150
      : 50
    : 0;
  const subtotal = Math.max(0, basePrice - promoDiscount);
  const total = subtotal + CONVENIENCE_FEE;

  // Format card number with spaces
  const formatCard = (val) =>
    val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  // Format expiry MM/YY
  const formatExpiry = (val) => {
    const cleaned = val.replace(/\D/g, "").slice(0, 4);
    return cleaned.length > 2 ? `${cleaned.slice(0, 2)}/${cleaned.slice(2)}` : cleaned;
  };

  const handleOtpChange = (index, val) => {
    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);
    if (val && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const validateAndProceed = () => {
    setFormError("");
    if (selectedMethod === "upi") {
      if (upiMode === "id" && !upiId.includes("@")) {
        setFormError("Enter a valid UPI ID (e.g. name@okicici)");
        return;
      }
    } else if (selectedMethod === "card") {
      if (cardNumber.replace(/\s/g, "").length < 16) {
        setFormError("Enter a valid 16-digit card number.");
        return;
      }
      if (cardExpiry.length < 5) {
        setFormError("Enter card expiry in MM/YY format.");
        return;
      }
      if (cardCvv.length < 3) {
        setFormError("Enter a valid 3-digit CVV.");
        return;
      }
      if (!cardName.trim()) {
        setFormError("Enter the name as on card.");
        return;
      }
    }

    // Simulate going to OTP
    setStep("otp");
    setCountdown(30);
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
  };

  const handleVerifyOtp = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      setOtpError("Enter the full 6-digit OTP.");
      return;
    }
    if (code !== "123456" && code !== "000000") {
      // For demo, accept any 6-digit input
    }
    setProcessing(true);
    setStep("processing");
    await new Promise((r) => setTimeout(r, 1800));
    setProcessing(false);
    onPaymentSuccess({ ...heldSeat, price: total });
  };

  // Wallet — instant, no OTP
  const handleWalletPay = async () => {
    setProcessing(true);
    setStep("processing");
    await new Promise((r) => setTimeout(r, 1400));
    setProcessing(false);
    onPaymentSuccess({ ...heldSeat, price: total });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">

        {/* Header */}
        <div className="bg-[#333545] px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {step === "otp" && (
              <button
                onClick={() => { setStep("method"); setOtpError(""); }}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <p className="text-white font-bold text-sm">
                {step === "processing" ? "Processing Payment…" : step === "otp" ? "Verify Payment" : "Complete Payment"}
              </p>
              <p className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                <Lock className="w-3 h-3 text-emerald-400" />
                256-bit SSL encrypted & PCI-DSS compliant
              </p>
            </div>
          </div>
          {step === "method" && (
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Processing Spinner */}
        {step === "processing" && (
          <div className="flex-1 flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-16 h-16 rounded-full border-4 border-[#F84464]/20 border-t-[#F84464] animate-spin mb-6"></div>
            <p className="font-black text-[#222433] text-lg">Confirming your booking</p>
            <p className="text-slate-500 text-sm mt-1">Securing seat {heldSeat.id} via Redis atomic lock…</p>
            <div className="mt-6 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-xs text-slate-600 font-medium">WebSocket commit in progress</span>
            </div>
          </div>
        )}

        {/* OTP Verification Screen */}
        {step === "otp" && (
          <div className="flex-1 overflow-y-auto">
            <div className="p-5 space-y-5">
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center mx-auto mb-3">
                  <Smartphone className="w-6 h-6 text-indigo-600" />
                </div>
                <p className="font-bold text-[#222433]">Enter OTP</p>
                <p className="text-slate-500 text-xs mt-1">
                  A 6-digit OTP has been sent to your registered mobile number.<br />
                  <span className="text-slate-400">(Demo hint: any 6 digits work)</span>
                </p>
              </div>

              {/* OTP Boxes */}
              <div className="flex gap-2 justify-center">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-11 h-12 text-center text-xl font-black text-[#222433] rounded-xl border-2 border-slate-200 focus:border-[#F84464] focus:outline-none transition bg-white shadow-xs"
                  />
                ))}
              </div>

              {otpError && (
                <p className="text-center text-xs text-red-600 flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {otpError}
                </p>
              )}

              <div className="flex items-center justify-center gap-1 text-xs text-slate-500">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {countdown > 0
                    ? `Resend OTP in ${countdown}s`
                    : <button className="text-[#F84464] font-semibold cursor-pointer" onClick={() => setCountdown(30)}>Resend OTP</button>}
                </span>
              </div>

              {/* Order Summary mini */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between font-medium text-slate-700">
                  <span>{venueInfo?.title} — Seat {heldSeat.id}</span>
                  <span>₹{basePrice}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Promo ({appliedPromo.code})</span>
                    <span>−₹{promoDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>Convenience Fee</span>
                  <span>₹{CONVENIENCE_FEE}</span>
                </div>
                <div className="flex justify-between font-black text-[#222433] border-t border-slate-200 pt-1.5 mt-1">
                  <span>Total Paid</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <button
                onClick={handleVerifyOtp}
                className="w-full py-3 rounded-xl bg-[#F84464] hover:bg-[#e03254] text-white font-bold text-sm transition shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" /> Verify & Confirm Booking
              </button>
            </div>
          </div>
        )}

        {/* Main Payment Method Screen */}
        {step === "method" && (
          <div className="flex-1 overflow-y-auto">
            <div className="p-5 space-y-4">

              {/* Booking Summary Bar */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#333545] text-white text-xs">
                <div>
                  <p className="font-bold text-sm">{venueInfo?.title}</p>
                  <p className="text-slate-400 mt-0.5">
                    Seat <span className="text-white font-mono font-black">{heldSeat.id}</span> • {heldSeat.tier} • {selectedShowtime}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] text-slate-400">Amount Due</p>
                  <p className="font-black text-lg text-[#F84464]">₹{total}</p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs px-1">
                <div className="flex justify-between text-slate-600">
                  <span>Base Ticket Price</span>
                  <span>₹{basePrice}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" /> {appliedPromo.code}
                    </span>
                    <span>−₹{promoDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>Convenience Fee</span>
                  <span>₹{CONVENIENCE_FEE}</span>
                </div>
                <div className="flex justify-between font-black text-[#222433] border-t border-slate-200 pt-1.5">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <p className="text-xs font-black text-[#222433]">Choose Payment Method</p>
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border-2 transition cursor-pointer text-left ${
                      selectedMethod === method.id
                        ? "border-[#F84464] bg-[#F84464]/5"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${method.color}15` }}
                      >
                        <method.icon className="w-4.5 h-4.5" style={{ color: method.color }} />
                      </div>
                      <div>
                        <p className="font-bold text-xs text-[#222433] flex items-center gap-2">
                          {method.label}
                          {method.badge && (
                            <span
                              className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                              style={{ backgroundColor: `${method.color}20`, color: method.color }}
                            >
                              {method.badge}
                            </span>
                          )}
                        </p>
                        <p className="text-[11px] text-slate-500">{method.desc}</p>
                      </div>
                    </div>
                    <div
                      className={`w-4.5 h-4.5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                        selectedMethod === method.id
                          ? "border-[#F84464] bg-[#F84464]"
                          : "border-slate-300"
                      }`}
                    >
                      {selectedMethod === method.id && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* UPI Form */}
              {selectedMethod === "upi" && (
                <div className="space-y-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setUpiMode("app")}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        upiMode === "app" ? "bg-[#333545] text-white" : "bg-white text-slate-600 border border-slate-200"
                      }`}
                    >
                      UPI App
                    </button>
                    <button
                      onClick={() => setUpiMode("id")}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        upiMode === "id" ? "bg-[#333545] text-white" : "bg-white text-slate-600 border border-slate-200"
                      }`}
                    >
                      UPI ID
                    </button>
                  </div>

                  {upiMode === "app" ? (
                    <div className="grid grid-cols-4 gap-2">
                      {UPI_APPS.map((app) => (
                        <button
                          key={app.id}
                          onClick={() => setSelectedUpiApp(app.id)}
                          className={`p-2 rounded-xl flex flex-col items-center gap-1 border-2 transition cursor-pointer ${
                            selectedUpiApp === app.id ? "border-[#F84464] bg-white shadow-sm" : "border-slate-200 bg-white"
                          }`}
                        >
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-black"
                            style={{ backgroundColor: app.color }}
                          >
                            {app.label[0]}
                          </div>
                          <span className="text-[10px] font-medium text-slate-700">{app.label}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <input
                      type="text"
                      placeholder="Enter UPI ID (e.g. name@okicici)"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-xs text-[#222433] placeholder:text-slate-400 focus:outline-none focus:border-[#F84464] transition bg-white"
                    />
                  )}
                </div>
              )}

              {/* Card Form */}
              {selectedMethod === "card" && (
                <div className="space-y-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <input
                    type="text"
                    placeholder="Card Number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCard(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-xs text-[#222433] font-mono placeholder:text-slate-400 focus:outline-none focus:border-[#F84464] transition bg-white"
                  />
                  <div className="grid grid-cols-2 gap-2.5">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-xs text-[#222433] font-mono placeholder:text-slate-400 focus:outline-none focus:border-[#F84464] transition bg-white"
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-xs text-[#222433] font-mono placeholder:text-slate-400 focus:outline-none focus:border-[#F84464] transition bg-white"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Name on Card"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-xs text-[#222433] placeholder:text-slate-400 focus:outline-none focus:border-[#F84464] transition bg-white"
                  />
                </div>
              )}

              {/* Wallet */}
              {selectedMethod === "wallet" && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-emerald-800">SnapTix Wallet — ₹340 Available</p>
                    <p className="text-[11px] text-emerald-600 mt-0.5">
                      ✓ Sufficient balance for ₹{total} payment. No OTP needed.
                    </p>
                  </div>
                </div>
              )}

              {/* NetBanking */}
              {selectedMethod === "netbanking" && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <p className="text-[11px] text-slate-500">Select your bank</p>
                  <div className="grid grid-cols-3 gap-2">
                    {["SBI", "HDFC", "ICICI", "Axis", "Kotak", "PNB"].map((bank) => (
                      <button
                        key={bank}
                        className="py-2 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:border-[#F84464] hover:text-[#F84464] transition cursor-pointer text-center"
                      >
                        {bank}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {formError && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Pay CTA */}
              <button
                onClick={selectedMethod === "wallet" ? handleWalletPay : validateAndProceed}
                className="w-full py-3.5 rounded-2xl bg-[#F84464] hover:bg-[#e03254] text-white font-black text-sm transition shadow-lg cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                {selectedMethod === "wallet"
                  ? `Pay ₹${total} from Wallet`
                  : `Pay ₹${total} Securely →`}
              </button>

              {/* Security Footer */}
              <div className="flex items-center justify-center gap-3 text-[10px] text-slate-400 pt-1">
                <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-emerald-500" /> PCI DSS</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Lock className="w-3 h-3 text-blue-500" /> 256-bit SSL</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-amber-500" /> Instant Confirm</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
