// BookMyShow Style Cinema Seating Layout
// Cinema Venue: PVR INOX IMAX 3D, Phoenix Marketcity • Audi 4
// 3 Tiers: RECLINER (Luxury), PRIME (Middle), CLASSIC (Front)
// 8 Rows (A-H), 9 Seats per row = 72 seats total

export const VENUE_INFO = {
  id: "venue-pvr-imax",
  cinemaName: "PVR INOX: Phoenix Palladium, Lower Parel",
  audiName: "Audi 4 • IMAX with Laser (DOLBY ATMOS 7.1)",
  movieTitle: "DUNE: PART TWO",
  format: "IMAX 2D",
  certificate: "UA 16+",
  language: "English • Dolby Atmos 7.1",
  genre: "Action, Adventure, Sci-Fi",
  duration: "2h 46m",
  showDate: "Today, 02 Sep 2026",
  showTime: "07:30 PM",
  showtimes: ["10:15 AM", "01:45 PM", "04:30 PM", "07:30 PM", "10:45 PM"],
  totalSeats: 72,
  screenLabel: "All eyes this way please! Screen this way",
};

export const TIERS = {
  VIP: {
    id: "RECLINER",
    name: "RECLINER",
    price: 450,
    currencySymbol: "₹",
    color: "#F84464", // BMS Crimson Red
    badge: "RECLINER",
    rows: ["A", "B"],
    description: "Plush motorized leather recliners with food & beverage service",
  },
  PREFERRED: {
    id: "PRIME",
    name: "PRIME",
    price: 290,
    currencySymbol: "₹",
    color: "#2DC44D", // BMS Green
    badge: "PRIME",
    rows: ["C", "D", "E"],
    description: "Optimal center viewing angle & direct acoustic field",
  },
  STANDARD: {
    id: "CLASSIC",
    name: "CLASSIC",
    price: 180,
    currencySymbol: "₹",
    color: "#00B9F5", // Cyan Blue
    badge: "CLASSIC",
    rows: ["F", "G", "H"],
    description: "Standard cinema seating with high back support",
  },
};

export const INITIAL_SEATS = [];

const rows = [
  { row: "A", tier: "VIP", section: "RECLINER" },
  { row: "B", tier: "VIP", section: "RECLINER" },
  { row: "C", tier: "PREFERRED", section: "PRIME" },
  { row: "D", tier: "PREFERRED", section: "PRIME" },
  { row: "E", tier: "PREFERRED", section: "PRIME" },
  { row: "F", tier: "STANDARD", section: "CLASSIC" },
  { row: "G", tier: "STANDARD", section: "CLASSIC" },
  { row: "H", tier: "STANDARD", section: "CLASSIC" },
];

const cols = 9;

// Calculate cinema grid coordinates
// Rows ordered top-to-bottom: Recliner at top (rear of theater), Screen at bottom
rows.forEach((r, rowIndex) => {
  // Extra vertical spacing between sections
  const sectionGap = r.row === "C" ? 24 : r.row === "F" ? 24 : 0;
  const y = 80 + rowIndex * 44 + sectionGap;

  for (let c = 1; c <= cols; c++) {
    // Aisle gap after seat 3 and seat 6
    const aisleGap = c > 6 ? 36 : c > 3 ? 18 : 0;
    const x = 110 + (c - 1) * 44 + aisleGap;

    const tierObj = TIERS[r.tier];

    INITIAL_SEATS.push({
      id: `${r.row}${c}`,
      row: r.row,
      col: c,
      label: `${r.row}${c}`,
      tier: r.tier,
      section: r.section,
      price: tierObj.price,
      currencySymbol: "₹",
      status: "available",
      x,
      y,
      description: tierObj.description,
    });
  }
});
