package com.klu.job_service;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {

    Job findByTitle(String title);

    List<Job> findByCreatedByIgnoreCase(String createdBy);
}