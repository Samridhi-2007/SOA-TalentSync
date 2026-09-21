package com.klu.job_service;
import org.springframework.data.jpa.repository.JpaRepository;
public interface JobRepository extends JpaRepository<Job,Long>{
 Job findByTitle(String title);
}
