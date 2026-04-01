package com.jobportal.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.util.List;

@Document(collection = "candidates")
public class Candidate {

    @Id
    private String id;

    @Indexed
    private String name;

    @Indexed
    private String jobRole;

    private List<String> skills; // Array of skills

    private int experience; // in years

    @Indexed
    private String location; // State (e.g., Tamil Nadu)

    @Indexed
    private String locality; // District / City (e.g., Chennai)

    @Indexed
    private String subLocality; // Area (e.g., T Nagar)

    private String noticePeriod; // e.g., 15 days, 30 days

    private int expectedSalary; // LPA (e.g., 5 = 5 LPA)

    private String workMode; // Remote / Hybrid / On-site

    private String education; // e.g., B.Tech, MCA

    private String email;

    private String phone; // Format: 919876543210 (NO +)

    private String whatsapp; // Format: 919876543210

    // ✅ Default Constructor
    public Candidate() {}

    // ✅ Getters & Setters

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getJobRole() { return jobRole; }
    public void setJobRole(String jobRole) { this.jobRole = jobRole; }

    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }

    public int getExperience() { return experience; }
    public void setExperience(int experience) { this.experience = experience; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getLocality() { return locality; }
    public void setLocality(String locality) { this.locality = locality; }

    public String getSubLocality() { return subLocality; }
    public void setSubLocality(String subLocality) { this.subLocality = subLocality; }

    public String getNoticePeriod() { return noticePeriod; }
    public void setNoticePeriod(String noticePeriod) { this.noticePeriod = noticePeriod; }

    public int getExpectedSalary() { return expectedSalary; }
    public void setExpectedSalary(int expectedSalary) { this.expectedSalary = expectedSalary; }

    public String getWorkMode() { return workMode; }
    public void setWorkMode(String workMode) { this.workMode = workMode; }

    public String getEducation() { return education; }
    public void setEducation(String education) { this.education = education; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) {
        this.phone = phone != null ? phone.replace("+", "") : null;
    }

    public String getWhatsapp() { return whatsapp; }
    public void setWhatsapp(String whatsapp) {
        this.whatsapp = whatsapp != null ? whatsapp.replace("+", "") : null;
    }
}