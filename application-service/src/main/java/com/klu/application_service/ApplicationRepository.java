package com.klu.application_service;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    long countByStatus(String status);

    long countByJobIdIn(List<Long> jobIds);

    long countByJobIdInAndStatus(List<Long> jobIds, String status);

    boolean existsByCandidateIgnoreCaseAndJobId(String candidate, Long jobId);

    List<Application> findByCandidateIgnoreCaseOrderBySubmittedAtDesc(String candidate);

    List<Application> findByJobId(Long jobId);

    List<Application> findByJobIdIn(List<Long> jobIds);
}