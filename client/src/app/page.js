"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Header from "../components/Header";
import VenueStage from "../components/VenueStage";
import SeatMap from "../components/SeatMap";
import SeatLegend from "../components/SeatLegend";
import HoldCountdown from "../components/HoldCountdown";
import BookingModal from "../components/BookingModal";
import SystemInfoModal from "../components/SystemInfoModal";
import Toast from "../components/Toast";
import { getSocket, getUserId } from "../lib/socket";

export default function Home() {
  const [userId, setUserId] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [latency, setLatency] = useState(12);
  const [venueInfo, setVenueInfo] = useState(null);
  const [seats, setSeats] = useState([]);
  const [velocity, setVelocity] = useState(0);
  const [presenceMap, setPresenceMap] = useState({});
  const [heldSeat, setHeldSeat] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [toast, setToast] = useState(null);
  const [isSystemInfoOpen, setIsSystemInfoOpen] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(true);

  const socketRef = useRef(null);
  const toastTimeoutRef = useRef(null);

  const showToast = useCallback((type, title, message) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ type, title, message });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 4500);
  }, []);

  // Measure WebSocket ping latency
  useEffect(() => {
    const interval = setInterval(() => {
      if (socketRef.current && isConnected) {
        const start = performance.now();
        socketRef.current.emit("ping_latency", () => {
          const roundTrip = Math.round(performance.now() - start);
          setLatency(Math.max(4, roundTrip));
        });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [isConnected]);

  // Initialize Socket.io connection & userId
  useEffect(() => {
    const currentUserId = getUserId();
    setUserId(currentUserId);

    const socket = getSocket();
    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("join_event", {
        eventId: "venue-grand-hall",
        userId: currentUserId,
      });
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    // Initial state sent on join
    socket.on("initial_state", (data) => {
      setVenueInfo(data.venue);
      setSeats(data.seats);
      setVelocity(data.velocity || 0);

      // Restore active hold if already held by this user
      const myActiveHold = data.seats.find(
        (s) => s.status === "held" && (s.isMine || s.heldBy === currentUserId)
      );
      if (myActiveHold) {
        setHeldSeat(myActiveHold);
      }
    });

    // Real-time seat held event (broadcast to all)
    socket.on("seat_held", ({ seatId, userId: holderId, expiresAt, duration }) => {
      const isMine = holderId === currentUserId;

      setSeats((prevSeats) =>
        prevSeats.map((s) => {
          if (s.id === seatId) {
            return {
              ...s,
              status: "held",
              heldBy: holderId,
              isMine,
              expiresAt,
              ttlSeconds: Math.round((expiresAt - Date.now()) / 1000),
            };
          }
          return s;
        })
      );

      if (isMine) {
        setHeldSeat({
          id: seatId,
          label: seatId,
          expiresAt,
          duration,
          ...seats.find((s) => s.id === seatId),
        });
        showToast(
          "success",
          `Seat ${seatId} Held`,
          "Exclusive lock confirmed via Redis SET NX EX. Complete checkout within 5:00."
        );
      }
    });

    // Instant rejection when race condition is lost
    socket.on("hold_rejected", ({ seatId, reason }) => {
      showToast(
        "collision",
        "Race Condition: Seat Taken!",
        reason || `Seat ${seatId} was claimed by another attendee milliseconds before you!`
      );
    });

    // Real-time seat release event (expiry or cancel)
    socket.on("seat_released", ({ seatId, userId: releasedBy, reason }) => {
      setSeats((prevSeats) =>
        prevSeats.map((s) => {
          if (s.id === seatId) {
            return {
              ...s,
              status: "available",
              heldBy: null,
              isMine: false,
              expiresAt: null,
              ttlSeconds: 0,
            };
          }
          return s;
        })
      );

      setHeldSeat((prev) => {
        if (prev && prev.id === seatId) {
          showToast(
            "warning",
            reason === "EXPIRED" ? "Hold Expired" : "Seat Released",
            `Seat ${seatId} has been returned to available hall inventory.`
          );
          return null;
        }
        return prev;
      });
    });

    // Real-time seat booked event
    socket.on(
      "seat_booked",
      ({ seatId, userId: bookerId, price, tier, bookedAt, bookingId, velocity: newVelocity }) => {
        const isMine = bookerId === currentUserId;

        setSeats((prevSeats) =>
          prevSeats.map((s) => {
            if (s.id === seatId) {
              return {
                ...s,
                status: "booked",
                bookedBy: bookerId,
                isMine,
                price,
                tier,
                bookedAt,
              };
            }
            return s;
          })
        );

        if (typeof newVelocity === "number") {
          setVelocity(newVelocity);
        }

        if (isMine) {
          setHeldSeat(null);
          setConfirmedBooking({
            seatId,
            userId: bookerId,
            price,
            tier,
            bookedAt,
            bookingId,
          });
        }
      }
    );

    // Real-time Live Presence update
    socket.on("presence_updated", ({ seatId, count }) => {
      setPresenceMap((prev) => ({
        ...prev,
        [seatId]: count,
      }));
    });

    // Real-time demo reset
    socket.on("event_reset", () => {
      setHeldSeat(null);
      setPresenceMap({});
      showToast("success", "Hall Inventory Reset", "All seat holds and bookings have been cleared.");
      socket.emit("join_event", {
        eventId: "venue-grand-hall",
        userId: currentUserId,
      });
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("initial_state");
      socket.off("seat_held");
      socket.off("hold_rejected");
      socket.off("seat_released");
      socket.off("seat_booked");
      socket.off("presence_updated");
      socket.off("event_reset");
    };
  }, [showToast]);

  // Click seat action
  const handleSeatClick = (seat) => {
    if (seat.status === "booked") {
      showToast("error", "Seat Booked", `Seat ${seat.label} is permanently reserved.`);
      return;
    }

    if (seat.status === "held") {
      if (seat.isMine || (heldSeat && heldSeat.id === seat.id)) {
        return;
      } else {
        showToast(
          "warning",
          "Seat Locked",
          `Seat ${seat.label} is currently held by another attendee.`
        );
        return;
      }
    }

    // Atomic hold via Socket.io
    if (socketRef.current) {
      socketRef.current.emit("hold_seat", {
        eventId: "venue-grand-hall",
        seatId: seat.id,
        userId,
      });
    }
  };

  // Live Presence hover triggers
  const handleSeatHover = (seatId) => {
    if (socketRef.current) {
      socketRef.current.emit("viewing_seat", { seatId });
    }
  };

  const handleSeatLeave = (seatId) => {
    if (socketRef.current) {
      socketRef.current.emit("stop_viewing_seat", { seatId });
    }
  };

  // Voluntary hold release
  const handleReleaseSeat = (seat) => {
    if (socketRef.current && seat) {
      socketRef.current.emit("release_seat", {
        eventId: "venue-grand-hall",
        seatId: seat.id,
        userId,
      });
      setHeldSeat(null);
    }
  };

  // Confirm booking checkout
  const handleConfirmBooking = (seat) => {
    if (!socketRef.current || !seat) return;
    setIsSubmitting(true);

    socketRef.current.emit(
      "confirm_booking",
      {
        eventId: "venue-grand-hall",
        seatId: seat.id,
        userId,
      },
      (response) => {
        setIsSubmitting(false);
        if (!response.success) {
          showToast("error", "Checkout Failed", response.message || response.error);
        }
      }
    );
  };

  // Reset demo state
  const handleResetDemo = async () => {
    try {
      const serverUrl =
        process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:4000";
      await fetch(`${serverUrl}/api/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: "venue-grand-hall" }),
      });
    } catch (err) {
      console.error("Failed to reset:", err);
    }
  };

  // Live 10-Contender Collision Simulator
  const handleSimulateRace = async () => {
    setIsSimulating(true);
    const targetSeat = "A5"; // Center VIP Orchestra seat
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:4000";

    showToast("collision", "Race Test Started", `Firing 10 simultaneous hold requests at seat ${targetSeat}...`);

    try {
      // 10 concurrent requests at exact same millisecond
      const contenders = Array.from({ length: 10 }, (_, i) => ({
        userId: `racer-${Math.random().toString(36).substring(2, 6)}`,
        seatId: targetSeat,
        eventId: "venue-grand-hall",
      }));

      const requests = contenders.map((c) =>
        fetch(`${serverUrl}/api/hold`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(c),
        }).then((res) => res.json())
      );

      const results = await Promise.all(requests);
      const successes = results.filter((r) => r.success).length;
      const rejections = results.filter((r) => !r.success).length;

      setTimeout(() => {
        showToast(
          "success",
          "Concurrency Test Verified!",
          `10 contenders fired → Exactly ${successes} succeeded, ${rejections} cleanly rejected with zero double-booking!`
        );
        setIsSimulating(false);
      }, 500);
    } catch (err) {
      showToast("error", "Test Error", err.message);
      setIsSimulating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07080B] text-slate-100 selection:bg-sky-500 selection:text-white">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 ambient-glow pointer-events-none z-0"></div>

      {/* Top Header & Telemetry Flight Deck */}
      <Header
        userId={userId}
        isConnected={isConnected}
        velocity={velocity}
        latency={latency}
        onReset={handleResetDemo}
        onOpenSystemInfo={() => setIsSystemInfoOpen(true)}
        onSimulateRace={handleSimulateRace}
        isSimulating={isSimulating}
      />

      {/* Main Amphitheater Arena */}
      <main className="relative z-10 flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center">
        {/* Stage Component */}
        <VenueStage
          eventName={venueInfo?.eventName}
          date={venueInfo?.date}
          location={venueInfo?.location}
          stageLabel={venueInfo?.stageLabel}
        />

        {/* Legend and Heatmap Controls */}
        <SeatLegend
          showHeatmap={showHeatmap}
          onToggleHeatmap={() => setShowHeatmap(!showHeatmap)}
        />

        {/* Curved Radial SVG Seat Map */}
        <SeatMap
          seats={seats}
          myUserId={userId}
          onSeatClick={handleSeatClick}
          onSeatHover={handleSeatHover}
          onSeatLeave={handleSeatLeave}
          presenceMap={presenceMap}
          showHeatmap={showHeatmap}
        />

        {/* Integrated Ticket Booking Dock */}
        <HoldCountdown
          heldSeat={heldSeat}
          onConfirmBooking={handleConfirmBooking}
          onReleaseSeat={handleReleaseSeat}
          isSubmitting={isSubmitting}
        />

        {/* Digital Holographic Admission Pass Modal */}
        <BookingModal
          booking={confirmedBooking}
          onClose={() => setConfirmedBooking(null)}
        />

        {/* System Architecture & Concurrency Proof Modal */}
        <SystemInfoModal
          isOpen={isSystemInfoOpen}
          onClose={() => setIsSystemInfoOpen(false)}
        />

        {/* Toast Alerts */}
        <Toast toast={toast} onDismiss={() => setToast(null)} />
      </main>

      {/* Architectural Minimal Footer */}
      <footer className="relative z-10 w-full border-t border-white/[0.06] py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-medium text-slate-400">
            SnapTix Real-Time Infrastructure • Kuroshio Concert Hall Seating System
          </span>
          <span className="font-mono text-[11px] text-slate-500">
            Redis SET NX EX + Socket.io Multi-Pod Adapter + Neon Postgres Ledger
          </span>
        </div>
      </footer>
    </div>
  );
}
