package com.klu.application_service;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ApplicationRepository extends JpaRepository<Application,Long>{
 long countByStatus(String status);
 boolean existsByCandidateIgnoreCaseAndJobId(String candidate, Long jobId);
 List<Application> findByCandidateIgnoreCaseOrderBySubmittedAtDesc(String candidate);
}
