// Teenage Engineering / Precision Hardware Theme
// 8 curved radial amphitheater rows (A-H), 9 acoustic pods per row = 72 seats total
// Radiating from the Acoustic Emitter Stage with precision CAD coordinates

export const VENUE_INFO = {
  id: "venue-synth-lab",
  name: "SYNTH LAB 01 • FIELD ACOUSTICS HALL",
  location: "CH-1004 RESEARCH CAMPUS • SOUND EMITTER GRID",
  eventName: "FREQUENCY PROTOCOL 2026 // LIVE MODULAR FIELD",
  date: "2026.11.14 // 20:00 UTC // ACOUSTIC CHAMBER A",
  totalSeats: 72,
  stageLabel: "[ STAGE PROSCENIUM // ACOUSTIC EMITTER 01 ]",
};

export const TIERS = {
  VIP: {
    name: "PRIME ACOUSTIC POD",
    price: 150,
    color: "#FF9500", // Phosphor Amber / Teenage Engineering Orange
    accentHex: "#FFB03A",
    glowColor: "rgba(255, 149, 0, 0.4)",
    badge: "VIP FIELD",
    sightline: "0.1ms Phase Coherence • Direct Transducer Line",
    features: ["Dedicated Line Out Monitoring", "Zero-Reflection Position", "Hardware Console Access"],
  },
  PREFERRED: {
    name: "MID-FIELD CONSOLE",
    price: 95,
    color: "#E2E8F0", // Titanium Bone White
    accentHex: "#FFFFFF",
    glowColor: "rgba(226, 232, 240, 0.3)",
    badge: "MID-FIELD",
    sightline: "Balanced Binaural Center • Elevated Console Plane",
    features: ["Binaural Stereo Sweet Spot", "Expanded Console Stance", "Priority Signal Ingest"],
  },
  STANDARD: {
    name: "PERIMETER ARRAY",
    price: 55,
    color: "#8E95A5", // Industrial Concrete Slate
    accentHex: "#94A3B8",
    glowColor: "rgba(142, 149, 165, 0.25)",
    badge: "PERIMETER",
    sightline: "Ambient Reverb Boundary • Spatial Diffusion Vista",
    features: ["Panoramic Chamber Vista", "Ambient Soundfield Overlook"],
  },
};

export const INITIAL_SEATS = [];

const rows = [
  { row: "A", tier: "VIP", section: "SECTOR A // FRONT POD" },
  { row: "B", tier: "VIP", section: "SECTOR B // FRONT POD" },
  { row: "C", tier: "PREFERRED", section: "SECTOR C // CONSOLE ROW" },
  { row: "D", tier: "PREFERRED", section: "SECTOR D // CONSOLE ROW" },
  { row: "E", tier: "PREFERRED", section: "SECTOR E // CONSOLE ROW" },
  { row: "F", tier: "STANDARD", section: "SECTOR F // PERIMETER ROW" },
  { row: "G", tier: "STANDARD", section: "SECTOR G // PERIMETER ROW" },
  { row: "H", tier: "STANDARD", section: "SECTOR H // PERIMETER ROW" },
];

const cols = 9;
const FOCAL_X = 450;
const FOCAL_Y = -120;

rows.forEach((r, rowIndex) => {
  const radius = 235 + rowIndex * 44;

  for (let c = 1; c <= cols; c++) {
    const normalizedIndex = c - 5;
    let angleDeg = normalizedIndex * 5.2;

    if (c <= 3) {
      angleDeg -= 3.2;
    } else if (c >= 7) {
      angleDeg += 3.2;
    }

    const angleRad = (angleDeg * Math.PI) / 180;
    const x = Math.round(FOCAL_X + radius * Math.sin(angleRad));
    const y = Math.round(FOCAL_Y + radius * Math.cos(angleRad));
    const rotation = Math.round(-angleDeg);

    const tierObj = TIERS[r.tier];

    INITIAL_SEATS.push({
      id: `${r.row}${c}`,
      row: r.row,
      col: c,
      label: `${r.row}${c}`,
      tier: r.tier,
      section: r.section,
      price: tierObj.price,
      status: "available",
      x,
      y,
      rotation,
      sightline: tierObj.sightline,
    });
  }
});
