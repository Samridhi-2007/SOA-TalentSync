package com.klu.auth_service.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;
    private String role;

    // Existing recruiter fields
    private boolean approved;
    private boolean recruiterRequested;

    // Candidate profile fields
    private String phone;
    private String skills;
    private String location;

    @Basic(fetch = FetchType.LAZY)
    @Column(columnDefinition = "bytea")
    private byte[] resumeData;

    private String resumeFileName;
    private String resumeContentType;

    protected User() {}

    public User(String name, String email, String password, String role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getRole() { return role; }

    public boolean isApproved() { return approved; }
    public boolean isRecruiterRequested() { return recruiterRequested; }

    public String getPhone() { return phone; }
    public String getSkills() { return skills; }
    public String getLocation() { return location; }

    public byte[] getResumeData() { return resumeData; }
    public String getResumeFileName() { return resumeFileName; }
    public String getResumeContentType() { return resumeContentType; }

    public void setName(String value) { name = value; }
    public void setRole(String role) { this.role = role; }
    public void setApproved(boolean approved) { this.approved = approved; }
    public void setRecruiterRequested(boolean requested) { recruiterRequested = requested; }

    public void setPhone(String value) { phone = value; }
    public void setSkills(String value) { skills = value; }
    public void setLocation(String value) { location = value; }

    public void setResumeData(byte[] value) { resumeData = value; }
    public void setResumeFileName(String value) { resumeFileName = value; }
    public void setResumeContentType(String value) { resumeContentType = value; }
}