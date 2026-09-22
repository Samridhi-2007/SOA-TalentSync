package com.klu.application_service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "job-service")
public interface JobClient {

    @GetMapping("/api/jobs/{id}")
    JobSummary getJob(@PathVariable Long id);

    @GetMapping("/api/jobs/recruiter/{email}")
    List<JobSummary> getRecruiterJobs(@PathVariable String email);
}