import axios from 'axios';

// Local fallback data for Indian cities and their sub-localities
const FALLBACK_LOCALITIES = {
  'Chennai': ['Adyar', 'Anna Nagar', 'Guindy', 'Kodambakkam', 'Mylapore', 'Perambur', 'Porur', 'Sholinganallur', 'T. Nagar', 'Velachery'],
  'Bangalore': ['Whitefield', 'Koramangala', 'Indiranagar', 'Cunningham Road', 'MG Road', 'Malleswaram', 'Yeshwanthpur', 'Jayanagar', 'Banashankari', 'Domlur'],
  'Mumbai': ['Bandra', 'Dadar', 'Fort', 'Goregaon', 'Juhu', 'Malad', 'Marine Drive', 'Navi Mumbai', 'Powai', 'Thane'],
  'Hyderabad': ['Madhapur', 'Gachibowli', 'Kondapur', 'Banjara Hills', 'Secunderabad', 'Jubilee Hills', 'Ameerpet', 'Kukatpally', 'Charminar', 'Abids'],
  'Pune': ['Hinjewadi', 'Magarpatta', 'Kalyani Nagar', 'Koregaon Park', 'Camp', 'Deccan', 'Model Colony', 'Wanowrie', 'Baner', 'Viman Nagar'],
  'Coimbatore': ['Peelamedu', 'Gandhipuram', 'Ukkadam', 'Kuniyamuthur', 'RS Puram', 'Koniampalayam', 'Thadagam', 'Saibaba Colony', 'Tatabad', 'North Coimbatore'],
  'Dindigul': ['Dindigul Town', 'Natarampalli', 'Salem Road', 'Gnanodaya Nagar', 'Veerapandi', 'Oddanchatram', 'Nilakottai', 'Batlagundu', 'Attur', 'Palacode'],
  'Erode': ['Erode City', 'Erode Town', 'Bhavani', 'Perundurai', 'Gobichettipalayam', 'Modakurichi', 'Salem Junction', 'Nambiyur', 'Kodumudi', 'Sathyamangalam'],
  'Madurai': ['Madurai City', 'Madurai East', 'Madurai West', 'Paravai', 'Sellur', 'Avaniyapuram', 'Tirupparankundram', 'Vandiyur', 'Melur', 'Thirumangalam'],
  'Nagercoil': ['Nagercoil Town', 'Colachel', 'Padmanabhapuram', 'Eraniel', 'Pechiparai', 'Valliyur', 'Sankarankovil', 'Tenkasi', 'Tirunelveli', 'Morningside'],
  'Salem': ['Salem City', 'Salem North', 'Salem South', 'Athankarai', 'Pagudampalayam', 'Bethelpet', 'Kondalampatti', 'Suramangalam', 'Vedaranyam', 'Omalur'],
  'Thanjavur': ['Thanjavur Town', 'Kumbakonam', 'Mayiladuthurai', 'Papanasam', 'Thirukkoshtyur', 'Mannargudi', 'Needamangalam', 'Kollidam', 'Aravidu', 'Tanjore City'],
  'Thoothukudi': ['Thoothukudi Town', 'Tirunelveli', 'Nagercoil', 'Kayalpatnam', 'Tvm', 'Udangudi', 'Sathankulam', 'Alwarkurichi', 'Thisayanvilai', 'Kanyakumari'],
  'Tiruchirappalli': ['Trichy City', 'Trichy East', 'Trichy West', 'Srirangam', 'Samayapuram', 'Pudukkottai', 'Ariyalur', 'Jayamkondam', 'Musiri', 'Thuraiyur'],
  'Tiruppur': ['Tiruppur City', 'Avinashi', 'Kangeyam', 'Uthukuli', 'Noyyal', 'Moolapalayam', 'Velukkudi', 'Palladam', 'Annur', 'Dharapuram'],
  'Vellore': ['Vellore Town', 'Vellore City', 'Kanchipuram', 'Ranipet', 'Tirupati', 'Chittoor', 'Andhra Pradesh Border', 'Gandarvakottai', 'Gudiyattam', 'Sholinghur']
};

// Cache to avoid repeated API calls
const localityCache = new Map();

