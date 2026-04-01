package com.jobportal.backend.repository;

import com.jobportal.backend.model.Candidate;
import java.util.List;

public interface CandidateRepositoryCustom {
    List<Candidate> searchCandidates(
            String keyword, 
            String location, 
            String city, 
            String subLocality, 
            String experience, 
            String workMode, 
            String salary, 
            String availability, 
            String education
    );
    List<Candidate> searchByKeyword(String keyword);
    List<String> findAllUniqueStates();

    List<String> findSubLocalitiesByCity(String city);
}
