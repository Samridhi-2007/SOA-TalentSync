package com.klu.auth_service.model;
import jakarta.persistence.*;
@Entity @Table(name="users")
public class User {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 private String name;
 @Column(unique=true,nullable=false) private String email;
 private String password; private String role;
 protected User(){}
 public User(String name,String email,String password,String role){this.name=name;this.email=email;this.password=password;this.role=role;}
 public String getName(){return name;} public String getEmail(){return email;} public String getPassword(){return password;} public String getRole(){return role;}
}
