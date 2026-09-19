package com.klu.application_service;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController @RequestMapping("/api/applications")
public class ApplicationController {
 private final ApplicationRepository applications;
 public ApplicationController(ApplicationRepository applications){this.applications=applications;}
 @GetMapping public List<Application> all(){return applications.findAll();}
 @PostMapping public Application apply(@RequestBody Application application){return applications.save(application);}
 @PutMapping("/{id}/status") public Application status(@PathVariable Long id,@RequestParam String value){Application a=applications.findById(id).orElseThrow();a.setStatus(value.toUpperCase());return applications.save(a);}
 @GetMapping("/pipeline") public Map<String,Long> pipeline(){return Map.of("applied",applications.countByStatus("APPLIED"),"shortlisted",applications.countByStatus("SHORTLISTED"),"interview",applications.countByStatus("INTERVIEW"),"hired",applications.countByStatus("HIRED"));}
}
