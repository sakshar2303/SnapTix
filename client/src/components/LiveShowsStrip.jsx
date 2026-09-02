"use client";

import React, { useState, useRef } from "react";
import { Star, Flame, ChevronLeft, ChevronRight, Check, Search, Sparkles } from "lucide-react";

export default function LiveShowsStrip({
  catalog = [],
  activeEventId,
  onSelectEvent,
  activeCity = "Mumbai",
}) {
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const scrollRef = useRef(null);

  const categories = ["ALL", "Movies", "Events", "Plays", "Sports", "Activities"];

  // Deduplicate catalog events by title
  const uniqueCatalog = catalog.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t.title === item.title)
  );

  const filteredShows = uniqueCatalog.filter((item) => {
    const matchesCategory = filterCategory === "ALL" || item.category === filterCategory;
    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.genres?.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto mb-6 select-none space-y-3">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[#F84464]">
              <Flame className="w-4 h-4 fill-current" />
              <span className="font-mono text-xs uppercase font-bold tracking-wider">
                NOW SHOWING & LIVE EXPERIENCES
              </span>
            </div>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">
              {filteredShows.length} Shows Live in {activeCity}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-[#222433] tracking-tight mt-0.5">
            Recommended Movies, Plays, Concerts & Sports
          </h2>
        </div>

        {/* Search Input for Quick Filter */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search shows, plays, artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-[#222433] placeholder:text-slate-400 focus:outline-none focus:border-[#F84464] shadow-2xs"
          />
        </div>
      </div>

      {/* Category Tabs & Carousel Navigation */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 pb-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => {
            const count =
              cat === "ALL"
                ? uniqueCatalog.length
                : uniqueCatalog.filter((item) => item.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  filterCategory === cat
                    ? "bg-[#333545] text-white shadow-xs"
                    : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    filterCategory === cat
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="hidden sm:flex items-center gap-1 ml-2 shrink-0">
          <button
            onClick={() => scroll("left")}
            className="p-1.5 rounded-full bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 transition shadow-2xs cursor-pointer"
            title="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-1.5 rounded-full bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 transition shadow-2xs cursor-pointer"
            title="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Poster Cards Carousel */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-4 overflow-x-auto pb-3 pt-1 scroll-smooth snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {filteredShows.map((show) => {
          const isSelected =
            show.id === activeEventId ||
            (activeEventId?.includes("audi") && show.title === "DUNE: PART TWO");

          return (
            <div
              key={show.id}
              onClick={() => onSelectEvent(show.id)}
              className={`shrink-0 w-[175px] sm:w-[195px] rounded-2xl bg-white border transition-all duration-200 cursor-pointer snap-start flex flex-col justify-between overflow-hidden group shadow-xs hover:shadow-md ${
                isSelected
                  ? "ring-2 ring-[#F84464] border-[#F84464] shadow-md"
                  : "border-slate-200/90 hover:border-slate-300"
              }`}
            >
              {/* Poster Image Container */}
              <div className="relative w-full aspect-[2/3] bg-slate-900 overflow-hidden">
                <img
                  src={show.poster}
                  alt={show.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src =
                      show.backdrop ||
                      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80";
                  }}
                />

                {/* Gradient Shadow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>

                {/* Top Status Badge */}
                {show.statusBadge && (
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold border border-white/20 shadow-xs">
                      {show.statusBadge}
                    </span>
                  </div>
                )}

                {/* Bottom Poster Rating & Format Pill */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-xs">
                  <div className="flex items-center gap-1 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md border border-white/15">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-[11px]">{show.score || "9.4"}</span>
                    <span className="text-[9px] text-slate-300">({show.votes || "100k"})</span>
                  </div>

                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/20 backdrop-blur-xs">
                    {show.format}
                  </span>
                </div>

                {/* Currently Selected Active Banner */}
                {isSelected && (
                  <div className="absolute inset-0 bg-[#F84464]/20 flex items-center justify-center pointer-events-none">
                    <div className="px-2.5 py-1 rounded-full bg-[#F84464] text-white text-xs font-bold shadow-md flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Selected
                    </div>
                  </div>
                )}
              </div>

              {/* Show Details Card Content */}
              <div className="p-3 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-[#222433] line-clamp-1 group-hover:text-[#F84464] transition-colors">
                    {show.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {show.subtitle || show.genres?.join(", ") || show.category}
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-700">
                    {show.priceRange || "From ₹240"}
                  </span>
                  <span
                    className={`font-bold ${
                      isSelected ? "text-[#F84464]" : "text-indigo-600 group-hover:underline"
                    }`}
                  >
                    {isSelected ? "Now Booking" : "Book Seats →"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {filteredShows.length === 0 && (
          <div className="w-full text-center py-10 text-xs text-slate-400">
            No live shows found matching &ldquo;{searchQuery}&rdquo;.
          </div>
        )}
      </div>
    </div>
  );
}
