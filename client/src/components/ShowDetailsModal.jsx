"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Star,
  Clock,
  Globe,
  Calendar,
  MapPin,
  Play,
  Ticket,
  ChevronRight,
  Film,
  Music,
  Trophy,
  Heart,
  Share2,
  ThumbsUp,
  Users,
  Zap,
} from "lucide-react";

// Rich supplemental metadata per event category
const SHOW_METADATA = {
  Movies: {
    castLabel: "Cast",
    directorLabel: "Director",
    synopsisLabel: "About the Film",
  },
  Events: {
    castLabel: "Artists",
    directorLabel: "Organiser",
    synopsisLabel: "About the Event",
  },
  Plays: {
    castLabel: "Cast & Crew",
    directorLabel: "Director",
    synopsisLabel: "Synopsis",
  },
  Sports: {
    castLabel: "Teams",
    directorLabel: "Venue Authority",
    synopsisLabel: "Match Preview",
  },
  Activities: {
    castLabel: "Highlights",
    directorLabel: "Organiser",
    synopsisLabel: "What to Expect",
  },
};

// Per-event rich content
const SHOW_DETAILS = {
  "venue-pvr-imax": {
    director: "Denis Villeneuve",
    cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Austin Butler", "Florence Pugh"],
    synopsis:
      "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he must prevent a terrible future only he can foresee.",
    trailerUrl: "#",
    awards: ["BAFTA Nominated", "VES Award Winner"],
    extraTags: ["Visually Stunning", "Epic Scope", "Must-See IMAX"],
  },
  "venue-interstellar": {
    director: "Christopher Nolan",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain", "Michael Caine"],
    synopsis:
      "Earth's future is bleak. Former NASA pilot Cooper is recruited to join an expedition through a recently discovered wormhole in search of another habitable world for humanity — a journey across time, space, and gravity.",
    awards: ["Academy Award Winner (Visual Effects)", "Sound Mixing", "2 BAFTAs"],
    extraTags: ["Mind-Bending", "Emotional", "Space Epic", "10th Anniversary"],
  },
  "venue-coldplay": {
    director: "Phil Harvey (Promoter)",
    cast: ["Chris Martin", "Guy Berryman", "Jonny Buckland", "Will Champion"],
    synopsis:
      "One of the world's biggest live acts brings their record-breaking Music of the Spheres World Tour to India. Featuring LED wristbands, kinetic confetti cannons, massive stage sets, and 30+ hit songs spanning their 25-year career.",
    awards: ["Brit Award", "Grammy Winner", "Biggest Tour 2024"],
    extraTags: ["LED Wristbands", "Fireworks", "3-Hour Show", "Fan Favourites"],
  },
  "venue-ncpa-play": {
    director: "Feroz Abbas Khan",
    cast: ["Kiran Kumar", "Nivedita Saraf", "Anup Soni", "Priyanka Barve"],
    synopsis:
      "India's most spectacular musical — the legendary Mughal-e-Azam reimagined as a Broadway-grade stage musical. 100+ performers, live symphony orchestra, hand-crafted sets, and period costumes recreate the romance of Salim and Anarkali.",
    awards: ["National Award", "Critics Choice Mumbai"],
    extraTags: ["Live Symphony", "100+ Artists", "Costume Drama"],
  },
  "venue-ipl-wankhede": {
    director: "BCCI / Mumbai Cricket Association",
    cast: ["Rohit Sharma", "Hardik Pandya", "Jasprit Bumrah", "MS Dhoni", "Ruturaj Gaikwad"],
    synopsis:
      "The biggest rivalry in T20 cricket! Mumbai Indians take on Chennai Super Kings at the iconic Wankhede Stadium in a marquee IPL clash. Two powerhouse squads, passionate fans, and the electrifying atmosphere of Mumbai's biggest cricket ground.",
    awards: ["IPL Marquee Fixture", "Sold Out in 11 Minutes"],
    extraTags: ["Night Match", "Live Cricket", "Fan Zone", "Fireworks"],
  },
};

const DEFAULT_DETAIL = {
  director: "Production Team",
  cast: ["World-Class Artists", "Live Performers"],
  synopsis: "A world-class live entertainment experience not to be missed. Join thousands of fans for an unforgettable event.",
  awards: [],
  extraTags: ["Live Experience", "Must Attend"],
};

