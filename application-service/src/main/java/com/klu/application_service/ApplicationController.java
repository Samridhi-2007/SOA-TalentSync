package com.klu.application_service;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import com.klu.application_service.security.JwtService;
import java.util.*;
@RestController @RequestMapping("/api/applications")
public class ApplicationController {
 private final ApplicationRepository applications;
 private final ApplicationService service;
 private final JwtService jwt;
 public ApplicationController(ApplicationRepository applications,ApplicationService service,JwtService jwt){this.applications=applications;this.service=service;this.jwt=jwt;}
 @GetMapping public List<Application> all(){return applications.findAll();}
 @GetMapping("/candidate/{email}") public ResponseEntity<?> candidate(@PathVariable String email,@RequestHeader(value="Authorization",required=false) String authorization){ResponseEntity<?> denied=authorizeCandidate(email,authorization);if(denied!=null)return denied;try{return ResponseEntity.ok(service.findByCandidate(email));}catch(IllegalArgumentException e){return ResponseEntity.badRequest().body(e.getMessage());}}
 @PostMapping public ResponseEntity<?> apply(@RequestBody Application application,@RequestHeader(value="Authorization",required=false) String authorization){String email=application==null?null:application.getCandidate();ResponseEntity<?> denied=authorizeCandidate(email,authorization);if(denied!=null)return denied;try{return ResponseEntity.status(HttpStatus.CREATED).body(service.create(application));}catch(IllegalArgumentException e){if(e.getMessage().contains("already applied"))return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());if(e.getMessage().equals("Job not found"))return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());return ResponseEntity.badRequest().body(e.getMessage());}}
 @PutMapping("/{id}/status") public ResponseEntity<?> status(@PathVariable Long id,@RequestParam String value){try{return ResponseEntity.ok(service.updateStatus(id,value));}catch(IllegalArgumentException e){return ResponseEntity.status(e.getMessage().equals("Application not found")?HttpStatus.NOT_FOUND:HttpStatus.BAD_REQUEST).body(e.getMessage());}}
 @GetMapping("/pipeline") public Map<String,Long> pipeline(){return Map.of("applied",applications.countByStatus("APPLIED"),"shortlisted",applications.countByStatus("SHORTLISTED"),"interview",applications.countByStatus("INTERVIEW"),"hired",applications.countByStatus("HIRED"));}
 private ResponseEntity<?> authorizeCandidate(String email,String authorization){if(authorization==null||!authorization.startsWith("Bearer "))return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Bearer token is required");JwtService.Claims claims=jwt.read(authorization.substring(7).trim());if(claims==null)return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");if(!"CANDIDATE".equalsIgnoreCase(claims.role()))return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Candidate access is required");if(email==null||!claims.email().equalsIgnoreCase(email))return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only access your own applications");return null;}
}
