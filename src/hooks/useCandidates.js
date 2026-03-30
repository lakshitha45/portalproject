import { useState, useEffect, useCallback } from 'react';
import api from '../api/config';
import { getStateNameByCode } from '../api/localityService';

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
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      // Only send parameters that the backend currently handles (as per current SearchService.java)
      const chips = filters.keywords || [];
      const typing = (filters.searchQuery || '').trim().split(/[\s,]+/).filter(Boolean);
      const allTerms = [...chips, ...typing];
      
      if (allTerms.length > 0) {
        // We only send the first term to the backend to get a candidate set, 
        // because the current backend SearchService doesn't handle multi-term searching well.
        const value = allTerms[0];
        console.log("Searching:", value);
        params.append('keyword', value);
      }
      if (filters.location) params.append('location', getStateNameByCode(filters.location));
      if (filters.district) params.append('city', filters.district);
      if (filters.locality) params.append('subLocality', filters.locality);

      // We still send these just in case the backend is updated later
      if (filters.experience) params.append('experience', filters.experience);
      if (filters.workMode) params.append('workMode', filters.workMode);
      if (filters.salaryRange) params.append('salary', filters.salaryRange);
      if (filters.noticePeriod) params.append('noticePeriod', filters.noticePeriod);
      if (filters.education) params.append('education', filters.education);

      const response = await api.get(`/candidates/search?${params.toString()}`);
      let filteredData = normalizeCandidates(response.data);
      
      // 🔥 CLIENT-SIDE FILTERING (Since Backend SearchService only handles keyword and location)
      filteredData = filteredData.filter(c => {
        // Keyword/Skill Filter (AND logic for multiple chips + split keywords from input box)
        const chips = filters.keywords || [];
        const typing = (filters.searchQuery || '').trim().split(/[\s,]+/).filter(Boolean);
        const allSearchTerms = [...chips, ...typing];
 
        if (allSearchTerms.length > 0) {
          const lowerTerms = allSearchTerms.map(t => t.toLowerCase());
          const matchesAll = lowerTerms.every(term => {
            // Substring match for name and role
            if (c.name.toLowerCase().includes(term) || c.role.toLowerCase().includes(term)) return true;
            
            // EXACT match for skills (to ignore MySQL / Oracle SQL when searching for SQL)
            return (c.skills || []).some(skill => skill.toLowerCase() === term);
          });
          if (!matchesAll) return false;
        }

        // Experience Filter
        if (filters.experience) {
          const exp = c.experienceInt;
          if (filters.experience === '0-2 Yrs') { if (exp > 2) return false; }
          else if (filters.experience === '2-5 Yrs') { if (exp < 2 || exp > 5) return false; }
          else if (filters.experience === '5-10 Yrs') { if (exp < 5 || exp > 10) return false; }
          else if (filters.experience === '10+ Yrs') { if (exp < 10) return false; }
        }

        // Work Mode Filter
        if (filters.workMode && c.workMode && !c.workMode.toLowerCase().includes(filters.workMode.toLowerCase())) {
          return false;
        }

        // Salary Range Filter
        if (filters.salaryRange) {
          const salary = c.expectedSalary || 0;
          if (filters.salaryRange === '3-6 LPA') { if (salary < 3 || salary > 6) return false; }
          else if (filters.salaryRange === '6-10 LPA') { if (salary < 6 || salary > 10) return false; }
          else if (filters.salaryRange === '10+ LPA') { if (salary <= 10) return false; }
        }

        // Notice Period / Availability Filter
        if (filters.noticePeriod && c.noticePeriod && !c.noticePeriod.toLowerCase().includes(filters.noticePeriod.toLowerCase())) {
          return false;
        }

        // Education Filter
        if (filters.education && c.education && !c.education.toLowerCase().includes(filters.education.toLowerCase())) {
          return false;
        }

        // Job Role Filter
        if (filters.jobRole) {
          const candidateRole = (c.jobRole || c.role || '').toLowerCase();
          if (candidateRole !== filters.jobRole.toLowerCase()) return false;
        }

        // Skill Filter (exact match from dropdown)
        if (filters.skillFilter) {
          const hasSkill = (c.skills || []).some(skill => skill.toLowerCase() === filters.skillFilter.toLowerCase());
          if (!hasSkill) return false;
        }

        return true;
      });

      setFilteredCandidates(filteredData);
      setLoading(false);
    } catch (err) {
      console.error('Filter Search API Error:', err);
      setError(err.message);
      setLoading(false);
    }
  }, [normalizeCandidates]);

  return { candidates: filteredCandidates, allCandidates: candidates, loading, error, applyFilters, fetchSuggestions };
};

export default useCandidates;
