// Directory of Cinema Theatres & Venues across Major Cities
// Supports proximity calculation with GPS Geolocation

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
      audi: "Audi 4 • IMAX with Laser (DOLBY ATMOS 7.1)",
      formats: ["IMAX", "Dolby Atmos", "Laser"],
      amenities: ["Recliners", "Gourmet F&B", "Valet Parking", "Wheelchair Access"],
      distanceKm: 2.1,
      lat: 18.9953,
      lng: 72.8242,
      showtimes: ["10:15 AM", "01:45 PM", "04:30 PM", "07:30 PM", "10:45 PM"],
      mapQuery: "PVR+INOX+Phoenix+Palladium+Lower+Parel+Mumbai",
    },
    {
      id: "mum-pvr-jio-bkc",
      name: "Maison INOX: Jio World Drive",
      area: "Bandra Kurla Complex (BKC)",
      address: "Jio World Drive, Bandra Kurla Complex, Bandra East, Mumbai",
      audi: "Audi 2 • Dolby Cinema & Rooftop Drive-In",
      formats: ["Dolby Cinema", "Laser", "Lounge"],
      amenities: ["Butler Service", "Motorized Recliners", "Private Elevator"],
      distanceKm: 4.8,
      lat: 19.0657,
      lng: 72.8688,
      showtimes: ["11:00 AM", "02:30 PM", "06:00 PM", "09:30 PM"],
      mapQuery: "Maison+INOX+Jio+World+Drive+BKC+Mumbai",
    },
    {
      id: "mum-cinepolis-andheri",
      name: "Cinépolis: Fun Republic Mall",
      area: "Andheri West",
      address: "Fun Republic Mall, Link Road, Andheri West, Mumbai",
      audi: "Audi 1 • 4DX & VIP Lounge",
      formats: ["4DX", "RealD 3D", "Macro XE"],
      amenities: ["Motion Seats", "Environmental FX", "Snack Bar"],
      distanceKm: 9.4,
      lat: 19.1363,
      lng: 72.8315,
      showtimes: ["10:30 AM", "01:15 PM", "05:00 PM", "08:15 PM", "11:15 PM"],
      mapQuery: "Cinepolis+Fun+Republic+Mall+Andheri+West+Mumbai",
    },
    {
      id: "mum-inox-nariman",
      name: "INOX: CR2 Mall",
      area: "Nariman Point",
      address: "CR2 Mall, Barrister Rajni Patel Marg, Nariman Point, Mumbai",
      audi: "Audi 3 • Insignia Gold Screen",
      formats: ["Dolby Atmos", "Insignia VIP"],
      amenities: ["Chef Curated Dining", "Plush Loungers"],
      distanceKm: 6.2,
      lat: 18.9272,
      lng: 72.8228,
      showtimes: ["12:00 PM", "03:45 PM", "07:15 PM", "10:30 PM"],
      mapQuery: "INOX+CR2+Mall+Nariman+Point+Mumbai",
    },
  ],

  "Delhi-NCR": [
    {
      id: "del-pvr-directors-cut",
      name: "PVR Director's Cut: Ambience Mall",
      area: "Vasant Kunj",
      address: "Ambience Mall, Nelson Mandela Marg, Vasant Kunj, New Delhi",
      audi: "Audi 1 • Director's Cut Platinum",
      formats: ["Dolby Atmos", "Laser Projection"],
      amenities: ["Personal Concierge", "Full Bar", "Motorized Recliners"],
      distanceKm: 3.5,
      lat: 28.5402,
      lng: 77.1557,
      showtimes: ["11:30 AM", "03:00 PM", "06:45 PM", "10:15 PM"],
      mapQuery: "PVR+Directors+Cut+Ambience+Mall+Vasant+Kunj+Delhi",
    },
    {
      id: "del-pvr-select-citywalk",
      name: "PVR INOX: Select CITYWALK",
      area: "Saket",
      address: "A-3, District Centre, Saket, New Delhi",
      audi: "Audi 3 • IMAX with Laser",
      formats: ["IMAX", "Dolby Atmos"],
      amenities: ["Prime Center Rows", "Food Court Access", "Metro Connectivity"],
      distanceKm: 5.1,
      lat: 28.5284,
      lng: 77.2185,
      showtimes: ["10:00 AM", "01:30 PM", "05:00 PM", "08:30 PM"],
      mapQuery: "PVR+Select+CITYWALK+Saket+New+Delhi",
    },
    {
      id: "del-cinepolis-dlf-saket",
      name: "Cinépolis: DLF Avenue",
      area: "Saket",
      address: "DLF Avenue Mall, Press Enclave Marg, Saket, New Delhi",
      audi: "Audi 2 • RealD 3D Surround",
      formats: ["RealD 3D", "Macro XE"],
      amenities: ["Recliners", "Express Counter"],
      distanceKm: 5.4,
      lat: 28.5292,
      lng: 77.2198,
      showtimes: ["12:15 PM", "04:00 PM", "07:45 PM", "11:00 PM"],
      mapQuery: "Cinepolis+DLF+Avenue+Saket+New+Delhi",
    },
  ],

  "Bengaluru": [
    {
      id: "blr-pvr-forum-south",
      name: "PVR INOX: Forum South Bangalore",
      area: "Kanakapura Road",
      address: "Forum South Mall, Konanakunte Cross, Bengaluru",
      audi: "Audi 4 • IMAX with Laser",
      formats: ["IMAX", "Dolby Atmos 7.1"],
      amenities: ["Laser 4K", "Motorized Recliners", "Direct Metro Walkway"],
      distanceKm: 2.8,
      lat: 12.8887,
      lng: 77.5647,
      showtimes: ["10:15 AM", "01:45 PM", "05:15 PM", "08:45 PM"],
      mapQuery: "PVR+Forum+South+Bangalore+Kanakapura+Road",
    },
    {
      id: "blr-pvr-phoenix-marketcity",
      name: "PVR INOX: Phoenix Marketcity",
      area: "Whitefield",
      address: "Whitefield Main Road, Mahadevapura, Bengaluru",
      audi: "Audi 5 • P[XL] Gigantic Screen",
      formats: ["P[XL]", "Dolby Atmos", "4K RGB"],
      amenities: ["Dual Laser 4K", "Stadium Seating", "Food Truck Zone"],
      distanceKm: 7.2,
      lat: 12.9960,
      lng: 77.6963,
      showtimes: ["11:00 AM", "02:30 PM", "06:15 PM", "09:45 PM"],
      mapQuery: "PVR+Phoenix+Marketcity+Whitefield+Bangalore",
    },
    {
      id: "blr-cinepolis-koramangala",
      name: "Cinépolis: Nexus Mall",
      area: "Koramangala",
      address: "Nexus Mall, Hosur Road, Koramangala, Bengaluru",
      audi: "Audi 2 • VIP Lounge",
      formats: ["VIP", "Dolby 7.1"],
      amenities: ["Leather Loungers", "Table Service"],
      distanceKm: 4.1,
      lat: 12.9345,
      lng: 77.6115,
      showtimes: ["12:45 PM", "04:15 PM", "07:45 PM", "11:15 PM"],
      mapQuery: "Cinepolis+Nexus+Mall+Koramangala+Bangalore",
    },
  ],

  "Hyderabad": [
    {
      id: "hyd-prasads-multiplex",
      name: "Prasads Multiplex: Necklace Road",
      area: "Khairatabad",
      address: "NTR Gardens, Necklace Road, Hyderabad",
      audi: "Screen 6 • Large Screen PCX with Dolby Atmos",
      formats: ["PCX Giant Screen", "Dual 4K Laser", "Dolby Atmos"],
      amenities: ["Iconic 64ft Screen", "Lakeside Promenade", "VIP Box"],
      distanceKm: 3.2,
      lat: 17.4116,
      lng: 78.4705,
      showtimes: ["10:30 AM", "02:00 PM", "05:30 PM", "09:00 PM"],
      mapQuery: "Prasads+Multiplex+Necklace+Road+Hyderabad",
    },
    {
      id: "hyd-amb-cinemas",
      name: "AMB Cinemas: Gachibowli",
      area: "Kondapur",
      address: "Sarath City Capital Mall, Gachibowli - Miyapur Road, Hyderabad",
      audi: "Screen 1 • Laser Dolby Atmos & M-Lounge",
      formats: ["Laser Dolby Atmos", "M-Lounge"],
      amenities: ["Celebrity Designed Luxury", "Custom Food Menu"],
      distanceKm: 6.8,
      lat: 17.4578,
      lng: 78.3639,
      showtimes: ["11:15 AM", "02:45 PM", "06:15 PM", "09:45 PM"],
      mapQuery: "AMB+Cinemas+Sarath+City+Mall+Hyderabad",
    },
  ],

  "Chennai": [
    {
      id: "chn-spi-sathyam",
      name: "SPI Cinemas: Sathyam",
      area: "Royapettah",
      address: "8, Thiru-Vi-Ka Road, Royapettah, Chennai",
      audi: "Main Screen • RDX 4K & Dolby Atmos",
      formats: ["RDX 4K", "Dolby Atmos"],
      amenities: ["Legendary Popcorn Bar", "Ergonomic Seating"],
      distanceKm: 2.5,
      lat: 13.0569,
      lng: 78.0261,
      showtimes: ["10:45 AM", "02:15 PM", "06:00 PM", "09:30 PM"],
      mapQuery: "SPI+Cinemas+Sathyam+Royapettah+Chennai",
    },
    {
      id: "chn-pvr-express-avenue",
      name: "PVR INOX: Express Avenue",
      area: "Whites Road",
      address: "Express Avenue Mall, Whites Road, Royapettah, Chennai",
      audi: "Audi 2 • Escape Panoramic Screen",
      formats: ["Escape Screen", "Dolby Atmos"],
      amenities: ["Three-Screen Panoramic View", "VIP Recliner"],
      distanceKm: 3.1,
      lat: 13.0594,
      lng: 80.2644,
      showtimes: ["11:30 AM", "03:00 PM", "06:30 PM", "10:00 PM"],
      mapQuery: "PVR+Express+Avenue+Mall+Chennai",
    },
  ],

  "Pune": [
    {
      id: "pune-pvr-pavilion",
      name: "PVR INOX: The Pavilion",
      area: "Senapati Bapat Road",
      address: "The Pavilion Mall, S.B. Road, Shivajinagar, Pune",
      audi: "Audi 4 • IMAX Laser & 4DX",
      formats: ["IMAX", "4DX", "Dolby Atmos"],
      amenities: ["Motorized Recliners", "Laser 4K"],
      distanceKm: 3.0,
      lat: 18.5332,
      lng: 73.8315,
      showtimes: ["10:15 AM", "01:30 PM", "04:45 PM", "08:15 PM"],
      mapQuery: "PVR+The+Pavilion+Mall+Pune",
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
