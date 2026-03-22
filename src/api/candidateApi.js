import axios from 'axios';
import { fetchLocalitiesMultiSource, getIndianStatesAndCities } from './localityService';

const BASE = 'http://localhost:8080/candidates';

// Build filter URL from filters object
export const buildFilterParams = (filters) => {
  const params = new URLSearchParams();

  if (filters.searchQuery?.trim()) params.append('role', filters.searchQuery.trim());
  if (filters.skill?.trim())        params.append('skill', filters.skill.trim());
  if (filters.role?.trim())         params.append('role',  filters.role.trim());
  if (filters.state?.trim())        params.append('state', filters.state.trim());
  if (filters.location?.trim())     params.append('location', filters.location.trim());
  if (filters.locality?.trim())     params.append('locality', filters.locality.trim());
  if (filters.expRange?.trim())     params.append('expRange', filters.expRange.trim());
  if (filters.noticePeriod?.trim()) params.append('noticePeriod', filters.noticePeriod.trim());

  // Convert salary range to min/max LPA numbers
  if (filters.salaryRange) {
    switch (filters.salaryRange) {
      case '3-6':
        params.append('minSalary', 3);
        params.append('maxSalary', 6);
        break;
      case '6-10':
        params.append('minSalary', 6);
        params.append('maxSalary', 10);
        break;
      case '10+':
        params.append('minSalary', 10);
        break;
      default:
        break;
    }
  }

  return params.toString();
};

// Fetch filtered candidates
export const fetchFilteredCandidates = async (filters) => {
  const params = buildFilterParams(filters);
  const url = `${BASE}/filter?${params}`;
  console.log('Fetching:', url);
  const res = await axios.get(url);
  return res.data;
};

// Fetch single candidate by ID
export const fetchCandidateById = async (id) => {
  const res = await axios.get(`${BASE}/${id}`);
  return res.data;
};

// Fetch suggestions
export const fetchSuggestions = async (query) => {
  if (!query || query.trim().length < 1) return [];
  const res = await axios.get(`${BASE}/suggestions?query=${encodeURIComponent(query)}`);
  return res.data;
};

// Fetch localities for a city (multi-source: Nominatim → Overpass → Fallback)
export const fetchLocalities = async (city) => {
  if (!city) return [];
  try {
    const localities = await fetchLocalitiesMultiSource(city);
    return localities;
  } catch (error) {
    console.error('Error fetching localities:', error);
    return [];
  }
};

// Get all Indian states and their cities
export const getStatesAndCities = () => {
  return getIndianStatesAndCities();
};
