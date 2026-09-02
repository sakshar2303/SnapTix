// Architecturally authentic 72-seat amphitheater concert hall layout
// 8 curved radial rows (A-H), 9 seats per row = 72 seats total
// Radiating outward from the center stage with acoustic line-of-sight sightlines

export const VENUE_INFO = {
  id: "venue-grand-hall",
  name: "Kuroshio Concert Hall",
  location: "Neo-Tokyo Arts District • Main Amphitheater",
  eventName: "Cyber Symphony 2026: Live in Neo-Tokyo",
  date: "Friday, November 14, 2026 • 8:00 PM JST",
  totalSeats: 72,
  stageLabel: "PROSCENIUM ARCH • ACOUSTIC CENTER STAGE",
};

export const TIERS = {
  VIP: {
    name: "Prime Orchestra",
    price: 150,
    color: "#EAB308", // gold-500
    accentHex: "#FACC15",
    glowColor: "rgba(234, 179, 8, 0.4)",
    badge: "Gold VIP",
    sightline: "Direct 180° Acoustic Field • Pure Front Row",
    features: ["Complimentary Lounge Access", "Acoustic Sweet Spot", "Dedicated Concierge"],
  },
  PREFERRED: {
    name: "Grand Mezzanine",
    price: 95,
    color: "#38BDF8", // sky-400
    accentHex: "#60A5FA",
    glowColor: "rgba(56, 189, 248, 0.4)",
    badge: "Preferred",
    sightline: "Elevated Center Tier • Balanced Hall Sound",
    features: ["Optimal Visual Panorama", "Enhanced Legroom", "Express Entry"],
  },
  STANDARD: {
    name: "Royal Balcony",
    price: 55,
    color: "#34D399", // emerald-400
    accentHex: "#10B981",
    glowColor: "rgba(52, 211, 153, 0.4)",
    badge: "Balcony",
    sightline: "Panoramic Overlook • Reverberant Hall Ambience",
    features: ["Panoramic Stage Vista", "Private Balcony Bar Access"],
  },
};

export const INITIAL_SEATS = [];

const rows = [
  { row: "A", tier: "VIP", section: "Orchestra Tier 1" },
  { row: "B", tier: "VIP", section: "Orchestra Tier 2" },
  { row: "C", tier: "PREFERRED", section: "Mezzanine Loge 1" },
  { row: "D", tier: "PREFERRED", section: "Mezzanine Loge 2" },
  { row: "E", tier: "PREFERRED", section: "Mezzanine Loge 3" },
  { row: "F", tier: "STANDARD", section: "Upper Balcony A" },
  { row: "G", tier: "STANDARD", section: "Upper Balcony B" },
  { row: "H", tier: "STANDARD", section: "Upper Balcony C" },
];

const cols = 9;
const FOCAL_X = 450;
const FOCAL_Y = -120;

rows.forEach((r, rowIndex) => {
  const radius = 235 + rowIndex * 44;

  for (let c = 1; c <= cols; c++) {
    // 9 seats centered around angle 0:
    // Indices: 1..9 -> normalized -4 to +4
    const normalizedIndex = c - 5;
    
    // Base step 5.2 degrees per seat
    let angleDeg = normalizedIndex * 5.2;

    // Add physical aisle gaps between seat 3 & 4, and seat 6 & 7
    if (c <= 3) {
      angleDeg -= 3.2; // Left loge wing
    } else if (c >= 7) {
      angleDeg += 3.2; // Right loge wing
    }

    const angleRad = (angleDeg * Math.PI) / 180;
    const x = Math.round(FOCAL_X + radius * Math.sin(angleRad));
    const y = Math.round(FOCAL_Y + radius * Math.cos(angleRad));
    const rotation = Math.round(-angleDeg); // Face towards stage focal point

    const tierObj = TIERS[r.tier];

    INITIAL_SEATS.push({
      id: `${r.row}${c}`,
      row: r.row,
      col: c,
      label: `${r.row}${c}`,
      tier: r.tier,
      section: r.section,
      price: tierObj.price,
      status: "available", // 'available' | 'held' | 'booked'
      x,
      y,
      rotation,
      sightline: tierObj.sightline,
    });
  }
});
