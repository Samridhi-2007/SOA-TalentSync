package com.klu.auth_service.controller;
import com.klu.auth_service.dto.*;
import com.klu.auth_service.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/auth")
public class AuthController {
    private final AuthService service;
    public AuthController(AuthService service) { this.service = service; }
    @PostMapping("/register") public ResponseEntity<?> register(@RequestBody RegisterRequest r) { try { return ResponseEntity.ok(service.register(r)); } catch (IllegalArgumentException e) { return ResponseEntity.badRequest().body(e.getMessage()); } }
    @PostMapping("/login") public ResponseEntity<?> login(@RequestBody LoginRequest r) { try { return ResponseEntity.ok(service.login(r)); } catch (IllegalArgumentException e) { return ResponseEntity.status(401).body(e.getMessage()); } }
    @GetMapping("/health") public String health() { return "Auth service is running"; }
}
