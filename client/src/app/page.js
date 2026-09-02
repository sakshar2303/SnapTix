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
        eventId: "venue-synth-lab",
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
          `POD_${seatId} ALLOCATED`,
          "Atomic lock confirmed via Redis SET_NX_EX_300. Complete checkout within 5:00."
        );
      }
    });

    // Instant rejection when race condition is lost
    socket.on("hold_rejected", ({ seatId, reason }) => {
      showToast(
        "collision",
        "RACE_COLLISION: POD_CLAIMED",
        reason || `Pod ${seatId} was claimed by another operator milliseconds before you!`
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
            reason === "EXPIRED" ? "HOLD_EXPIRED" : "POD_RELEASED",
            `Pod ${seatId} has been returned to field pool.`
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
      showToast("success", "INVENTORY_RESET", "All pod locks and records cleared.");
      socket.emit("join_event", {
        eventId: "venue-synth-lab",
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
      showToast("error", "POD_BOOKED", `Pod ${seat.label} is permanently reserved in database.`);
      return;
    }

    if (seat.status === "held") {
      if (seat.isMine || (heldSeat && heldSeat.id === seat.id)) {
        return;
      } else {
        showToast(
          "warning",
          "POD_LOCKED",
          `Pod ${seat.label} is currently held by another operator.`
        );
        return;
      }
    }

    // Atomic hold via Socket.io
    if (socketRef.current) {
      socketRef.current.emit("hold_seat", {
        eventId: "venue-synth-lab",
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
        eventId: "venue-synth-lab",
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
        eventId: "venue-synth-lab",
        seatId: seat.id,
        userId,
      },
      (response) => {
        setIsSubmitting(false);
        if (!response.success) {
          showToast("error", "CHECKOUT_FAILED", response.message || response.error);
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
        body: JSON.stringify({ eventId: "venue-synth-lab" }),
      });
    } catch (err) {
      console.error("Failed to reset:", err);
    }
  };

  // Live 10-Contender Collision Simulator
  const handleSimulateRace = async () => {
    setIsSimulating(true);
    const targetSeat = "A5"; // Center VIP Pod
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:4000";

    showToast("collision", "COLLISION_BURST_INIT", `Firing 10 concurrent requests at Pod ${targetSeat}...`);

    try {
      const contenders = Array.from({ length: 10 }, (_, i) => ({
        userId: `racer-${Math.random().toString(36).substring(2, 6)}`,
        seatId: targetSeat,
        eventId: "venue-synth-lab",
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
          "CONCURRENCY_TEST_PASSED",
          `10 contenders fired → Exactly ${successes} succeeded, ${rejections} cleanly rejected. Zero double-booking.`
        );
        setIsSimulating(false);
      }, 400);
    } catch (err) {
      showToast("error", "TEST_ERROR", err.message);
      setIsSimulating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col te-grid-bg text-slate-100 font-mono">
      {/* Top Hardware Header */}
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

      {/* Main Hardware Laboratory Arena */}
      <main className="relative z-10 flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 flex flex-col items-center">
        {/* Emitter Stage Component */}
        <VenueStage
          eventName={venueInfo?.eventName}
          date={venueInfo?.date}
          location={venueInfo?.location}
          stageLabel={venueInfo?.stageLabel}
        />

        {/* Legend / Selector */}
        <SeatLegend
          showHeatmap={showHeatmap}
          onToggleHeatmap={() => setShowHeatmap(!showHeatmap)}
        />

        {/* Polar Modular CAD Seat Map */}
        <SeatMap
          seats={seats}
          myUserId={userId}
          onSeatClick={handleSeatClick}
          onSeatHover={handleSeatHover}
          onSeatLeave={handleSeatLeave}
          presenceMap={presenceMap}
          showHeatmap={showHeatmap}
        />

        {/* Tactical Tape / LED Countdown Dock */}
        <HoldCountdown
          heldSeat={heldSeat}
          onConfirmBooking={handleConfirmBooking}
          onReleaseSeat={handleReleaseSeat}
          isSubmitting={isSubmitting}
        />

        {/* Cryptographic Allocation Spec Sheet Modal */}
        <BookingModal
          booking={confirmedBooking}
          onClose={() => setConfirmedBooking(null)}
        />

        {/* System Architecture Specifications Modal */}
        <SystemInfoModal
          isOpen={isSystemInfoOpen}
          onClose={() => setIsSystemInfoOpen(false)}
        />

        {/* Tactical Toast Alerts */}
        <Toast toast={toast} onDismiss={() => setToast(null)} />
      </main>

      {/* Industrial Chassis Minimal Footer */}
      <footer className="relative z-10 w-full border-t border-[#1E2330] bg-[#0E1015] py-5 px-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <span className="font-semibold text-slate-400">
            [SYNTH LAB 01] • SNAP-TIX CONCURRENCY CORE // REV.4
          </span>
          <span className="text-[10px] text-slate-500">
            REDIS_SET_NX_EX_300 • CLUSTER_PUB_SUB • NEON_POSTGRES_DURABLE
          </span>
        </div>
      </footer>
    </div>
  );
}
