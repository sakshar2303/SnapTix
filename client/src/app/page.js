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
  const [venueInfo, setVenueInfo] = useState(null);
  const [seats, setSeats] = useState([]);
  const [velocity, setVelocity] = useState(0);
  const [presenceMap, setPresenceMap] = useState({});
  const [heldSeat, setHeldSeat] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Initialize Socket.io connection & userId
  useEffect(() => {
    const currentUserId = getUserId();
    setUserId(currentUserId);

    const socket = getSocket();
    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      console.log("Connected to SnapTix Realtime Cluster:", socket.id);
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
          `Seat ${seatId} Held!`,
          "Seat locked for 5 minutes. Complete checkout to finalize."
        );
      }
    });

    // Instant rejection when race condition is lost
    socket.on("hold_rejected", ({ seatId, reason }) => {
      showToast(
        "collision",
        "Race Condition: Seat Taken!",
        reason || `Seat ${seatId} was just claimed by another user milliseconds before you!`
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
            `Seat ${seatId} is now back in available inventory.`
          );
          return null;
        }
        return prev;
      });
    });

    // Real-time seat booked event
    socket.on("seat_booked", ({ seatId, userId: bookerId, price, tier, bookedAt, bookingId, velocity: newVelocity }) => {
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
    });

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
      showToast("success", "Demo Reset", "All seat holds and states have been reset.");
      // Re-fetch state
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
      showToast("error", "Unavailable", `Seat ${seat.label} has already been permanently booked.`);
      return;
    }

    if (seat.status === "held") {
      if (seat.isMine || (heldSeat && heldSeat.id === seat.id)) {
        // Already held by this user, focus checkout
        return;
      } else {
        showToast(
          "warning",
          "Seat Reserved",
          `Seat ${seat.label} is currently reserved by another attendee.`
        );
        return;
      }
    }

    // Attempt to acquire atomic hold via Redis SET NX EX
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

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Top Navigation */}
      <Header
        userId={userId}
        isConnected={isConnected}
        velocity={velocity}
        onReset={handleResetDemo}
        onOpenSystemInfo={() => setIsSystemInfoOpen(true)}
      />

      {/* Main Seat Map Arena */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center">
        {/* Stage Component */}
        <VenueStage
          eventName={venueInfo?.eventName}
          date={venueInfo?.date}
          stageLabel={venueInfo?.stageLabel}
        />

        {/* Legend and Heatmap Controls */}
        <SeatLegend
          showHeatmap={showHeatmap}
          onToggleHeatmap={() => setShowHeatmap(!showHeatmap)}
        />

        {/* SVG Interactive Seat Map */}
        <SeatMap
          seats={seats}
          myUserId={userId}
          onSeatClick={handleSeatClick}
          onSeatHover={handleSeatHover}
          onSeatLeave={handleSeatLeave}
          presenceMap={presenceMap}
          showHeatmap={showHeatmap}
        />

        {/* Floating Hold Countdown Bar */}
        <HoldCountdown
          heldSeat={heldSeat}
          onConfirmBooking={handleConfirmBooking}
          onReleaseSeat={handleReleaseSeat}
          isSubmitting={isSubmitting}
        />

        {/* Booking Confirmation Pass Modal */}
        <BookingModal
          booking={confirmedBooking}
          onClose={() => setConfirmedBooking(null)}
        />

        {/* System Architecture & Concurrency Proof Modal */}
        <SystemInfoModal
          isOpen={isSystemInfoOpen}
          onClose={() => setIsSystemInfoOpen(false)}
        />

        {/* Real-time Event Toast */}
        <Toast toast={toast} onDismiss={() => setToast(null)} />
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>SnapTix • Distributed Real-Time Seat Allocation Engine</span>
          <span className="font-mono">Redis SET NX EX + Socket.io Cluster Adapter + Postgres Ledger</span>
        </div>
      </footer>
    </div>
  );
}
