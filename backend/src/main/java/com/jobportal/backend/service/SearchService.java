package com.jobportal.backend.service;

import com.jobportal.backend.model.Candidate;
import com.jobportal.backend.repository.CandidateRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SearchService {

    private static final Logger logger = LoggerFactory.getLogger(SearchService.class);

    private final CandidateRepository repository;

    // 🔥 Role mapping for semantic search
    private static final Map<String, List<String>> ROLE_MAPPINGS = new HashMap<>();

    static {
        ROLE_MAPPINGS.put("frontend developer", Arrays.asList("react", "javascript", "html", "css", "vue", "angular", "typescript"));
        ROLE_MAPPINGS.put("backend developer", Arrays.asList("java", "spring", "node", "sql", "python", "mongodb", "mysql"));
        ROLE_MAPPINGS.put("full stack developer", Arrays.asList("react", "java", "spring", "node", "javascript", "sql"));
        ROLE_MAPPINGS.put("devops", Arrays.asList("aws", "docker", "kubernetes", "jenkins", "azure", "terraform"));
        ROLE_MAPPINGS.put("mobile developer", Arrays.asList("flutter", "react native", "swift", "kotlin", "android", "ios"));
    }

    public SearchService(CandidateRepository repository) {
        this.repository = repository;
    }

    // 🚀 MAIN SEARCH
    public List<Candidate> search(String keyword,
                                  String location,
                                  String city,
                                  String subLocality) {

        logger.info("Search started | keyword={}, location={}, city={}, subLocality={}",
                keyword, location, city, subLocality);

        List<Candidate> baseList;

        try {
            // 🔹 Step 1: DB search
            if (keyword != null && !keyword.trim().isEmpty()) {
                logger.debug("Performing keyword DB search");
                baseList = repository.searchByKeyword(keyword);
            } else {
                logger.debug("Fetching all candidates (no keyword)");
                baseList = repository.findAll();
            }

            logger.info("Base candidates fetched: {}", baseList.size());

        } catch (Exception e) {
            logger.error("Database error during search: {}", e.getMessage());
            return Collections.emptyList();
        }

        String lowerQuery = keyword != null ? keyword.toLowerCase().trim() : "";

        // 🔹 Step 2: Expand skills
        List<String> expandedSkills = new ArrayList<>();

        if (!lowerQuery.isEmpty()) {
            expandedSkills.add(lowerQuery);

            for (Map.Entry<String, List<String>> entry : ROLE_MAPPINGS.entrySet()) {
                if (lowerQuery.contains(entry.getKey()) || entry.getKey().contains(lowerQuery)) {
                    expandedSkills.addAll(entry.getValue());
                }
            }
        }

        logger.debug("Expanded skills: {}", expandedSkills);

        // 🔹 Step 3: Apply filters
        List<Candidate> result = baseList.stream()
                .filter(c -> filterByLocation(c, location, city, subLocality))
                .filter(c -> matchKeyword(c, lowerQuery, expandedSkills))
                .collect(Collectors.toList());

        logger.info("Final filtered candidates count: {}", result.size());

        return result;
    }

    // 📍 LOCATION FILTER
    private boolean filterByLocation(Candidate c, String location, String city, String subLocality) {

        if (location != null && !location.isEmpty() &&
                (c.getLocation() == null || !c.getLocation().equalsIgnoreCase(location))) {
            return false;
        }

        if (city != null && !city.isEmpty() &&
                (c.getLocality() == null || !c.getLocality().equalsIgnoreCase(city))) {
            return false;
        }

        if (subLocality != null && !subLocality.isEmpty() &&
                (c.getSubLocality() == null || !c.getSubLocality().equalsIgnoreCase(subLocality))) {
            return false;
        }

        return true;
    }

    // 🔍 KEYWORD MATCH
    private boolean matchKeyword(Candidate c, String query, List<String> expandedSkills) {

        if (query == null || query.isEmpty()) {
            return true;
        }

        if (c.getName() != null && c.getName().toLowerCase().contains(query)) {
            return true;
        }

        if (c.getJobRole() != null && c.getJobRole().toLowerCase().contains(query)) {
            return true;
        }

        if (c.getSkills() != null) {
            for (String skill : c.getSkills()) {

                if (skill == null) continue;

                String lowerSkill = skill.toLowerCase();

                if (lowerSkill.contains(query)) {
                    return true;
                }

                for (String exp : expandedSkills) {
                    if (lowerSkill.contains(exp)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    // 💡 SUGGESTIONS
    public List<String> getSuggestions(String query) {

        logger.info("Fetching suggestions for query: {}", query);

        if (query == null || query.trim().isEmpty()) {
            logger.warn("Empty query received for suggestions");
            return Collections.emptyList();
        }

        String lowerQuery = query.toLowerCase().trim();
        Set<String> suggestions = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);

        try {
            // Role suggestions
            for (String role : ROLE_MAPPINGS.keySet()) {
                if (role.contains(lowerQuery)) {
                    suggestions.add(role);
                }
            }

            // DB suggestions
            repository.findAll().forEach(c -> {

                if (c.getJobRole() != null &&
                        c.getJobRole().toLowerCase().contains(lowerQuery)) {
                    suggestions.add(c.getJobRole());
                }

                if (c.getSkills() != null) {
                    for (String skill : c.getSkills()) {
                        if (skill != null && skill.toLowerCase().contains(lowerQuery)) {
                            suggestions.add(skill.trim());
                        }
                    }
                }
            });

        } catch (Exception e) {
            logger.error("Error while fetching suggestions: {}", e.getMessage());
            return Collections.emptyList();
        }

        logger.info("Suggestions count: {}", suggestions.size());

        return suggestions.stream()
                .limit(10)
                .collect(Collectors.toList());
    }
}