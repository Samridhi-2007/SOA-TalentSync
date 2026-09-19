package com.klu.recruitement_service;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController @RequestMapping("/api/recruitment")
public class RecruitmentController {
 @GetMapping("/health") public Map<String,String> health(){return Map.of("service","Recruitment Service","status","running");}
 @GetMapping("/pipeline") public List<Map<String,String>> pipeline(){return List.of(Map.of("stage","Applied","count","0"),Map.of("stage","Shortlisted","count","0"),Map.of("stage","Interview","count","0"),Map.of("stage","Hired","count","0"));}
}
