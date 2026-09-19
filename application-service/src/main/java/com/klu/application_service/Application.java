package com.klu.application_service;
import jakarta.persistence.*;
@Entity @Table(name="applications")
public class Application {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 private Long jobId; private String jobTitle; private String candidate; private String status="APPLIED";
 protected Application(){}
 public Long getId(){return id;} public Long getJobId(){return jobId;} public String getJobTitle(){return jobTitle;} public String getCandidate(){return candidate;} public String getStatus(){return status;}
 public void setJobId(Long v){jobId=v;} public void setJobTitle(String v){jobTitle=v;} public void setCandidate(String v){candidate=v;} public void setStatus(String v){status=v;}
}
