package com.klu.auth_service.controller;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.klu.auth_service.security.JwtService;
import com.klu.auth_service.service.AuthService;
@RestController @RequestMapping("/api/admin")
public class AdminController {
 private final AuthService service; private final JwtService jwt;
 public AdminController(AuthService service,JwtService jwt){this.service=service;this.jwt=jwt;}
 private void check(String header){if(header==null||!header.startsWith("Bearer ")||!"ADMIN".equals(jwt.role(header.substring(7))))throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Admin access required");}
 @GetMapping("/users") public Object users(@RequestHeader(value="Authorization",required=false) String header){check(header);return service.allUsers();}
 @PutMapping("/users/{email}/approve") public Object approve(@RequestHeader(value="Authorization",required=false) String header,@PathVariable String email,@RequestParam(defaultValue="JOB_SEEKER") String role){check(header);return service.approve(email,role);}
}
