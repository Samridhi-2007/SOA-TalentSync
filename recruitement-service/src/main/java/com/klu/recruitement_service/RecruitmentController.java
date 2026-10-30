package com.klu.recruitement_service;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController @RequestMapping("/api/recruitment")
public class RecruitmentController {
 private final ApplicationClient applications;
 public RecruitmentController(ApplicationClient applications){this.applications=applications;}
 @GetMapping("/health") public Map<String,String> health(){return Map.of("service","Recruitment Service","status","running");}
 @GetMapping("/pipeline") public Map<String,Long> pipeline(){return applications.pipeline();}
}
