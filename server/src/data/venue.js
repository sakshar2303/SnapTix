// Multi-Event & Multi-Auditorium Venue Catalog for SnapTix
// Reusable seat layouts across IMAX Stadium, Insignia VIP Lounge, 4DX Motion Pods, Concerts, and Sports

export const AUDITORIUM_TEMPLATES = {
  "standard": {
    rows: ["A", "B", "C", "D", "E", "F", "G", "H"],
    cols: 9,
    sectionMap: { A: 0, B: 0, C: 1, D: 1, E: 1, F: 2, G: 2, H: 2 },
  },
  "luxury_couples": {
    rows: ["A", "B", "C", "D", "E", "F"],
    cols: 8,
    sectionMap: { A: 0, B: 0, C: 1, D: 1, E: 2, F: 2 },
  },
  "quad_pods": {
    rows: ["A", "B", "C", "D", "E", "F"],
    cols: 8,
    sectionMap: { A: 0, B: 0, C: 0, D: 1, E: 1, F: 1 },
  },
};

export const CATALOG = [
  {
    id: "venue-pvr-imax",
    category: "Movies",
    title: "DUNE: PART TWO",
    subtitle: "PVR INOX: Phoenix Palladium",
    format: "IMAX 2D",
    rating: "UA 16+",
    score: "9.4",
    votes: "148.2K",
    statusBadge: "🔴 LIVE NOW",
    genres: ["Sci-Fi", "Adventure", "Action"],
    languages: ["English", "Hindi", "Tamil", "Telugu"],
    duration: "2h 46m",
    priceRange: "₹240 - ₹550",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80",
    screenLabel: "IMAX Laser 4K • Commercial Screen Proscenium",
    showtimes: ["10:15 AM", "01:45 PM", "04:30 PM", "07:30 PM", "10:45 PM"],
    layoutType: "standard",
    sections: [
      { name: "IMAX RECLINER", price: 550, rows: ["A", "B"], desc: "Motorized Leather Loungers" },
      { name: "IMAX PRIME", price: 380, rows: ["C", "D", "E"], desc: "Center Acoustic Field" },
      { name: "IMAX CLASSIC", price: 240, rows: ["F", "G", "H"], desc: "High Back Cinema Seating" },
    ],
  },
  {
    id: "venue-interstellar",
    category: "Movies",
    title: "INTERSTELLAR: 10TH ANNIVERSARY",
    subtitle: "PVR INOX: Phoenix Palladium • IMAX 70mm",
    format: "IMAX 70mm",
    rating: "UA 13+",
    score: "9.6",
    votes: "210.4K",
    statusBadge: "⚡ FAST FILLING",
    genres: ["Sci-Fi", "Drama", "Mystery"],
    languages: ["English • Dual 4K Laser"],
    duration: "2h 49m",
    priceRange: "₹300 - ₹650",
    poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&auto=format&fit=crop&q=80",
    screenLabel: "70MM IMAX RE-RELEASE • GARGANTUA PROJECTION",
    showtimes: ["11:00 AM", "03:00 PM", "07:00 PM", "10:30 PM"],
    layoutType: "standard",
    sections: [
      { name: "IMAX RECLINER", price: 650, rows: ["A", "B"], desc: "Motorized Leather Loungers" },
      { name: "IMAX PRIME", price: 450, rows: ["C", "D", "E"], desc: "Center Acoustic Field" },
      { name: "IMAX CLASSIC", price: 300, rows: ["F", "G", "H"], desc: "High Back Cinema Seating" },
    ],
  },
  {
    id: "venue-oppenheimer",
    category: "Movies",
    title: "OPPENHEIMER",
    subtitle: "PVR INOX: Select CITYWALK",
    format: "IMAX 2D",
    rating: "A 18+",
    score: "9.3",
    votes: "185.0K",
    statusBadge: "⭐ 7 OSCARS",
    genres: ["Biography", "Drama", "History"],
    languages: ["English • Dolby Atmos 7.1"],
    duration: "3h 00m",
    priceRange: "₹280 - ₹600",
    poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
    screenLabel: "IMAX TRINITY LASER • FULL 1.43:1 EXPANDED ASPECT",
    showtimes: ["12:30 PM", "04:30 PM", "08:30 PM"],
    layoutType: "standard",
    sections: [
      { name: "IMAX RECLINER", price: 600, rows: ["A", "B"], desc: "Motorized Leather Loungers" },
      { name: "IMAX PRIME", price: 420, rows: ["C", "D", "E"], desc: "Center Acoustic Field" },
      { name: "IMAX CLASSIC", price: 280, rows: ["F", "G", "H"], desc: "High Back Cinema Seating" },
    ],
  },
  {
    id: "venue-avatar",
    category: "Movies",
    title: "AVATAR: THE WAY OF WATER",
    subtitle: "Cinépolis: Fun Republic • RealD 3D",
    format: "RealD 3D",
    rating: "UA 13+",
    score: "9.1",
    votes: "132.8K",
    statusBadge: "🔴 LIVE NOW",
    genres: ["Sci-Fi", "Action", "Adventure"],
    languages: ["English", "Hindi", "Tamil"],
    duration: "3h 12m",
    priceRange: "₹260 - ₹520",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80",
    screenLabel: "PANDORA HFR 48FPS • 3D IMMERSIVE PROJECTION",
    showtimes: ["10:30 AM", "02:45 PM", "06:45 PM", "10:45 PM"],
    layoutType: "standard",
    sections: [
      { name: "3D RECLINER", price: 520, rows: ["A", "B"], desc: "Motorized Leather Loungers" },
      { name: "3D PRIME", price: 360, rows: ["C", "D", "E"], desc: "Center Acoustic Field" },
      { name: "3D CLASSIC", price: 260, rows: ["F", "G", "H"], desc: "High Back Cinema Seating" },
    ],
  },
  {
    id: "venue-coldplay",
    category: "Events",
    title: "COLDPLAY: MUSIC OF THE SPHERES",
    subtitle: "DY Patil Stadium • Navi Mumbai",
    format: "LIVE CONCERT",
    rating: "ALL AGES",
    score: "9.9",
    votes: "320.0K",
    statusBadge: "⚡ SELLING FAST",
    genres: ["Music", "Live Arena", "Stadium Tour"],
    languages: ["English • Wristband Lightshow"],
    duration: "3h 15m",
    priceRange: "₹250 - ₹950",
    poster: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&auto=format&fit=crop&q=80",
    screenLabel: "MAIN STAGE • RUNWAY & SPHERES ARRAY",
    showtimes: ["05:00 PM (Gates Open)", "07:30 PM (Main Act)"],
    layoutType: "standard",
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
    score: "9.7",
    votes: "88.4K",
    statusBadge: "🏆 CRITICS CHOICE",
    genres: ["Musical", "Drama", "Historical"],
    languages: ["Hindi / Urdu • Live Symphony"],
    duration: "2h 30m",
    priceRange: "₹220 - ₹650",
    poster: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=600&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1469488865564-c2de10f69f96?w=1200&auto=format&fit=crop&q=80",
    screenLabel: "PROSCENIUM ARCH • ROYAL STAGE",
    showtimes: ["03:30 PM (Matinee)", "07:30 PM (Gala Evening)"],
    layoutType: "standard",
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
    score: "9.8",
    votes: "450.0K",
    statusBadge: "🔥 MEGA DERBY",
    genres: ["Cricket", "T20", "Sports"],
    languages: ["Live Stadium Commentary"],
    duration: "3h 45m",
    priceRange: "₹220 - ₹550",
    poster: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&auto=format&fit=crop&q=80",
    screenLabel: "PITCH & PLAYERS PAVILION THIS WAY",
    showtimes: ["07:30 PM (Match Start)", "03:30 PM (Afternoon Match)"],
    layoutType: "standard",
    sections: [
      { name: "SACHIN TENDULKAR STAND", price: 550, rows: ["A", "B"], desc: "Direct Pitch View • Pavilion Level" },
      { name: "SUNIL GAVASKAR STAND", price: 380, rows: ["C", "D", "E"], desc: "Mid-Wicket Sightline" },
      { name: "NORTH STAND (FAN CLUB)", price: 220, rows: ["F", "G", "H"], desc: "Behind Bowlers Arm • Maximum Energy" },
    ],
  },
  {
    id: "audi-2-insignia",
    category: "Movies",
    title: "DUNE: PART TWO",
    subtitle: "PVR INOX: Phoenix Palladium (Insignia Lounge)",
    format: "VIP LOUNGE",
    rating: "UA 16+",
    score: "9.4",
    votes: "148.2K",
    statusBadge: "👑 VIP SUITE",
    genres: ["Sci-Fi", "Adventure", "Action"],
    languages: ["English • Dolby Atmos 7.1"],
    duration: "2h 46m",
    priceRange: "₹480 - ₹850",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80",
    screenLabel: "Insignia VIP Lounge • Private 4K Christie • Butler Service",
    showtimes: ["11:30 AM", "03:15 PM", "06:45 PM", "10:00 PM"],
    layoutType: "luxury_couples",
    sections: [
      { name: "ROYAL SUITE LOUNGER", price: 850, rows: ["A", "B"], desc: "Full-Flat Leather Beds with Service Table" },
      { name: "PREMIERE RECLINER", price: 650, rows: ["C", "D"], desc: "Motorized Recliners & Personal Lamp" },
      { name: "CLUB LOUNGER", price: 480, rows: ["E", "F"], desc: "Plush Wide Cushioned Seats" },
    ],
  },
  {
    id: "audi-1-4dx",
    category: "Movies",
    title: "DUNE: PART TWO",
    subtitle: "PVR INOX: Phoenix Palladium (4DX Theatre)",
    format: "4DX MOTION",
    rating: "UA 16+",
    score: "9.4",
    votes: "148.2K",
    statusBadge: "⚡ 4DX FX",
    genres: ["Sci-Fi", "Adventure", "Action"],
    languages: ["English • Environmental FX"],
    duration: "2h 46m",
    priceRange: "₹360 - ₹490",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80",
    screenLabel: "4DX Motion Simulator • Wind, Mist, Scent & Vibration FX",
    showtimes: ["12:00 PM", "03:30 PM", "07:00 PM", "10:15 PM"],
    layoutType: "quad_pods",
    sections: [
      { name: "4DX PRIME PODS", price: 490, rows: ["A", "B", "C"], desc: "Heave, Pitch & Roll Motion Simulation" },
      { name: "4DX STANDARD", price: 360, rows: ["D", "E", "F"], desc: "Synchronized Motion Seats with Environmental FX" },
    ],
  },
];

