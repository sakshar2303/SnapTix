// Hardcoded 72-seat theater venue layout
// 8 rows (A-H), 9 seats per row = 72 seats total
// Divided into 3 price tiers: VIP, Preferred, Standard

export const VENUE_INFO = {
  id: "venue-grand-hall",
  name: "Grand Horizon Theater",
  eventName: "Cyber Symphony 2026: Live in Neo-Tokyo",
  date: "Friday, November 14, 2026 • 8:00 PM EST",
  totalSeats: 72,
  stageLabel: "STAGE / SCREEN",
};

export const TIERS = {
  VIP: {
    name: "VIP Orchestra",
    price: 150,
    color: "#F59E0B", // amber-500
    glowColor: "rgba(245, 158, 11, 0.4)",
    badge: "Gold",
  },
  PREFERRED: {
    name: "Preferred Mezzanine",
    price: 95,
    color: "#3B82F6", // blue-500
    glowColor: "rgba(59, 130, 246, 0.4)",
    badge: "Silver",
  },
  STANDARD: {
    name: "Standard Balcony",
    price: 55,
    color: "#10B981", // emerald-500
    glowColor: "rgba(16, 185, 129, 0.4)",
    badge: "Bronze",
  },
};

export const INITIAL_SEATS = [];

const rows = [
  { row: "A", tier: "VIP" },
  { row: "B", tier: "VIP" },
  { row: "C", tier: "PREFERRED" },
  { row: "D", tier: "PREFERRED" },
  { row: "E", tier: "PREFERRED" },
  { row: "F", tier: "STANDARD" },
  { row: "G", tier: "STANDARD" },
  { row: "H", tier: "STANDARD" },
];

const cols = 9;

rows.forEach((r, rowIndex) => {
  for (let c = 1; c <= cols; c++) {
    // Add small aisle gap after seat 3 and seat 6
    const aisleOffset = (c > 6 ? 28 : c > 3 ? 14 : 0);
    const x = 50 + (c - 1) * 44 + aisleOffset;
    const y = 80 + rowIndex * 46;

    INITIAL_SEATS.push({
      id: `${r.row}${c}`,
      row: r.row,
      col: c,
      label: `${r.row}${c}`,
      tier: r.tier,
      price: TIERS[r.tier].price,
      status: "available", // 'available' | 'held' | 'booked'
      x,
      y,
    });
  }
});
