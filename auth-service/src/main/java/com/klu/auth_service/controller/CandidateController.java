package com.klu.auth_service.controller;

import com.klu.auth_service.dto.CandidateProfileUpdateRequest;
import com.klu.auth_service.security.JwtService;
import com.klu.auth_service.service.CandidateService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/candidates")
public class CandidateController {
    private final CandidateService candidates;
    private final JwtService jwt;

    public CandidateController(CandidateService candidates, JwtService jwt) {
        this.candidates = candidates;
        this.jwt = jwt;
    }

    @GetMapping("/{email}")
    public ResponseEntity<?> profile(@PathVariable String email,
                                     @RequestHeader(value = "Authorization", required = false) String authorization) {
        authorizeCandidate(email, authorization);
        try {
            return ResponseEntity.ok(candidates.getProfile(email));
        } catch (IllegalArgumentException exception) {
            return candidateError(exception);
        }
    }

    @PutMapping("/{email}")
    public ResponseEntity<?> updateProfile(@PathVariable String email,
                                            @RequestHeader(value = "Authorization", required = false) String authorization,
                                            @RequestBody CandidateProfileUpdateRequest request) {
        authorizeCandidate(email, authorization);
        try {
            return ResponseEntity.ok(candidates.updateProfile(email, request));
        } catch (IllegalArgumentException exception) {
            return candidateError(exception);
        }
    }

    @PostMapping("/{email}/resume")
    public ResponseEntity<?> uploadResume(@PathVariable String email,
                                          @RequestHeader(value = "Authorization", required = false) String authorization,
                                          @RequestParam("file") MultipartFile file) {
        authorizeCandidate(email, authorization);
        try {
            return ResponseEntity.ok(candidates.uploadResume(email, file));
        } catch (IllegalArgumentException exception) {
            return candidateError(exception);
        }
    }

    private ResponseEntity<String> candidateError(IllegalArgumentException exception) {
        if ("Candidate not found".equals(exception.getMessage())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(exception.getMessage());
        }
        return ResponseEntity.badRequest().body(exception.getMessage());
    }

    private void authorizeCandidate(String email, String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Bearer token is required");
        }

        String token = authorization.substring("Bearer ".length()).trim();
        String tokenEmail = jwt.getEmail(token);
        String tokenRole = jwt.getRole(token);
        if (tokenEmail == null || tokenRole == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or expired token");
        }
        if (!"CANDIDATE".equalsIgnoreCase(tokenRole)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Candidate access is required");
        }
        if (!tokenEmail.equalsIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only access your own profile");
        }
    }
}