// Generates dynamic seats for any event and auditorium arrangement
export function generateSeatsForEvent(eventObj) {
  const seats = [];
  const layout = AUDITORIUM_TEMPLATES[eventObj.layoutType] || AUDITORIUM_TEMPLATES.standard;

  layout.rows.forEach((rowLetter, rowIndex) => {
    const tierIdx = layout.sectionMap[rowLetter] ?? 0;
    const sec = eventObj.sections[tierIdx] || eventObj.sections[0];
    const y = 80 + rowIndex * 44;

    for (let c = 1; c <= layout.cols; c++) {
      let aisleGap = 0;
      if (eventObj.layoutType === "luxury_couples") {
        if (c > 6) aisleGap = 40;
        else if (c > 4) aisleGap = 30;
        else if (c > 2) aisleGap = 15;
      } else if (eventObj.layoutType === "quad_pods") {
        if (c > 4) aisleGap = 36;
      } else {
        if (c > 6) aisleGap = 36;
        else if (c > 3) aisleGap = 18;
      }

      const x = 110 + (c - 1) * 44 + aisleGap;

      seats.push({
        id: `${rowLetter}${c}`,
        row: rowLetter,
        col: c,
        label: `${rowLetter}${c}`,
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

export const VENUE_INFO = CATALOG[0];
export const TIERS = {
  VIP: { name: "IMAX RECLINER", price: 550, color: "#F84464" },
  PREFERRED: { name: "IMAX PRIME", price: 380, color: "#2DC44D" },
  STANDARD: { name: "IMAX CLASSIC", price: 240, color: "#00B9F5" },
};
export const INITIAL_SEATS = generateSeatsForEvent(CATALOG[0]);

export function getEventById(eventId) {
  return CATALOG.find((e) => e.id === eventId) || CATALOG[0];
}
