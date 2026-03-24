import { useState, useEffect, useCallback } from 'react';
import api from '../api/config';

// Mock data for initial development if API is not running
const MOCK_CANDIDATES = [
  {
    id: 1,
    name: 'Test',
    role: 'Mr.',
    location: 'Chennai (Vadapalani)',
    experience: '3 Years years',
    salaryRange: '1000000.0 - 1200000.0',
    skills: ['JavaScript', 'Java', 'React', 'SQL', 'AWS', 'Spring Boot'],
    noticePeriod: '2 Months',
    bio: 'An experienced software engineer with a strong background in full-stack development.',
    contact: { email: 'test@example.com', phone: '+91 99999 00000' }
  },
  {
    id: 2,
    name: 'Karthik Murali',
    role: 'Mr.',
    location: 'Chennai (Vadapalani)',
    experience: '15 Years years',
    salaryRange: '1500000.0 - 2500000.0',
    skills: ['JavaScript', 'Python', 'Java', 'React', 'AWS', 'Node.js'],
    noticePeriod: '1 Month',
    bio: 'Senior architect specializing in cloud-native applications and scalable systems.',
    contact: { email: 'karthik@example.com', phone: '+91 88888 11111' }
  },
  {
    id: 3,
    name: 'Murali Karthikeyan',
    role: 'Mr.',
    location: 'Chennai (Adyar)',
    experience: '16 Years years',
    salaryRange: '1200000.0 - 1500000.0',
    skills: ['SQL', 'React', 'Node.js', 'Azure', 'Docker'],
    noticePeriod: '1 Month',
    bio: 'Lead developer with a focus on database optimization and backend performance.',
    contact: { email: 'murali@example.com', phone: '+91 77777 22222' }
  }
];

const useCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const normalizeCandidates = useCallback((data) => {
    return data.map(c => ({
      ...c,
      role: c.jobRole || c.role || 'Professional',
      skills: typeof c.skills === 'string' 
        ? c.skills.split(',').map(s => s.trim()) 
        : Array.isArray(c.skills) ? c.skills : [],
      experienceInt: typeof c.experience === 'number' ? c.experience : parseInt(c.experience) || 0,
      experience: typeof c.experience === 'number' 
        ? `${c.experience} Years` 
        : c.experience,
      salaryRange: c.salaryRange || (c.expectedSalary ? `${c.expectedSalary} LPA` : 'Not specified')
    }));
  }, []);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const response = await api.get('/candidates');
        const normalizedData = normalizeCandidates(response.data);

        setCandidates(normalizedData);
        setFilteredCandidates(normalizedData);
        setLoading(false);
      } catch (err) {
        console.error('API Error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [normalizeCandidates]);

  const fetchSuggestions = useCallback(async (query) => {
    if (!query) return [];
    try {
      const response = await api.get(`/candidates/suggestions?query=${encodeURIComponent(query)}`);
      // The backend now returns a List<String>, so we don't need to normalize it like candidates
      return response.data;
    } catch (err) {
      console.error('Suggestion Error:', err);
      return [];
    }
  }, []); // No need for normalizeCandidates dependency here anymore

  const applyFilters = useCallback(async (filters) => {
    let result = [...candidates];

    // If there is a search query, fetch from backend to use intelligent search
    if (filters.searchQuery && filters.searchQuery.trim().length > 0) {
      try {
        setLoading(true);
        const response = await api.get(`/candidates/search?query=${encodeURIComponent(filters.searchQuery)}`);
        result = normalizeCandidates(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Search API Error:', err);
        // Fallback to client-side search if API fails
        const query = filters.searchQuery.toLowerCase();
        result = result.filter(c => 
          c.name.toLowerCase().includes(query) ||
          c.role.toLowerCase().includes(query) ||
          c.skills.some(skill => skill.toLowerCase().includes(query))
        );
        setLoading(false);
      }
    } else {
      // If no search query, start with all candidates
      result = [...candidates];
    }

    // Apply other filters locally on the results
    // 2. Job Position / Role
    if (filters.role && filters.role !== '') {
      result = result.filter(c => 
        c.role.toLowerCase().includes(filters.role.toLowerCase())
      );
    }

    // 3. Location & Locality
    if (filters.location) {
      result = result.filter(c => 
        c.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    if (filters.locality) {
      result = result.filter(c => 
        c.locality && c.locality.toLowerCase().includes(filters.locality.toLowerCase())
      );
    }

    // 4. Experience
    if (filters.experience) {
      result = result.filter(c => c.experienceInt >= parseInt(filters.experience));
    }

    // 5. Notice Period
    if (filters.noticePeriod && filters.noticePeriod !== '') {
      result = result.filter(c => 
        c.noticePeriod && c.noticePeriod.toLowerCase().includes(filters.noticePeriod.toLowerCase())
      );
    }

    // 6. Salary Expectation (assuming budget filter)
    if (filters.salary) {
      const maxSalary = parseInt(filters.salary);
      result = result.filter(c => {
        // Parse salaryRange like "10L - 15L" or just "15L"
        const salaryMatch = c.salaryRange.match(/(\d+)/);
        if (salaryMatch) {
          const val = parseInt(salaryMatch[0]);
          return val <= maxSalary;
        }
        return true;
      });
    }

    // 7. Active Keywords (Tags)
    if (filters.keywords && filters.keywords.length > 0) {
      result = result.filter(c => 
        filters.keywords.every(keyword => 
          c.skills.some(skill => skill.toLowerCase().includes(keyword.toLowerCase()))
        )
      );
    }

    setFilteredCandidates(result);
  }, [candidates, normalizeCandidates]);

  return { candidates: filteredCandidates, loading, error, applyFilters, fetchSuggestions };
};

export default useCandidates;
