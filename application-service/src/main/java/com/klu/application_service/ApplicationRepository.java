package com.klu.application_service;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ApplicationRepository extends JpaRepository<Application,Long>{ long countByStatus(String status); }
