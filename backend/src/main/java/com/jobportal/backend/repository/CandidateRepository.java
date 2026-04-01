package com.jobportal.backend.repository;

import com.jobportal.backend.model.Candidate;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface CandidateRepository
        extends MongoRepository<Candidate, String>, CandidateRepositoryCustom {

    // 📍 Get candidates by State + City (for Locality dropdown)
    @Query(value = "{ 'location': ?0, 'locality': ?1 }")
    List<Candidate> findByLocationAndLocality(String location, String locality);

}