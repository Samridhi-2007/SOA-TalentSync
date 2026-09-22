package com.klu.job_service;

import jakarta.persistence.*;

@Entity
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String department;
    private String description;
    private String location;
    private String employmentType;
    private String salary;
    private String createdBy;
    private String status = "OPEN";

    protected Job() {
    }

    // Existing constructor used by JobServiceApplication seed data
    public Job(String title, String department, String description) {
        this.title = title;
        this.department = department;
        this.description = description;
        this.status = "OPEN";
    }

    // Constructor for recruiter-created jobs
    public Job(String title, String department, String description,
               String location, String employmentType, String salary,
               String createdBy) {
        this.title = title;
        this.department = department;
        this.description = description;
        this.location = location;
        this.employmentType = employmentType;
        this.salary = salary;
        this.createdBy = createdBy;
        this.status = "OPEN";
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDepartment() {
        return department;
    }

    public String getDescription() {
        return description;
    }

    public String getLocation() {
        return location;
    }

    public String getEmploymentType() {
        return employmentType;
    }

    public String getSalary() {
        return salary;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public String getStatus() {
        return status;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setEmploymentType(String employmentType) {
        this.employmentType = employmentType;
    }

    public void setSalary(String salary) {
        this.salary = salary;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}