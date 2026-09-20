package com.klu.auth_service.model;
import jakarta.persistence.*;
@Entity @Table(name="users")
public class User {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 private String name;
 @Column(unique=true,nullable=false) private String email;
 private String password; private String role; private boolean approved; private boolean recruiterRequested;
 protected User(){}
 public User(String name,String email,String password,String role,boolean approved){this.name=name;this.email=email;this.password=password;this.role=role;this.approved=approved;}
 public String getName(){return name;} public String getEmail(){return email;} public String getPassword(){return password;} public String getRole(){return role;} public boolean isApproved(){return approved;} public boolean isRecruiterRequested(){return recruiterRequested;}
 public void setRole(String role){this.role=role;} public void setApproved(boolean approved){this.approved=approved;} public void setRecruiterRequested(boolean requested){this.recruiterRequested=requested;}
}
