import { State, City } from 'country-state-city';
import api from './config';

/**
 * Get all Indian states from the country-state-city package.
 * Returns array of { value: isoCode, label: stateName }
 */
export const getIndianStates = () => {
  const states = State.getStatesOfCountry('IN');
  return states
    .map(s => ({ value: s.isoCode, label: s.name }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

/**
 * Get all cities/districts for a given Indian state ISO code.
 * Returns array of { value: cityName, label: cityName }
 */
export const getCitiesOfState = (stateIsoCode) => {
  if (!stateIsoCode) return [];
  const cities = City.getCitiesOfState('IN', stateIsoCode);
  return cities
    .map(c => ({ value: c.name, label: c.name }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

/**
 * Get the state name from its ISO code.
 */
export const getStateNameByCode = (isoCode) => {
  if (!isoCode) return '';
  const states = State.getStatesOfCountry('IN');
  const state = states.find(s => s.isoCode === isoCode);
  return state ? state.name : isoCode;
};

/**
 * Fetch distinct localities from the backend DB for a given state + district/city.
 * Backend endpoint: GET /api/candidates/localities?state=<stateName>&city=<cityName>
 * Returns array of { value: locality, label: locality }
 */
export const fetchLocalitiesFromDB = async (stateName, city) => {
  if (!city) return [];
  try {
    const params = new URLSearchParams();
    if (stateName) params.append('state', stateName);
    if (city) params.append('city', city);

    const response = await api.get(`/candidates/localities?${params.toString()}`);
    const data = response.data || [];
    return data
      .filter(loc => loc && loc.trim() !== '')
      .map(loc => ({ value: loc, label: loc }))
      .sort((a, b) => a.label.localeCompare(b.label));
  } catch (err) {
    console.warn('Failed to fetch localities from DB:', err.message);
    return [];
  }
};
/**
 * Fetch localities from Geoapify using Geocoding and Places API.
 * 1. Geocode District + State to get (lat, lng)
 * 2. Get nearby localities using Places API
 */
const GEOAPIFY_KEY = 'ac51442bcce84542aa265a99ae2dda34';

export const fetchLocalitiesFromGeoapify = async (district, stateName) => {
  if (!district) return [];

  try {
    // Step 1: Geocode the address (District, State, India)
    const searchText = encodeURIComponent(`${district}, ${stateName}, India`);
    const geoResponse = await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${searchText}&apiKey=${GEOAPIFY_KEY}`
    );
    const geoData = await geoResponse.json();

    if (!geoData.features || geoData.features.length === 0) {
      console.warn('Geocoding failed for:', district);
      return [];
    }

    const [lng, lat] = geoData.features[0].geometry.coordinates;

    // Step 2: Fetch Places (Suburbs and Neighbourhoods)
    // We use 'populated_place.suburb' and 'populated_place.neighbourhood' for human-friendly names (e.g., Mylapore, T. Nagar).
    // 'administrative.county_level' is included as a fallback for areas like Salem Taluks.
    const placesResponse = await fetch(
      `https://api.geoapify.com/v2/places?categories=populated_place.suburb,populated_place.neighbourhood,administrative.suburb_level,administrative.neighbourhood_level,administrative.county_level&filter=circle:${lng},${lat},10000&limit=50&apiKey=${GEOAPIFY_KEY}`
    );
    const placesData = await placesResponse.json();

    if (!placesData.features || placesData.features.length === 0) {
      return [];
    }

    // Extract and clean names, ensuring they are unique and filtered of technical codes
    const localities = [
      ...new Set(
        placesData.features
          .map((f) => {
            const p = f.properties;
            let name = p.name || '';

            // 1. Strip 'Zone X' or 'Ward X' prefixes (e.g., 'Zone 10 Kodambakkam' -> 'Kodambakkam')
            const cleanPattern = /^(Zone|Ward)\s+\d+\s*(.*)/i;
            const match = cleanPattern.exec(name);
            if (match && match[2] && match[2].trim() !== '') {
              name = match[2].trim();
            }

            // 2. If the name is still just a technical code (e.g., 'Ward 139'), 
            // fallback to other descriptive properties if they exist and aren't technical themselves.
            const isTechnical = /^(Ward|Zone)\s+\d+$/i.test(name);
            if (isTechnical) {
              const altName = [p.suburb, p.neighbourhood, p.district]
                .find(val => val && !/^(Ward|Zone)\s+\d+/i.test(val));
              name = altName || '';
            }

            return name.trim();
          })
          .filter(name => name.length > 1) // Discard empty or single-character strings
      ),
    ].sort((a, b) => a.localeCompare(b));

    return localities.map(loc => ({ value: loc, label: loc }));

  } catch (error) {
    console.warn("Error fetching localities from Geoapify:", error);
    return [];
  }
};
