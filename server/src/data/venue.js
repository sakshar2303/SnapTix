// Multi-Event & Venue Catalog for SnapTix
// Reusable seat layouts across Movies, Events, Plays, Sports, and Activities

export const CATALOG = [
  {
    id: "venue-pvr-imax",
    category: "Movies",
    title: "DUNE: PART TWO",
    subtitle: "PVR INOX: Phoenix Palladium • Audi 4",
    format: "IMAX 2D",
    rating: "UA 16+",
    language: "English • Dolby Atmos 7.1",
    duration: "2h 46m",
    priceRange: "₹180 - ₹450",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=60",
    screenLabel: "All eyes this way please! Screen this way",
    showtimes: ["10:15 AM", "01:45 PM", "04:30 PM", "07:30 PM", "10:45 PM"],
    sections: [
      { name: "RECLINER", price: 450, rows: ["A", "B"], desc: "Motorized Plush Leather" },
      { name: "PRIME", price: 290, rows: ["C", "D", "E"], desc: "Center Acoustic Field" },
      { name: "CLASSIC", price: 180, rows: ["F", "G", "H"], desc: "High Back Support" },
    ],
  },
  {
    id: "venue-coldplay",
    category: "Events",
    title: "COLDPLAY: MUSIC OF THE SPHERES",
    subtitle: "DY Patil Stadium • Navi Mumbai",
    format: "LIVE CONCERT",
    rating: "ALL AGES",
    language: "Live In Concert • Wristband Lightshow",
    duration: "3h 15m",
    priceRange: "₹2,500 - ₹9,500",
    poster: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=60",
    screenLabel: "MAIN STAGE • RUNWAY & SPHERES ARRAY",
    showtimes: ["05:00 PM (Gates Open)", "07:30 PM (Main Act)"],
    sections: [
      { name: "INFINITY LOUNGE VIP", price: 950, rows: ["A", "B"], desc: "Front Standing & Lounge Access" },
      { name: "FLOOR ARENA", price: 490, rows: ["C", "D", "E"], desc: "Immersive Pitch Standing" },
      { name: "STADIUM STANDS", price: 250, rows: ["F", "G", "H"], desc: "Elevated Grandstand Vista" },
    ],
  },
  {
    id: "venue-ncpa-play",
    category: "Plays",
    title: "MUGHAL-E-AZAM: THE MUSICAL",
    subtitle: "Jamshed Bhabha Theatre, NCPA • Nariman Point",
    format: "BROADWAY STYLE",
    rating: "FAMILY",
    language: "Hindi / Urdu • Live Symphony",
    duration: "2h 30m",
    priceRange: "₹500 - ₹2,000",
    poster: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=500&auto=format&fit=crop&q=60",
    screenLabel: "PROSCENIUM ARCH • ROYAL STAGE",
    showtimes: ["03:30 PM (Matinee)", "07:30 PM (Gala Evening)"],
    sections: [
      { name: "ROYAL BOX", price: 650, rows: ["A", "B"], desc: "Private Gilded Balcony Box" },
      { name: "ORCHESTRA STALLS", price: 400, rows: ["C", "D", "E"], desc: "Acoustic Prime Front Stalls" },
      { name: "GRAND BALCONY", price: 220, rows: ["F", "G", "H"], desc: "Elevated Panoramic View" },
    ],
  },
  {
    id: "venue-ipl-wankhede",
    category: "Sports",
    title: "IPL 2026: MUMBAI INDIANS VS CSK",
    subtitle: "Wankhede Stadium • Churchgate, Mumbai",
    format: "T20 CRICKET",
    rating: "ALL AGES",
    language: "Live Stadium Experience",
    duration: "3h 45m",
    priceRange: "₹800 - ₹4,500",
    poster: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=500&auto=format&fit=crop&q=60",
    screenLabel: "PITCH & PLAYERS PAVILION THIS WAY",
    showtimes: ["07:30 PM (Match Start)", "03:30 PM (Afternoon Match)"],
    sections: [
      { name: "SACHIN TENDULKAR STAND", price: 550, rows: ["A", "B"], desc: "Direct Pitch View • Pavilion Level" },
      { name: "SUNIL GAVASKAR STAND", price: 380, rows: ["C", "D", "E"], desc: "Mid-Wicket Sightline" },
      { name: "NORTH STAND (FAN CLUB)", price: 220, rows: ["F", "G", "H"], desc: "Behind Bowlers Arm • Maximum Energy" },
    ],
  },
];

// Generates 72 seats for any event layout
export function generateSeatsForEvent(eventObj) {
  const seats = [];
  const rows = [
    { row: "A", tierIdx: 0 },
    { row: "B", tierIdx: 0 },
    { row: "C", tierIdx: 1 },
    { row: "D", tierIdx: 1 },
    { row: "E", tierIdx: 1 },
    { row: "F", tierIdx: 2 },
    { row: "G", tierIdx: 2 },
    { row: "H", tierIdx: 2 },
  ];

  const cols = 9;

  rows.forEach((r, rowIndex) => {
    const sec = eventObj.sections[r.tierIdx];
    const sectionGap = r.row === "C" ? 24 : r.row === "F" ? 24 : 0;
    const y = 80 + rowIndex * 44 + sectionGap;

    for (let c = 1; c <= cols; c++) {
      const aisleGap = c > 6 ? 36 : c > 3 ? 18 : 0;
      const x = 110 + (c - 1) * 44 + aisleGap;

      seats.push({
        id: `${r.row}${c}`,
        row: r.row,
        col: c,
        label: `${r.row}${c}`,
        tier: sec.name,
        section: sec.name,
        price: sec.price,
        currencySymbol: "₹",
        status: "available",
        x,
        y,
        description: sec.desc,
      });
    }
  });

  return seats;
}

// Default initial export for backwards compatibility
export const VENUE_INFO = CATALOG[0];
export const TIERS = {
  VIP: { name: "RECLINER", price: 450, color: "#F84464" },
  PREFERRED: { name: "PRIME", price: 290, color: "#2DC44D" },
  STANDARD: { name: "CLASSIC", price: 180, color: "#00B9F5" },
};
export const INITIAL_SEATS = generateSeatsForEvent(CATALOG[0]);

export function getEventById(eventId) {
  return CATALOG.find((e) => e.id === eventId) || CATALOG[0];
}