// Nominatim API - Free, no key required (OpenStreetMap)
const fetchFromNominatim = async (city) => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: `${city}, India`,
        format: 'json',
        limit: 1
      },
      timeout: 5000
    });

    if (response.data.length === 0) return null;

    const { lat, lon } = response.data[0];

    // Fetch nearby places using Nominatim reverse geocoding with zoom for sub-localities
    const reverseResponse = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        format: 'json',
        lat,
        lon,
        zoom: 12,
        addressdetails: 1
      },
      timeout: 5000
    });

    // Extract neighborhoods/sub-localities from address details
    const address = reverseResponse.data.address || {};
    const neighborhoods = [];

    if (address.neighbourhood) neighborhoods.push(address.neighbourhood);
    if (address.suburb) neighborhoods.push(address.suburb);
    if (address.village) neighborhoods.push(address.village);
    if (address.hamlet) neighborhoods.push(address.hamlet);

    return neighborhoods.length > 0 ? neighborhoods : null;
  } catch (error) {
    console.warn('Nominatim API failed:', error.message);
    return null;
  }
};

// Overpass API - Advanced OSM querying (Free, no key required)
const fetchFromOverpass = async (city) => {
  try {
    const query = `
      [bbox:-90,-180,90,180];
      (
        node["name"="${city}"]["admin_level"=8];
        way["name"="${city}"]["admin_level"=8];
        relation["name"="${city}"]["admin_level"=8];
      );
      out center;
    `;

    const response = await axios.post('https://overpass-api.de/api/interpreter', query, {
      timeout: 5000,
      headers: { 'Content-Type': 'text/plain' }
    });

    // Parse neighborhoods from response
    if (response.data.elements && response.data.elements.length > 0) {
      const neighborhoods = response.data.elements
        .filter(el => el.tags?.name)
        .map(el => el.tags.name)
        .filter(name => name !== city);
      return neighborhoods.length > 0 ? neighborhoods : null;
    }
    return null;
  } catch (error) {
    console.warn('Overpass API failed:', error.message);
    return null;
  }
};

// Google Places API integration (if keys are provided via backend proxy)
// This requires backend support to avoid exposing API keys
// Placeholder for future implementation
// const fetchFromGooglePlaces = async (city, googleApiKey) => {
//   if (!googleApiKey) return null;
//   try {
//     return null; // Implement after backend proxy is ready
//   } catch (error) {
//     console.warn('Google Places API failed:', error.message);
//     return null;
//   }
// };

/**
 * Fetch localities for a city with multi-source fallback
 * Priority: Nominatim → Overpass → Fallback data
 */
export const fetchLocalitiesMultiSource = async (city) => {
  if (!city) return [];

  // Check cache first
  if (localityCache.has(city)) {
    return localityCache.get(city);
  }

  let localities = null;

  // Try Nominatim first (fastest for most Indian cities)
  localities = await fetchFromNominatim(city);

  // Try Overpass if Nominatim fails
  if (!localities || localities.length === 0) {
    localities = await fetchFromOverpass(city);
  }

  // Fall back to hardcoded data
  if (!localities || localities.length === 0) {
    localities = FALLBACK_LOCALITIES[city] || [];
  }

  // Deduplicate and cache
  const unique = [...new Set(localities)];
  localityCache.set(city, unique);

  return unique;
};

/**
 * Get all Indian states and their cities
 */
export const getIndianStatesAndCities = () => {
  return {
    'Tamil Nadu': Object.keys(FALLBACK_LOCALITIES).filter(city => 
      ['Chennai', 'Coimbatore', 'Dindigul', 'Erode', 'Madurai', 'Nagercoil', 'Salem', 'Thanjavur', 'Thoothukudi', 'Tiruchirappalli', 'Tiruppur', 'Vellore'].includes(city)
    ),
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
    'Telangana': ['Hyderabad', 'Secunderabad', 'Warangal', 'Vijayawada'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'],
    'Delhi': ['New Delhi', 'Delhi Central', 'East Delhi', 'West Delhi', 'North Delhi']
  };
};

// Clear cache if needed
export const clearLocalityCache = () => {
  localityCache.clear();
};

// Get cache stats (for debugging)
export const getCacheStats = () => {
  return {
    size: localityCache.size,
    keys: Array.from(localityCache.keys())
  };
};
