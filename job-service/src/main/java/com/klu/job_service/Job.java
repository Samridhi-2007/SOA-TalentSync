package com.klu.job_service;
import jakarta.persistence.*;
@Entity @Table(name="jobs")
public class Job {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 private String title; private String department; private String description; private String status="OPEN";
 protected Job(){}
 public Job(String title,String department,String description){this.title=title;this.department=department;this.description=description;}
 public Long getId(){return id;} public String getTitle(){return title;} public String getDepartment(){return department;} public String getDescription(){return description;} public String getStatus(){return status;} public void setStatus(String s){status=s;}
 public void setTitle(String v){title=v;} public void setDepartment(String v){department=v;} public void setDescription(String v){description=v;}
}
