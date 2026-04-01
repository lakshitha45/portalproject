package com.jobportal.backend.repository;

import com.jobportal.backend.model.Candidate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class CandidateRepositoryCustomImpl implements CandidateRepositoryCustom {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public List<Candidate> searchCandidates(
            String keyword, 
            String location, 
            String city, 
            String subLocality,
            String experience, 
            String workMode, 
            String salary, 
            String availability, 
            String education) {
        
        Query query = new Query();
        List<Criteria> criteriaList = new ArrayList<>();

        // 1. Keyword Search (Skills OR jobRole)
        if (keyword != null && !keyword.trim().isEmpty()) {
            String cleanKeyword = keyword.trim();
            criteriaList.add(new Criteria().orOperator(
                    Criteria.where("skills").regex(cleanKeyword, "i"),
                    Criteria.where("jobRole").regex(cleanKeyword, "i")
            ));
        }

        // 2. Location (State)
        if (location != null && !location.trim().isEmpty()) {
            criteriaList.add(Criteria.where("location").regex(location.trim(), "i"));
        }

        // 3. City
        if (city != null && !city.trim().isEmpty()) {
            criteriaList.add(Criteria.where("locality").regex(city.trim(), "i"));
        }

        // 4. Locality (Specific Area)
        if (subLocality != null && !subLocality.trim().isEmpty()) {
            criteriaList.add(Criteria.where("subLocality").regex(subLocality.trim(), "i"));
        }

        // 5. Experience Filtering (0-2, 2-5, 5-10, 10+)
        if (experience != null && !experience.trim().isEmpty()) {
            switch (experience) {
                case "0-2":
                    criteriaList.add(Criteria.where("experience").gte(0).lte(2));
                    break;
                case "2-5":
                    criteriaList.add(Criteria.where("experience").gt(2).lte(5));
                    break;
                case "5-10":
                    criteriaList.add(Criteria.where("experience").gt(5).lte(10));
                    break;
                case "10+":
                    criteriaList.add(Criteria.where("experience").gt(10));
                    break;
                default:
                    // If it's a number string (e.g. "5"), search for >= 5 years
                    try {
                        criteriaList.add(Criteria.where("experience").gte(Integer.parseInt(experience)));
                    } catch (NumberFormatException ignored) {}
            }
        }

        // 6. Work Mode
        if (workMode != null && !workMode.trim().isEmpty()) {
            criteriaList.add(Criteria.where("workMode").is(workMode.trim()));
        }

        // 7. Salary Range (3-6 LPA, 6-10 LPA, 10+ LPA)
        if (salary != null && !salary.trim().isEmpty()) {
            switch (salary) {
                case "3-6":
                    criteriaList.add(Criteria.where("expectedSalary").gte(3).lte(6));
                    break;
                case "6-10":
                    criteriaList.add(Criteria.where("expectedSalary").gt(6).lte(10));
                    break;
                case "10+":
                    criteriaList.add(Criteria.where("expectedSalary").gt(10));
                    break;
                default:
                    // If it's a number string, handle as max salary
                    try {
                        criteriaList.add(Criteria.where("expectedSalary").lte(Integer.parseInt(salary)));
                    } catch (NumberFormatException ignored) {}
            }
        }

        // 8. Availability (Notice Period)
        if (availability != null && !availability.trim().isEmpty()) {
            // availability in UI comes as "15", "30" days or "Immediate"
            criteriaList.add(Criteria.where("noticePeriod").regex(availability.trim(), "i"));
        }

        // 9. Education
        if (education != null && !education.trim().isEmpty()) {
            criteriaList.add(Criteria.where("education").regex(education.trim(), "i"));
        }

        // Combine all criteria using AND condition
        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }

        return mongoTemplate.find(query, Candidate.class);
    }

    @Override
    public List<String> findAllUniqueStates() {
        return mongoTemplate.getCollection("candidates")
                .distinct("location", String.class)
                .into(new ArrayList<>());
    }

    @Override
    public List<String> findSubLocalitiesByCity(String city) {
        Query query = new Query();
        query.addCriteria(Criteria.where("locality").regex(city, "i"));
        return mongoTemplate.getCollection("candidates")
                .distinct("subLocality", query.getQueryObject(), String.class)
                .into(new ArrayList<>());


    }
    @Override
    public List<Candidate> searchByKeyword(String keyword) {

        Query query = new Query();

        if (keyword != null && !keyword.trim().isEmpty()) {
            query.addCriteria(new Criteria().orOperator(
                    Criteria.where("skills").regex(keyword, "i"),
                    Criteria.where("jobRole").regex(keyword, "i")
            ));
        }

        return mongoTemplate.find(query, Candidate.class);
    }
}
