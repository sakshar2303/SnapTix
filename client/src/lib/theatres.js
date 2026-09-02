// Directory of Cinema Theatres & Venues with Multiple Auditoriums & Seating Arrangements
// Supports IMAX Stadium, Insignia VIP Lounge (Twin Loungers), 4DX Motion Pods, and Dolby Cinema

export const CITY_COORDINATES = {
  "Mumbai": { lat: 19.0760, lng: 72.8777 },
  "Delhi-NCR": { lat: 28.6139, lng: 77.2090 },
  "Bengaluru": { lat: 12.9716, lng: 77.5946 },
  "Hyderabad": { lat: 17.3850, lng: 78.4867 },
  "Chennai": { lat: 13.0827, lng: 80.2707 },
  "Pune": { lat: 18.5204, lng: 73.8567 },
  "Ahmedabad": { lat: 23.0225, lng: 72.5714 },
  "Kolkata": { lat: 22.5726, lng: 88.3639 },
};

export const THEATRES_BY_CITY = {
  "Mumbai": [
    {
      id: "mum-pvr-palladium",
      name: "PVR INOX: Phoenix Palladium",
      area: "Lower Parel",
      address: "462, Senapati Bapat Marg, Lower Parel, Mumbai",
      formats: ["IMAX", "Dolby Atmos", "4DX"],
      amenities: ["Recliners", "Gourmet F&B", "Valet Parking", "Wheelchair Access"],
      distanceKm: 2.1,
      lat: 18.9953,
      lng: 72.8242,
      mapQuery: "PVR+INOX+Phoenix+Palladium+Lower+Parel+Mumbai",
      auditoriums: [
        {
          id: "audi-4-imax",
          name: "Audi 4 • IMAX with Laser",
          type: "IMAX",
          screenTag: "IMAX 4K Laser • 70mm Proscenium • DOLBY ATMOS 7.1",
          themeColor: "#00B9F5",
          layoutType: "standard",
          totalSeats: 72,
          tiers: [
            { id: "RECLINER", name: "IMAX RECLINER", price: 550, rows: ["A", "B"], desc: "Motorized Leather Loungers" },
            { id: "PRIME", name: "IMAX PRIME", price: 380, rows: ["C", "D", "E"], desc: "Optimal Center Acoustic Field" },
            { id: "CLASSIC", name: "IMAX CLASSIC", price: 240, rows: ["F", "G", "H"], desc: "High Back Cinema Seating" },
          ],
          showtimes: ["10:15 AM", "01:45 PM", "04:30 PM", "07:30 PM", "10:45 PM"],
        },
        {
          id: "audi-2-insignia",
          name: "Audi 2 • Insignia VIP Lounge",
          type: "VIP_LOUNGE",
          screenTag: "Insignia VIP Lounge • Motorized Full-Recliners • Butler On-Call",
          themeColor: "#E5A93C",
          layoutType: "luxury_couples",
          totalSeats: 48,
          tiers: [
            { id: "ROYAL", name: "ROYAL SUITE LOUNGER", price: 850, rows: ["A", "B"], desc: "Full-Flat Leather Beds with Service Table" },
            { id: "PREMIERE", name: "PREMIERE RECLINER", price: 650, rows: ["C", "D"], desc: "Motorized Recliners & Personal Lamp" },
            { id: "CLUB", name: "CLUB LOUNGER", price: 480, rows: ["E", "F"], desc: "Plush Wide Cushioned Seats" },
          ],
          showtimes: ["11:30 AM", "03:15 PM", "06:45 PM", "10:00 PM"],
        },
        {
          id: "audi-1-4dx",
          name: "Audi 1 • 4DX Motion Theatre",
          type: "4DX",
          screenTag: "4DX Motion Simulator • Wind, Mist, Scent & Vibration FX",
          themeColor: "#F59E0B",
          layoutType: "quad_pods",
          totalSeats: 48,
          tiers: [
            { id: "4DX_VIP", name: "4DX PRIME PODS", price: 490, rows: ["A", "B", "C"], desc: "Heave, Pitch & Roll Motion Simulation" },
            { id: "4DX_STD", name: "4DX STANDARD", price: 360, rows: ["D", "E", "F"], desc: "Synchronized Motion Seats with Environmental FX" },
          ],
          showtimes: ["12:00 PM", "03:30 PM", "07:00 PM", "10:15 PM"],
        },
      ],
    },
    {
      id: "mum-pvr-jio-bkc",
      name: "Maison INOX: Jio World Drive",
      area: "Bandra Kurla Complex (BKC)",
      address: "Jio World Drive, Bandra Kurla Complex, Bandra East, Mumbai",
      formats: ["Dolby Cinema", "Laser", "Lounge"],
      amenities: ["Butler Service", "Motorized Recliners", "Private Elevator"],
      distanceKm: 4.8,
      lat: 19.0657,
      lng: 72.8688,
      mapQuery: "Maison+INOX+Jio+World+Drive+BKC+Mumbai",
      auditoriums: [
        {
          id: "audi-1-dolby-cinema",
          name: "Audi 1 • Dolby Cinema",
          type: "DOLBY",
          screenTag: "Dolby Vision HDR & Dolby Atmos • Infinite Contrast",
          themeColor: "#3B82F6",
          layoutType: "standard",
          totalSeats: 72,
          tiers: [
            { id: "MAISON_VIP", name: "MAISON SUITE", price: 900, rows: ["A", "B"], desc: "Bespoke Italian Leather Recliners" },
            { id: "DOLBY_PRIME", name: "DOLBY PRIME", price: 550, rows: ["C", "D", "E"], desc: "Optimal Dolby Atmos Surround Position" },
            { id: "DOLBY_CLASSIC", name: "DOLBY CLASSIC", price: 320, rows: ["F", "G", "H"], desc: "Ergonomic High Back Cinema Seating" },
          ],
          showtimes: ["11:00 AM", "02:30 PM", "06:00 PM", "09:30 PM"],
        },
        {
          id: "audi-rooftop-drivein",
          name: "Open Air • Rooftop Drive-In",
          type: "OPEN_AIR",
          screenTag: "Under The Stars • Mumbai Rooftop Skyline Screen",
          themeColor: "#8B5CF6",
          layoutType: "luxury_couples",
          totalSeats: 48,
          tiers: [
            { id: "CABANA_BED", name: "SKYLINE CABANA", price: 1200, rows: ["A", "B"], desc: "Twin Luxury Daybed with Warm Blankets" },
            { id: "LOUNGE_CHAIR", name: "STARGAZER LOUNGE", price: 750, rows: ["C", "D"], desc: "Steamer Chairs with Wireless Audio" },
            { id: "DECK_SEAT", name: "UPPER DECK", price: 450, rows: ["E", "F"], desc: "Panoramic Rooftop Deck Sightline" },
          ],
          showtimes: ["07:45 PM (Sunset)", "10:45 PM (Night Owl)"],
        },
      ],
    },
    {
      id: "mum-cinepolis-andheri",
      name: "Cinépolis: Fun Republic Mall",
      area: "Andheri West",
      address: "Fun Republic Mall, Link Road, Andheri West, Mumbai",
      formats: ["4DX", "RealD 3D", "Macro XE"],
      amenities: ["Motion Seats", "Environmental FX", "Snack Bar"],
      distanceKm: 9.4,
      lat: 19.1363,
      lng: 72.8315,
      mapQuery: "Cinepolis+Fun+Republic+Mall+Andheri+West+Mumbai",
      auditoriums: [
        {
          id: "audi-3-macro-xe",
          name: "Audi 3 • Macro XE Giant Screen",
          type: "STANDARD",
          screenTag: "Macro XE Curved Wall-to-Wall • Dual 4K Christie",
          themeColor: "#1EA83C",
          layoutType: "standard",
          totalSeats: 72,
          tiers: [
            { id: "VIP_RECLINER", name: "VIP RECLINER", price: 450, rows: ["A", "B"], desc: "Motorized Leather Seats" },
            { id: "PRIME", name: "MACRO PRIME", price: 280, rows: ["C", "D", "E"], desc: "Center Acoustic Field" },
            { id: "CLASSIC", name: "CLASSIC", price: 180, rows: ["F", "G", "H"], desc: "Standard High Back Support" },
          ],
          showtimes: ["10:30 AM", "01:15 PM", "05:00 PM", "08:15 PM", "11:15 PM"],
        },
      ],
    },
  ],

  "Delhi-NCR": [
    {
      id: "del-pvr-directors-cut",
      name: "PVR Director's Cut: Ambience Mall",
      area: "Vasant Kunj",
      address: "Ambience Mall, Nelson Mandela Marg, Vasant Kunj, New Delhi",
      formats: ["Director's Cut", "Dolby Atmos"],
      amenities: ["Personal Concierge", "Full Bar", "Motorized Recliners"],
      distanceKm: 3.5,
      lat: 28.5402,
      lng: 77.1557,
      mapQuery: "PVR+Directors+Cut+Ambience+Mall+Vasant+Kunj+Delhi",
      auditoriums: [
        {
          id: "audi-1-directors-cut",
          name: "Audi 1 • Director's Cut Platinum",
          type: "VIP_LOUNGE",
          screenTag: "Director's Cut Platinum • Ultra-Luxury Dining at Seat",
          themeColor: "#E5A93C",
          layoutType: "luxury_couples",
          totalSeats: 48,
          tiers: [
            { id: "PLATINUM", name: "PLATINUM RECLINER", price: 950, rows: ["A", "B"], desc: "Italian Leather Recliner with Butler Call" },
            { id: "GOLD", name: "GOLD LOUNGER", price: 750, rows: ["C", "D"], desc: "Plush Recliner with Side Console" },
            { id: "SILVER", name: "SILVER CLUB", price: 550, rows: ["E", "F"], desc: "Extra Legroom Ergonomic Lounger" },
          ],
          showtimes: ["11:30 AM", "03:00 PM", "06:45 PM", "10:15 PM"],
        },
      ],
    },
    {
      id: "del-pvr-select-citywalk",
      name: "PVR INOX: Select CITYWALK",
      area: "Saket",
      address: "A-3, District Centre, Saket, New Delhi",
      formats: ["IMAX", "Dolby Atmos"],
      amenities: ["Prime Center Rows", "Food Court Access"],
      distanceKm: 5.1,
      lat: 28.5284,
      lng: 77.2185,
      mapQuery: "PVR+Select+CITYWALK+Saket+New+Delhi",
      auditoriums: [
        {
          id: "audi-3-imax-saket",
          name: "Audi 3 • IMAX with Laser",
          type: "IMAX",
          screenTag: "IMAX with Laser • 12-Channel Immersive Sound",
          themeColor: "#00B9F5",
          layoutType: "standard",
          totalSeats: 72,
          tiers: [
            { id: "RECLINER", name: "IMAX RECLINER", price: 580, rows: ["A", "B"], desc: "Motorized Leather Loungers" },
            { id: "PRIME", name: "IMAX PRIME", price: 390, rows: ["C", "D", "E"], desc: "Center Acoustic Field" },
            { id: "CLASSIC", name: "IMAX CLASSIC", price: 250, rows: ["F", "G", "H"], desc: "Standard High Back Support" },
          ],
          showtimes: ["10:00 AM", "01:30 PM", "05:00 PM", "08:30 PM"],
        },
      ],
    },
  ],

  "Bengaluru": [
    {
      id: "blr-pvr-forum-south",
      name: "PVR INOX: Forum South Bangalore",
      area: "Kanakapura Road",
      address: "Forum South Mall, Konanakunte Cross, Bengaluru",
      formats: ["IMAX", "P[XL]", "Dolby Atmos"],
      amenities: ["Laser 4K", "Motorized Recliners", "Direct Metro Walkway"],
      distanceKm: 2.8,
      lat: 12.8887,
      lng: 77.5647,
      mapQuery: "PVR+Forum+South+Bangalore+Kanakapura+Road",
      auditoriums: [
        {
          id: "audi-4-imax-blr",
          name: "Audi 4 • IMAX with Laser",
          type: "IMAX",
          screenTag: "IMAX Laser 4K • Commercial Screen Proscenium",
          themeColor: "#00B9F5",
          layoutType: "standard",
          totalSeats: 72,
          tiers: [
            { id: "RECLINER", name: "IMAX RECLINER", price: 520, rows: ["A", "B"], desc: "Motorized Leather Loungers" },
            { id: "PRIME", name: "IMAX PRIME", price: 360, rows: ["C", "D", "E"], desc: "Center Acoustic Field" },
            { id: "CLASSIC", name: "IMAX CLASSIC", price: 220, rows: ["F", "G", "H"], desc: "Standard High Back Support" },
          ],
          showtimes: ["10:15 AM", "01:45 PM", "05:15 PM", "08:45 PM"],
        },
        {
          id: "audi-2-pxl-blr",
          name: "Audi 2 • P[XL] Gigantic Screen",
          type: "STANDARD",
          screenTag: "P[XL] Panoramic Giant Screen • RGB Dual Laser",
          themeColor: "#1EA83C",
          layoutType: "standard",
          totalSeats: 72,
          tiers: [
            { id: "PXL_RECLINER", name: "P[XL] RECLINER", price: 460, rows: ["A", "B"], desc: "Plush Recliners" },
            { id: "PXL_PRIME", name: "P[XL] PRIME", price: 320, rows: ["C", "D", "E"], desc: "Optimal Mid-Field Center" },
            { id: "PXL_CLASSIC", name: "P[XL] CLASSIC", price: 200, rows: ["F", "G", "H"], desc: "Comfort Seating" },
          ],
          showtimes: ["11:00 AM", "02:30 PM", "06:15 PM", "09:45 PM"],
        },
      ],
    },
  ],

  "Hyderabad": [
    {
      id: "hyd-prasads-multiplex",
      name: "Prasads Multiplex: Necklace Road",
      area: "Khairatabad",
      address: "NTR Gardens, Necklace Road, Hyderabad",
      formats: ["PCX Giant Screen", "Dolby Atmos"],
      amenities: ["Iconic 64ft Screen", "Lakeside Promenade"],
      distanceKm: 3.2,
      lat: 17.4116,
      lng: 78.4705,
      mapQuery: "Prasads+Multiplex+Necklace+Road+Hyderabad",
      auditoriums: [
        {
          id: "screen-6-pcx-hyd",
          name: "Screen 6 • Large Screen PCX",
          type: "STANDARD",
          screenTag: "Prasads 64ft Giant Screen • Dual 4K Laser & Dolby Atmos",
          themeColor: "#00B9F5",
          layoutType: "standard",
          totalSeats: 72,
          tiers: [
            { id: "PCX_BALCONY", name: "PCX RECLINER BALCONY", price: 450, rows: ["A", "B"], desc: "Elevated Balcony Recliners" },
            { id: "PCX_PRIME", name: "PCX PRIME MEZZANINE", price: 290, rows: ["C", "D", "E"], desc: "Center Acoustic Field" },
            { id: "PCX_STALLS", name: "PCX STALLS", price: 180, rows: ["F", "G", "H"], desc: "Standard Seating" },
          ],
          showtimes: ["10:30 AM", "02:00 PM", "05:30 PM", "09:00 PM"],
        },
      ],
    },
  ],
};

// Calculate distance between two lat/lng pairs using Haversine formula
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Find closest city based on latitude and longitude
export function findClosestCity(lat, lng) {
  let closestCity = "Mumbai";
  let minDistance = Infinity;

  Object.entries(CITY_COORDINATES).forEach(([city, coords]) => {
    const dist = calculateDistanceKm(lat, lng, coords.lat, coords.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closestCity = city;
    }
  });

  return { city: closestCity, distanceKm: minDistance };
}

// Get theatres for a city
export function getTheatresForCity(city) {
  return THEATRES_BY_CITY[city] || THEATRES_BY_CITY["Mumbai"];
}
