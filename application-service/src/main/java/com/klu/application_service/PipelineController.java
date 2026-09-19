package com.klu.application_service;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController @RequestMapping("/api/recruitment")
public class PipelineController {
 private final ApplicationRepository applications;
 public PipelineController(ApplicationRepository applications){this.applications=applications;}
 @GetMapping("/pipeline") public Map<String,Long> pipeline(){return Map.of("applied",applications.countByStatus("APPLIED"),"shortlisted",applications.countByStatus("SHORTLISTED"),"interview",applications.countByStatus("INTERVIEW"),"hired",applications.countByStatus("HIRED"));}
}
