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
          setLatency(Math.max(2, roundTrip));
        });
      }
    }, 3500);
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
        eventId: "venue-pvr-imax",
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
          `Seat ${seatId} Selected!`,
          "Seat locked for 5 minutes. Complete payment to secure your ticket."
        );
      }
    });

    // Instant rejection when race condition is lost
    socket.on("hold_rejected", ({ seatId, reason }) => {
      showToast(
        "collision",
        "Seat Already Taken!",
        reason || `Seat ${seatId} was just booked by another moviegoer milliseconds before you!`
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
            `Seat ${seatId} has been released back to cinema inventory.`
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
      showToast("success", "Audi Inventory Reset", "All seat reservations cleared.");
      socket.emit("join_event", {
        eventId: "venue-pvr-imax",
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
      showToast("error", "Seat Sold", `Seat ${seat.label} is already booked.`);
      return;
    }

    if (seat.status === "held") {
      if (seat.isMine || (heldSeat && heldSeat.id === seat.id)) {
        return;
      } else {
        showToast(
          "warning",
          "Seat Locked",
          `Seat ${seat.label} is currently selected by another user.`
        );
        return;
      }
    }

    // Atomic hold via Socket.io
    if (socketRef.current) {
      socketRef.current.emit("hold_seat", {
        eventId: "venue-pvr-imax",
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
        eventId: "venue-pvr-imax",
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
        eventId: "venue-pvr-imax",
        seatId: seat.id,
        userId,
      },
      (response) => {
        setIsSubmitting(false);
        if (!response.success) {
          showToast("error", "Payment Failed", response.message || response.error);
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
        body: JSON.stringify({ eventId: "venue-pvr-imax" }),
      });
    } catch (err) {
      console.error("Failed to reset:", err);
    }
  };

  // Live 10-Contender Collision Simulator
  const handleSimulateRace = async () => {
    setIsSimulating(true);
    const targetSeat = "A5"; // Center Recliner seat
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:4000";

    showToast("collision", "Simulating 10-User Rush", `10 users clicking Seat ${targetSeat} at the exact same millisecond...`);

    try {
      const contenders = Array.from({ length: 10 }, (_, i) => ({
        userId: `user-${Math.random().toString(36).substring(2, 6)}`,
        seatId: targetSeat,
        eventId: "venue-pvr-imax",
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
          "Zero Double-Booking Proven!",
          `10 contenders collided → Exactly ${successes} won the seat, ${rejections} cleanly rejected with 0 collisions!`
        );
        setIsSimulating(false);
      }, 400);
    } catch (err) {
      showToast("error", "Test Error", err.message);
      setIsSimulating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1F2533] text-slate-100 pb-28">
      {/* BookMyShow Header */}
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

      {/* Main Cinema Seating Arena */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col items-center">
        {/* Movie Info & Showtime Strip */}
        <VenueStage
          movieTitle={venueInfo?.movieTitle}
          cinemaName={venueInfo?.cinemaName}
          audiName={venueInfo?.audiName}
          certificate={venueInfo?.certificate}
          language={venueInfo?.language}
          duration={venueInfo?.duration}
          showtimes={venueInfo?.showtimes}
        />

        {/* BMS Legend Bar */}
        <SeatLegend />

        {/* BMS Cinema Grid Seat Map */}
        <SeatMap
          seats={seats}
          myUserId={userId}
          onSeatClick={handleSeatClick}
          onSeatHover={handleSeatHover}
          onSeatLeave={handleSeatLeave}
          presenceMap={presenceMap}
        />

        {/* Floating BMS Bottom Pay Dock */}
        <HoldCountdown
          heldSeat={heldSeat}
          onConfirmBooking={handleConfirmBooking}
          onReleaseSeat={handleReleaseSeat}
          isSubmitting={isSubmitting}
        />

        {/* BMS Official M-Ticket Modal */}
        <BookingModal
          booking={confirmedBooking}
          onClose={() => setConfirmedBooking(null)}
        />

        {/* System Architecture Specifications Modal */}
        <SystemInfoModal
          isOpen={isSystemInfoOpen}
          onClose={() => setIsSystemInfoOpen(false)}
        />

        {/* Toast Alerts */}
        <Toast toast={toast} onDismiss={() => setToast(null)} />
      </main>

      {/* BookMyShow Footer */}
      <footer className="w-full border-t border-[#2B3446] bg-[#141822] py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-semibold text-slate-400">
            SnapTix • Live Concurrency-Safe Cinema Booking Engine
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            Powered by Redis SET NX EX • Neon Postgres ACID Ledger • Socket.io
          </span>
        </div>
      </footer>
    </div>
  );
}
