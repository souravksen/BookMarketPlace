export function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// Pseudo-random number generator based on string
function seededRandom(seedStr) {
  let h = 0;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(31, h) + seedStr.charCodeAt(i) | 0;
  }
  const t = h += 0x6D2B79F5;
  let r = Math.imul(t ^ t >>> 15, t | 1);
  r ^= r + Math.imul(r ^ r >>> 7, r | 61);
  return ((r ^ r >>> 14) >>> 0) / 4294967296;
}

// Generate stable mock coordinates for a book near a center point (e.g. user location)
export function getMockBookLocation(bookId, centerLat = 28.6139, centerLng = 77.2090, maxRadiusKm = 15) {
  const rand1 = seededRandom(bookId + "lat");
  const rand2 = seededRandom(bookId + "lng");
  
  // Approximate conversion: 1 degree latitude is ~111 km
  const radiusInDegrees = maxRadiusKm / 111;
  
  // Random point within circle
  const u = rand1 + rand2;
  const r = radiusInDegrees * Math.sqrt(rand1);
  const theta = rand2 * 2 * Math.PI;
  
  const latOffset = r * Math.cos(theta);
  // Adjust longitude offset for latitude
  const lngOffset = (r * Math.sin(theta)) / Math.cos(centerLat * (Math.PI / 180));
  
  return {
    lat: centerLat + latOffset,
    lng: centerLng + lngOffset,
    // Add some random city names based on offset
    city: ['Downtown', 'Westside', 'North Area', 'East Sector', 'South Park', 'Metro Hub', 'University District'][Math.floor(rand1 * 7)]
  };
}
