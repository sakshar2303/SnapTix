"use client";

import React from "react";

/**
 * Finalized SnapTix Minimalist Logo: The S-Stub Ticket Mark
 * A continuous monoline admission ticket outline seamlessly weaving through the letter 'S'
 * with a signature Crimson Red (#F84464) energetic diagonal accent.
 */
export function SnapTixMark({ size = 32, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Dark Slate Background Squircle */}
      <rect width="36" height="36" rx="9" fill="#1A1F2C" />

      {/* Ticket Outer Border with Notches */}
      <path
        d="M 6 13 C 6 10.5 8 9 10.5 9 L 25.5 9 C 28 9 30 10.5 30 13 C 28.5 13 27 14.5 27 18 C 27 21.5 28.5 23 30 23 C 30 25.5 28 27 25.5 27 L 10.5 27 C 8 27 6 25.5 6 23 C 7.5 23 9 21.5 9 18 C 9 14.5 7.5 13 6 13 Z"
        stroke="#4A5568"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Continuous 'S' Ribbon Path */}
      {/* Top curve of S */}
      <path
        d="M 22.5 13.5 C 22.5 11.8 19.5 11.5 17 11.5 C 13.5 11.5 12 13 12 15 C 12 17 14 18 17 18"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Dynamic Crimson Diagonal Slash connecting the curves */}
      <path
        d="M 16 16.5 L 20 19.5"
        stroke="#F84464"
        strokeWidth="2.6"
        strokeLinecap="round"
      />

      {/* Bottom curve of S */}
      <path
        d="M 19 18 C 22 18 24 19 24 21 C 24 23 22.5 24.5 19 24.5 C 16.5 24.5 13.5 24.2 13.5 22.5"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function SnapTixLogo({ size = 32, showWordmark = true, className = "" }) {
  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <SnapTixMark size={size} />
      {showWordmark && (
        <div className="flex items-baseline font-black tracking-tight">
          <span className="text-white text-xl">Snap</span>
          <span className="text-[#F84464] text-xl">Tix</span>
        </div>
      )}
    </div>
  );
}
