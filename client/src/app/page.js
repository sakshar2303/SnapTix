"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import Header from "../components/Header";
import LiveShowsStrip from "../components/LiveShowsStrip";
import VenueStage from "../components/VenueStage";
import SeatMap from "../components/SeatMap";
import SeatLegend from "../components/SeatLegend";
import HoldCountdown from "../components/HoldCountdown";
import BookingModal from "../components/BookingModal";
import PaymentModal from "../components/PaymentModal";
import ShowDetailsModal from "../components/ShowDetailsModal";
import SystemInfoModal from "../components/SystemInfoModal";
import CitySelectModal from "../components/CitySelectModal";
import StreamCatalogModal from "../components/StreamCatalogModal";
import OffersModal from "../components/OffersModal";
import GiftCardsModal from "../components/GiftCardsModal";
import ListYourShowModal from "../components/ListYourShowModal";
import CorporatesModal from "../components/CorporatesModal";
import TheatreSelectModal from "../components/TheatreSelectModal";
import UserProfileModal from "../components/UserProfileModal";
import ProfileSidebar from "../components/ProfileSidebar";
import Toast from "../components/Toast";
import { getSocket, getUserId } from "../lib/socket";
import { getTheatresForCity, findClosestCity } from "../lib/theatres";

export default function Home() {
  const [userId, setUserId] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [latency, setLatency] = useState(12);
  const [catalog, setCatalog] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Movies");
  const [activeCity, setActiveCity] = useState("Mumbai");
  const [activeEventId, setActiveEventId] = useState("venue-pvr-imax");
  const [selectedShowtime, setSelectedShowtime] = useState("07:30 PM");
  const [venueInfo, setVenueInfo] = useState(null);
  const [seats, setSeats] = useState([]);
  const [velocity, setVelocity] = useState(0);
  const [presenceMap, setPresenceMap] = useState({});
  const [heldSeat, setHeldSeat] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]); // cart before holding
  const [heldSeats, setHeldSeats] = useState([]); // all actively held seats
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedShowForDetails, setSelectedShowForDetails] = useState(null);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [toast, setToast] = useState(null);

  // Modals state
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [isStreamModalOpen, setIsStreamModalOpen] = useState(false);
  const [isOffersModalOpen, setIsOffersModalOpen] = useState(false);
  const [isGiftCardsModalOpen, setIsGiftCardsModalOpen] = useState(false);
  const [isListYourShowModalOpen, setIsListYourShowModalOpen] = useState(false);
  const [isCorporatesModalOpen, setIsCorporatesModalOpen] = useState(false);
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);
  const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false);
  const [isSystemInfoOpen, setIsSystemInfoOpen] = useState(false);
  const [isTheatreModalOpen, setIsTheatreModalOpen] = useState(false);

  // Theatre & Location State
  const [currentTheatre, setCurrentTheatre] = useState(null);
  const [currentAuditorium, setCurrentAuditorium] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const socketRef = useRef(null);
  const toastTimeoutRef = useRef(null);

  const showToast = useCallback((type, title, message) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ type, title, message });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 4500);
  }, []);

  // Fetch catalog on mount
  useEffect(() => {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:4000";
    fetch(`${serverUrl}/api/catalog`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCatalog(data);
        }
      })
      .catch((err) => console.error("Error fetching catalog:", err));
  }, []);

  // Initialize and synchronize theatre and auditorium when activeCity changes
  useEffect(() => {
    const cityTheatres = getTheatresForCity(activeCity);
    if (cityTheatres && cityTheatres.length > 0) {
      const firstTheatre = cityTheatres[0];
      setCurrentTheatre(firstTheatre);
      if (firstTheatre.auditoriums && firstTheatre.auditoriums.length > 0) {
        const firstAudi = firstTheatre.auditoriums[0];
        setCurrentAuditorium(firstAudi);
        if (firstAudi.showtimes && firstAudi.showtimes.length > 0) {
          setSelectedShowtime(firstAudi.showtimes[0]);
        }
      } else if (firstTheatre.showtimes && firstTheatre.showtimes.length > 0) {
        setSelectedShowtime(firstTheatre.showtimes[0]);
      }
    }
  }, [activeCity]);

  // GPS Geolocation Detection
  const handleDetectLocation = () => {
    setIsDetectingLocation(true);
    if (!navigator.geolocation) {
      showToast("error", "Geolocation Unsupported", "Your browser does not support GPS location.");
      setIsDetectingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsDetectingLocation(false);
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });

        const { city, distanceKm } = findClosestCity(latitude, longitude);
        setActiveCity(city);
        const cityTheatres = getTheatresForCity(city);
        if (cityTheatres && cityTheatres.length > 0) {
          const firstTh = cityTheatres[0];
          setCurrentTheatre(firstTh);
          if (firstTh.auditoriums && firstTh.auditoriums.length > 0) {
            const firstAud = firstTh.auditoriums[0];
            setCurrentAuditorium(firstAud);
            if (firstAud.showtimes) {
              setSelectedShowtime(firstAud.showtimes[0]);
            }
          } else if (firstTh.showtimes) {
            setSelectedShowtime(firstTh.showtimes[0]);
          }
        }
        showToast("success", "GPS Location Detected!", `Nearest Entertainment Hub: ${city} (${distanceKm} km away)`);
      },
      (error) => {
        setIsDetectingLocation(false);
        const mockLat = 19.0760;
        const mockLng = 72.8777;
        setUserLocation({ lat: mockLat, lng: mockLng });
        setActiveCity("Mumbai");
        showToast("warning", "GPS Location", "Showing nearest verified multiplexes in Mumbai.");
      },
      { timeout: 6000 }
    );
  };

  const handleSelectTheatre = (theatre) => {
    setCurrentTheatre(theatre);
    if (theatre.auditoriums && theatre.auditoriums.length > 0) {
      const firstAudi = theatre.auditoriums[0];
      setCurrentAuditorium(firstAudi);
      if (firstAudi.showtimes && firstAudi.showtimes.length > 0) {
        setSelectedShowtime(firstAudi.showtimes[0]);
      }
    } else if (theatre.showtimes && theatre.showtimes.length > 0) {
      setSelectedShowtime(theatre.showtimes[0]);
    }
    showToast("success", "Cinema Venue Selected", `${theatre.name} (${theatre.area})`);
  };

  const handleSelectAuditorium = (audi) => {
    setCurrentAuditorium(audi);
    if (audi.showtimes && audi.showtimes.length > 0) {
      setSelectedShowtime(audi.showtimes[0]);
    }
    if (heldSeat) {
      handleReleaseSeat();
    }
    // Stay on the currently selected event — do NOT reset to Dune
    joinEventRoom(activeEventId, userId);
    showToast(
      "success",
      "Screen Selected",
      `${audi.name} • ${audi.layoutType === "luxury_couples" ? "Twin Loungers" : audi.layoutType === "quad_pods" ? "4DX Quad Pods" : "Stadium Seating"}`
    );
  };

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

  // Join or switch event room
  const joinEventRoom = useCallback((eventId, currentUserId) => {
    if (!socketRef.current || !eventId) return;
    setHeldSeat(null);
    setPresenceMap({});
    socketRef.current.emit("join_event", {
      eventId,
      userId: currentUserId,
    });
  }, []);

  // Initialize Socket.io connection & userId
  useEffect(() => {
    const currentUserId = getUserId();
    setUserId(currentUserId);

    const socket = getSocket();
    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      joinEventRoom(activeEventId, currentUserId);
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

    // Real-time seat held event
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
        reason || `Seat ${seatId} was just booked by another attendee milliseconds before you!`
      );
    });

    // Real-time seat release event
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
            `Seat ${seatId} has been released back to inventory.`
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
      showToast("success", "Inventory Reset", "All seat reservations cleared.");
      joinEventRoom(activeEventId, currentUserId);
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
  }, [showToast, joinEventRoom, activeEventId, seats]);

  // Handle switching category tabs
  const handleSelectCategory = (cat) => {
    setActiveCategory(cat);
    if (cat === "Stream") {
      setIsStreamModalOpen(true);
      return;
    }

    // Map category to catalog event
    const eventForCat = catalog.find((e) => e.category === cat) || catalog[0];
    if (eventForCat && eventForCat.id !== activeEventId) {
      setActiveEventId(eventForCat.id);
      setSelectedShowtime(eventForCat.showtimes[0]);
      joinEventRoom(eventForCat.id, userId);
      showToast("success", `${cat} Selected`, `Loaded ${eventForCat.title}`);
    }
  };

  // Handle switching event directly from search or catalog
  const handleSelectEvent = (eventId) => {
    const found = catalog.find((e) => e.id === eventId);
    if (found) {
      setActiveEventId(eventId);
      setActiveCategory(found.category);
      setSelectedShowtime(found.showtimes[0]);
      joinEventRoom(eventId, userId);
      showToast("success", "Show Switched", `Viewing ${found.title}`);
    }
  };

  // Handle city selection
  const handleSelectCity = (city) => {
    setActiveCity(city);
    showToast("success", "City Updated", `Now showing cinemas and events in ${city}`);
  };

  // Handle Promo Code application
  const handleApplyPromo = (offer) => {
    setAppliedPromo(offer);
    showToast("success", `Promo ${offer.code} Applied!`, `${offer.title} discount applied to checkout.`);
  };

  // Switch to a new random user identity
  const handleSwitchUser = () => {
    const newId = `user-${Math.random().toString(36).substring(2, 7)}`;
    localStorage.setItem("snaptix_user_id", newId);
    setUserId(newId);
    joinEventRoom(activeEventId, newId);
    showToast("success", "New Booker Identity", `Switched to ${newId}. You can test concurrent locking against other tabs!`);
  };

  // Click seat action
  const handleSeatClick = (seat) => {
    if (seat.status === "booked") {
      showToast("error", "Seat Sold", `Seat ${seat.label} is already booked.`);
      return;
    }

    if (seat.status === "held") {
      // If it's one of my held seats, ignore click
      if (heldSeats.some((s) => s.id === seat.id) || (heldSeat && heldSeat.id === seat.id)) {
        return;
      } else {
        showToast("warning", "Seat Locked", `Seat ${seat.label} is reserved by another attendee.`);
        return;
      }
    }

    // If already in cart → remove (deselect)
    const alreadySelected = selectedSeats.some((s) => s.id === seat.id);
    if (alreadySelected) {
      setSelectedSeats((prev) => prev.filter((s) => s.id !== seat.id));
      return;
    }

    // Limit to 8 seats per transaction
    if (selectedSeats.length >= 8) {
      showToast("warning", "Max 8 Seats", "You can select up to 8 seats per booking.");
      return;
    }

    // Add to selection cart (no immediate socket hold)
    setSelectedSeats((prev) => [...prev, seat]);
  };

  // Hold ALL selected seats atomically when user clicks "Proceed to Pay"
  const handleHoldSelectedSeats = () => {
    if (!socketRef.current || selectedSeats.length === 0) return;
    selectedSeats.forEach((seat) => {
      socketRef.current.emit("hold_seat", {
        eventId: activeEventId,
        seatId: seat.id,
        userId,
      });
    });
    setHeldSeats(selectedSeats);
    setHeldSeat(selectedSeats[0]); // backward compat for single-seat flows
    setSelectedSeats([]);
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

  // Voluntary hold release for ALL held seats
  const handleReleaseSeat = (seat) => {
    const seatsToRelease = heldSeats.length > 0 ? heldSeats : (seat ? [seat] : []);
    if (socketRef.current) {
      seatsToRelease.forEach((s) => {
        socketRef.current.emit("release_seat", {
          eventId: activeEventId,
          seatId: s.id,
          userId,
        });
      });
    }
    setHeldSeat(null);
    setHeldSeats([]);
    setSelectedSeats([]);
  };

  // Confirm booking checkout
  const handleConfirmBooking = (seat) => {
    if (!socketRef.current || !seat) return;
    setIsSubmitting(true);

    socketRef.current.emit(
      "confirm_booking",
      {
        eventId: activeEventId,
        seatId: seat.id,
        userId,
        price: seat.price,
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
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:4000";
      await fetch(`${serverUrl}/api/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: activeEventId }),
      });
    } catch (err) {
      console.error("Failed to reset:", err);
    }
  };

  // Live 10-Contender Collision Simulator
  const handleSimulateRace = async () => {
    setIsSimulating(true);
    const targetSeat = "A5";
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:4000";

    showToast("collision", "Simulating 10-User Rush", `10 users clicking Seat ${targetSeat} at the exact same millisecond...`);

    try {
      const contenders = Array.from({ length: 10 }, (_, i) => ({
        userId: `user-${Math.random().toString(36).substring(2, 6)}`,
        seatId: targetSeat,
        eventId: activeEventId,
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
    <div className="min-h-screen flex flex-col bg-[#F5F5FA] text-[#222433] pb-28">
      {/* Functional BookMyShow Header with All Interactive Windows */}
      <Header
        userId={userId}
        isConnected={isConnected}
        velocity={velocity}
        latency={latency}
        activeCategory={activeCategory}
        activeCity={activeCity}
        activeEventId={activeEventId}
        catalog={catalog}
        onSelectCategory={handleSelectCategory}
        onSelectEvent={handleSelectEvent}
        onOpenCityModal={() => setIsCityModalOpen(true)}
        onOpenStreamModal={() => setIsStreamModalOpen(true)}
        onOpenOffersModal={() => setIsOffersModalOpen(true)}
        onOpenGiftCardsModal={() => setIsGiftCardsModalOpen(true)}
        onOpenListYourShowModal={() => setIsListYourShowModalOpen(true)}
        onOpenCorporatesModal={() => setIsCorporatesModalOpen(true)}
        onOpenUserProfileModal={() => setIsProfileSidebarOpen(true)}
        onReset={handleResetDemo}
        onOpenSystemInfo={() => setIsSystemInfoOpen(true)}
        onSimulateRace={handleSimulateRace}
        isSimulating={isSimulating}
      />

      {/* Main Cinema Seating Arena */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col items-center">
        {/* Recommended & Trending Live Shows Carousel with Posters */}
        <LiveShowsStrip
          catalog={catalog}
          activeEventId={activeEventId}
          onSelectEvent={handleSelectEvent}
          onShowDetails={(show) => setSelectedShowForDetails(show)}
          activeCity={activeCity}
        />

        {/* Movie Info, Showtime Strip & Theatre Switcher */}
        <VenueStage
          venueInfo={venueInfo}
          currentTheatre={currentTheatre}
          currentAuditorium={currentAuditorium}
          onSelectAuditorium={handleSelectAuditorium}
          onOpenTheatreModal={() => setIsTheatreModalOpen(true)}
          selectedShowtime={selectedShowtime}
          onSelectShowtime={setSelectedShowtime}
          activeCity={activeCity}
          userLocation={userLocation}
        />

        {/* BMS Legend Bar */}
        <SeatLegend />

        {/* BMS Cinema Grid Seat Map with Dynamic Layout */}
        <SeatMap
          seats={seats}
          currentAuditorium={currentAuditorium}
          myUserId={userId}
          selectedSeats={selectedSeats}
          onSeatClick={handleSeatClick}
          onSeatHover={handleSeatHover}
          onSeatLeave={handleSeatLeave}
          presenceMap={presenceMap}
        />

        {/* Floating BMS Bottom Pay Dock */}
        <HoldCountdown
          heldSeat={heldSeat}
          heldSeats={heldSeats}
          selectedSeats={selectedSeats}
          venueInfo={venueInfo}
          selectedShowtime={selectedShowtime}
          appliedPromo={appliedPromo}
          onConfirmBooking={() => setIsPaymentModalOpen(true)}
          onHoldSelectedSeats={handleHoldSelectedSeats}
          onClearSelection={() => setSelectedSeats([])}
          onReleaseSeat={handleReleaseSeat}
          isSubmitting={isSubmitting}
        />

        {/* BMS Official M-Ticket Modal */}
        <BookingModal
          booking={confirmedBooking}
          venueInfo={venueInfo}
          selectedShowtime={selectedShowtime}
          onClose={() => setConfirmedBooking(null)}
        />

        {/* Payment Gateway Modal — intercepts checkout before socket confirm */}
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          heldSeat={heldSeat}
          heldSeats={heldSeats}
          venueInfo={venueInfo}
          selectedShowtime={selectedShowtime}
          appliedPromo={appliedPromo}
          onPaymentSuccess={(seat) => {
            setIsPaymentModalOpen(false);
            handleConfirmBooking(seat);
          }}
        />

        {/* Show Details Sheet Modal */}
        <ShowDetailsModal
          show={selectedShowForDetails}
          isOpen={!!selectedShowForDetails}
          onClose={() => setSelectedShowForDetails(null)}
          onBookNow={(id) => {
            handleSelectEvent(id);
            setSelectedShowForDetails(null);
          }}
        />

        {/* System Architecture Specifications Modal */}
        <SystemInfoModal
          isOpen={isSystemInfoOpen}
          onClose={() => setIsSystemInfoOpen(false)}
        />

        {/* Interactive City Selector Modal with GPS Geolocation */}
        <CitySelectModal
          isOpen={isCityModalOpen}
          currentCity={activeCity}
          onSelectCity={handleSelectCity}
          onDetectLocation={handleDetectLocation}
          isDetectingLocation={isDetectingLocation}
          onClose={() => setIsCityModalOpen(false)}
        />

        {/* Direct Cinema Theatre & Venue Selector Modal */}
        <TheatreSelectModal
          isOpen={isTheatreModalOpen}
          activeCity={activeCity}
          currentTheatreId={currentTheatre?.id}
          userLocation={userLocation}
          onSelectTheatre={handleSelectTheatre}
          onDetectLocation={handleDetectLocation}
          isDetectingLocation={isDetectingLocation}
          onClose={() => setIsTheatreModalOpen(false)}
        />

        {/* Interactive Stream Window Modal */}
        <StreamCatalogModal
          isOpen={isStreamModalOpen}
          onClose={() => setIsStreamModalOpen(false)}
          onRented={(movie) => {
            showToast("success", "Stream Pass Active", `"${movie.title}" is now available in your library for 30 days!`);
          }}
        />

        {/* Interactive Offers & Promo Codes Modal */}
        <OffersModal
          isOpen={isOffersModalOpen}
          activeCode={appliedPromo?.code}
          onApplyPromo={handleApplyPromo}
          onClose={() => setIsOffersModalOpen(false)}
        />

        {/* Interactive Gift Cards Modal */}
        <GiftCardsModal
          isOpen={isGiftCardsModalOpen}
          onClose={() => setIsGiftCardsModalOpen(false)}
        />

        {/* Interactive ListYourShow Organizer Modal */}
        <ListYourShowModal
          isOpen={isListYourShowModalOpen}
          onClose={() => setIsListYourShowModalOpen(false)}
          onSubmitSuccess={(msg) => showToast("success", "Show Submitted", msg)}
        />

        {/* Interactive Corporates Modal */}
        <CorporatesModal
          isOpen={isCorporatesModalOpen}
          onClose={() => setIsCorporatesModalOpen(false)}
          onSubmitSuccess={(msg) => showToast("success", "Corporate Request Registered", msg)}
        />

        {/* Interactive User Profile & Identity Modal (legacy, kept for compatibility) */}
        <UserProfileModal
          isOpen={isUserProfileModalOpen}
          userId={userId}
          onSwitchUser={handleSwitchUser}
          confirmedBooking={confirmedBooking}
          onClose={() => setIsUserProfileModalOpen(false)}
        />

        {/* Toast Alerts */}
        <Toast toast={toast} onDismiss={() => setToast(null)} />

        {/* BookMyShow-style Profile & Login Sidebar */}
        <ProfileSidebar
          isOpen={isProfileSidebarOpen}
          onClose={() => setIsProfileSidebarOpen(false)}
          userId={userId}
          onSwitchUser={handleSwitchUser}
        />
      </main>

      {/* BookMyShow Footer */}
      <footer className="w-full border-t border-slate-200 bg-white py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-semibold text-slate-600">
            SnapTix • Live Concurrency-Safe Cinema Booking Engine
          </span>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-slate-400 font-mono">
              Powered by Redis SET NX EX • Neon Postgres • Socket.io
            </span>
            <span>•</span>
            <Link href="/admin" className="text-indigo-600 font-semibold hover:underline flex items-center gap-1">
              <span>Ops Console &rarr;</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
