package com.jobportal.backend.controller;

import com.jobportal.backend.model.Candidate;
import com.jobportal.backend.repository.CandidateRepository;
import com.jobportal.backend.service.SearchService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/candidates")
public class CandidateController {

    private static final Logger logger = LoggerFactory.getLogger(CandidateController.class);

    private final CandidateRepository repository;
    private final SearchService searchService;

    public CandidateController(CandidateRepository repository, SearchService searchService) {
        this.repository = repository;
        this.searchService = searchService;
    }

    // ✅ ADD CANDIDATE
    @PostMapping
    public Candidate addCandidate(@RequestBody Candidate candidate) {
        logger.info("Adding new candidate: {}", candidate.getName());
        return repository.save(candidate);
    }

    // ✅ GET ALL
    @GetMapping
    public List<Candidate> getAllCandidates() {
        logger.info("Fetching all candidates");
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Candidate> getCandidateById(@PathVariable String id) {
        logger.info("Fetching candidate with ID: {}", id);

        return repository.findById(id)
                .map(candidate -> {
                    logger.info("Candidate found: {}", candidate.getName());
                    return ResponseEntity.ok(candidate);
                })
                .orElseGet(() -> {
                    logger.warn("Candidate not found with ID: {}", id);
                    return ResponseEntity.notFound().build();
                });
    }

    // ✅ WHATSAPP LINK
    @GetMapping("/{id}/whatsapp")
    public ResponseEntity<String> getWhatsappLink(@PathVariable String id) {

        logger.info("Generating WhatsApp link for ID: {}", id);

        Candidate candidate = repository.findById(id).orElse(null);

        if (candidate == null) {
            logger.error("Candidate not found for WhatsApp: {}", id);
            return ResponseEntity.notFound().build();
        }

        String phone = candidate.getWhatsapp();

        if (phone == null || phone.isEmpty()) {
            logger.warn("Invalid phone number for candidate ID: {}", id);
            return ResponseEntity.badRequest().body("Invalid phone number");
        }

        phone = phone.replace("+", "");

        if (!phone.startsWith("91")) {
            phone = "91" + phone;
        }

        String whatsappLink = "https://wa.me/" + phone +
                "?text=Hi%20I%20am%20interested%20in%20your%20profile";

        logger.info("WhatsApp link generated for ID: {}", id);

        return ResponseEntity.ok(whatsappLink);
    }

    @GetMapping("/localities")
    public List<String> getLocalities(
            @RequestParam String state,
            @RequestParam String city) {

        logger.info("Fetching localities for state: {}, city: {}", state, city);

        return repository.findByLocationAndLocality(state, city)
                .stream()
                .map(Candidate::getSubLocality)
                .filter(s -> s != null && !s.isEmpty())
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    @GetMapping("/search")
    public List<Candidate> searchCandidates(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String subLocality) {

        logger.info("Search request: keyword={}, location={}, city={}, subLocality={}",
                keyword, location, city, subLocality);

        return searchService.search(keyword, location, city, subLocality);
    }

    // ✅ SUGGESTIONS
    @GetMapping("/suggestions")
    public List<String> getSuggestions(@RequestParam(required = false) String query) {
        logger.info("Fetching suggestions for query: {}", query);
        return searchService.getSuggestions(query);
    }

    // ✅ UPDATE CANDIDATE
    @PutMapping("/{id}")
    public ResponseEntity<Candidate> updateCandidate(
            @PathVariable String id,
            @RequestBody Candidate updatedCandidate) {

        logger.info("Updating candidate ID: {}", id);

        return repository.findById(id)
                .map(existing -> {

                    existing.setName(updatedCandidate.getName());
                    existing.setJobRole(updatedCandidate.getJobRole());
                    existing.setSkills(updatedCandidate.getSkills());
                    existing.setExperience(updatedCandidate.getExperience());
                    existing.setLocation(updatedCandidate.getLocation());
                    existing.setLocality(updatedCandidate.getLocality());
                    existing.setSubLocality(updatedCandidate.getSubLocality());
                    existing.setNoticePeriod(updatedCandidate.getNoticePeriod());
                    existing.setExpectedSalary(updatedCandidate.getExpectedSalary());
                    existing.setWorkMode(updatedCandidate.getWorkMode());
                    existing.setEducation(updatedCandidate.getEducation());
                    existing.setEmail(updatedCandidate.getEmail());
                    existing.setPhone(updatedCandidate.getPhone());
                    existing.setWhatsapp(updatedCandidate.getWhatsapp());

                    Candidate saved = repository.save(existing);

                    logger.info("Candidate updated successfully: {}", id);

                    return ResponseEntity.ok(saved);
                })
                .orElseGet(() -> {
                    logger.error("Update failed. Candidate not found: {}", id);
                    return ResponseEntity.notFound().build();
                });
    }

    // ✅ DELETE CANDIDATE
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCandidate(@PathVariable String id) {

        logger.info("Deleting candidate ID: {}", id);

        if (!repository.existsById(id)) {
            logger.warn("Delete failed. Candidate not found: {}", id);
            return ResponseEntity.status(404).body("Candidate not found");
        }

        repository.deleteById(id);

        logger.info("Candidate deleted successfully: {}", id);

        return ResponseEntity.ok("Candidate deleted successfully");
    }
}