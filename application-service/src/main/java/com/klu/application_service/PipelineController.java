package com.klu.application_service;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/recruitment")
public class PipelineController {

    private final ApplicationRepository applications;
    private final ApplicationService service;

    public PipelineController(
            ApplicationRepository applications,
            ApplicationService service) {
        this.applications = applications;
        this.service = service;
    }

    @GetMapping("/pipeline")
    public Map<String, Long> pipeline() {
        return Map.of(
                "applied", applications.countByStatus("APPLIED"),
                "shortlisted", applications.countByStatus("SHORTLISTED"),
                "interview", applications.countByStatus("INTERVIEW"),
                "hired", applications.countByStatus("HIRED")
        );
    }

    @GetMapping("/statistics/{recruiterEmail}")
    public ResponseEntity<?> statistics(
            @PathVariable String recruiterEmail) {

        try {
            return ResponseEntity.ok(
                    service.recruiterStatistics(recruiterEmail)
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }
}