export default function ShowDetailsModal({ show, isOpen, onClose, onBookNow }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 4000) + 800);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!isOpen || !show) return null;

  const detail = SHOW_DETAILS[show.id] || DEFAULT_DETAIL;
  const meta = SHOW_METADATA[show.category] || SHOW_METADATA.Movies;

  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const minPrice = show.priceRange?.split(" - ")[0] || "₹240";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Slide-up Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 max-h-[95vh] overflow-y-auto rounded-t-3xl bg-white shadow-2xl flex flex-col sm:relative sm:inset-auto sm:max-w-2xl sm:mx-auto sm:my-8 sm:rounded-2xl sm:max-h-[90vh]">

        {/* Hero Backdrop + Poster */}
        <div className="relative w-full h-52 sm:h-64 shrink-0 overflow-hidden rounded-t-3xl sm:rounded-t-2xl bg-slate-900">
          {/* Backdrop Image */}
          <img
            src={show.backdrop || show.poster}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Action Buttons */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm transition cursor-pointer ${
                liked ? "bg-red-500 text-white" : "bg-black/50 text-white hover:bg-black/70"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${liked ? "fill-current" : ""}`} />
              {likeCount.toLocaleString()}
            </button>
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-semibold hover:bg-black/70 transition cursor-pointer">
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
          </div>

          {/* Poster + Title at bottom */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end gap-4">
            <div className="w-20 aspect-[2/3] rounded-xl overflow-hidden shrink-0 shadow-xl border border-white/20">
              <img
                src={show.poster}
                alt={show.title}
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = show.backdrop || show.poster; }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-white font-black text-lg sm:text-xl leading-tight truncate">{show.title}</h2>
              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                {show.statusBadge && (
                  <span className="px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-sm text-white text-[10px] font-bold border border-white/20">
                    {show.statusBadge}
                  </span>
                )}
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold border border-amber-400/30">
                  <Star className="w-3 h-3 fill-current" /> {show.score}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/80 text-[10px] font-semibold">
                  {show.format}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-5 space-y-5">

            {/* Quick Meta Row */}
            <div className="flex flex-wrap gap-4 text-xs text-slate-600">
              {show.rating && (
                <span className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg font-semibold">
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  {show.rating}
                </span>
              )}
              {show.duration && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> {show.duration}
                </span>
              )}
              {show.languages?.[0] && (
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-400" /> {show.languages[0]}
                </span>
              )}
              {show.votes && (
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" /> {show.votes} ratings
                </span>
              )}
            </div>

            {/* Genre Tags */}
            {show.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {show.genres.map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}

            {/* Synopsis */}
            <div>
              <p className="text-xs font-black text-[#222433] uppercase tracking-wide mb-2">
                {meta.synopsisLabel}
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">{detail.synopsis}</p>
            </div>

            {/* Cast */}
            <div>
              <p className="text-xs font-black text-[#222433] uppercase tracking-wide mb-2.5">
                {meta.castLabel}
              </p>
              <div className="flex flex-wrap gap-2">
                {detail.cast.map((name) => (
                  <span
                    key={name}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs text-xs font-medium text-slate-700"
                  >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#F84464] to-[#ff6b87] flex items-center justify-center text-white text-[9px] font-black shrink-0">
                      {name[0]}
                    </div>
                    {name}
                  </span>
                ))}
              </div>
            </div>

            {/* Director */}
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">{meta.directorLabel}</p>
                <p className="text-sm font-bold text-[#222433] mt-0.5">{detail.director}</p>
              </div>
              <Film className="w-5 h-5 text-slate-300" />
            </div>

            {/* Awards & Tags */}
            {(detail.awards?.length > 0 || detail.extraTags?.length > 0) && (
              <div className="space-y-2">
                {detail.awards?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {detail.awards.map((a) => (
                      <span
                        key={a}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold"
                      >
                        🏆 {a}
                      </span>
                    ))}
                  </div>
                )}
                {detail.extraTags?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {detail.extraTags.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-full bg-[#F84464]/10 text-[#F84464] border border-[#F84464]/20 text-[11px] font-semibold"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Venue & Showtimes preview */}
            <div>
              <p className="text-xs font-black text-[#222433] uppercase tracking-wide mb-2.5">Showtimes Today</p>
              <div className="flex flex-wrap gap-2">
                {show.showtimes?.slice(0, 5).map((time) => (
                  <span
                    key={time}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-[#222433] shadow-xs flex items-center gap-1.5"
                  >
                    <Clock className="w-3 h-3 text-slate-400" />
                    {time}
                  </span>
                ))}
              </div>
            </div>

            {/* Venue info */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <MapPin className="w-4 h-4 text-[#F84464] shrink-0" />
              <p className="text-xs text-slate-700 font-medium leading-tight">{show.subtitle}</p>
            </div>

          </div>
        </div>

        {/* Sticky Book CTA */}
        <div className="shrink-0 px-5 py-4 bg-white border-t border-slate-200">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-[10px] text-slate-400">Starting from</p>
              <p className="font-black text-lg text-[#222433]">{minPrice}</p>
            </div>
            <button
              onClick={() => {
                onBookNow(show.id);
                onClose();
              }}
              className="flex-1 py-3 rounded-2xl bg-[#F84464] hover:bg-[#e03254] text-white font-black text-sm shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Ticket className="w-4 h-4" />
              Book Seats Now
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Tiny shield for meta row (not importing from lucide to avoid duplication)
function Shield({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}
