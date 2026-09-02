"use client";

import React, { useState } from "react";
import { Play, X, Film, Star, Clock, Check } from "lucide-react";

const STREAM_MOVIES = [
  {
    id: "stream-1",
    title: "Killers of the Flower Moon",
    genre: "Crime, Drama, Western",
    duration: "3h 26m",
    rating: "8.1/10",
    rentPrice: 149,
    buyPrice: 499,
    description: "When oil is discovered in 1920s Oklahoma under Osage Nation land, the Osage people are murdered one by one.",
    trailerEmbed: "https://www.youtube.com/embed/EP34Yoxs3FQ",
  },
  {
    id: "stream-2",
    title: "Spider-Man: Across the Spider-Verse",
    genre: "Animation, Action, Adventure",
    duration: "2h 20m",
    rating: "8.7/10",
    rentPrice: 119,
    buyPrice: 399,
    description: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
    trailerEmbed: "https://www.youtube.com/embed/cqGjhVJWtEg",
  },
  {
    id: "stream-3",
    title: "The Batman",
    genre: "Action, Crime, Drama",
    duration: "2h 56m",
    rating: "7.8/10",
    rentPrice: 99,
    buyPrice: 299,
    description: "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption.",
    trailerEmbed: "https://www.youtube.com/embed/mqqft2x_Aa4",
  },
];

export default function StreamCatalogModal({ isOpen, onClose, onRented }) {
  const [activeTrailer, setActiveTrailer] = useState(null);
  const [rentedId, setRentedId] = useState(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-[#1C222F] rounded-2xl border border-slate-700 shadow-2xl text-white overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#131823] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#F84464] flex items-center justify-center shadow-md">
              <Play className="w-4 h-4 text-white fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-white">SnapTix Stream</span>
                <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 text-[10px] font-bold">
                  PREMIERE
                </span>
              </div>
              <p className="text-xs text-slate-400">Rent or buy digital blockbusters directly to your screen</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player overlay if watching trailer */}
        {activeTrailer && (
          <div className="p-4 bg-black border-b border-slate-800 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300">
                Playing Official Trailer: {activeTrailer.title}
              </span>
              <button
                onClick={() => setActiveTrailer(null)}
                className="text-xs text-[#F84464] font-bold hover:underline cursor-pointer"
              >
                Close Trailer ✕
              </button>
            </div>
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-900 shadow-lg">
              <iframe
                src={`${activeTrailer.trailerEmbed}?autoplay=1`}
                title={activeTrailer.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Movie Cards Catalog */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {STREAM_MOVIES.map((movie) => {
            const isRented = rentedId === movie.id;
            return (
              <div
                key={movie.id}
                className="p-4 rounded-xl bg-[#252C3B] border border-slate-700/80 hover:border-slate-600 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-base font-bold text-white">{movie.title}</h4>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-semibold">
                      {movie.genre}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2 mb-2 leading-relaxed">
                    {movie.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3 h-3 fill-amber-400" /> {movie.rating}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {movie.duration}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => setActiveTrailer(movie)}
                    className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer border border-slate-600"
                  >
                    <Play className="w-3 h-3 fill-slate-200" />
                    <span>Trailer</span>
                  </button>

                  <button
                    onClick={() => {
                      setRentedId(movie.id);
                      if (onRented) onRented(movie);
                    }}
                    disabled={isRented}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md ${
                      isRented
                        ? "bg-emerald-600 text-white"
                        : "bg-[#F84464] hover:bg-[#E03352] text-white"
                    }`}
                  >
                    {isRented ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Rented (30 Days)</span>
                      </>
                    ) : (
                      <span>Rent ₹{movie.rentPrice}</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#131823] border-t border-slate-800 text-center text-xs text-slate-400">
          Stream on your Smart TV, mobile phone, or laptop in Ultra HD 4K
        </div>
      </div>
    </div>
  );
}
