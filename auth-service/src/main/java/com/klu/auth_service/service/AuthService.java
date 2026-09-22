package com.klu.auth_service.service;

import com.klu.auth_service.dto.*;
import com.klu.auth_service.model.User;
import com.klu.auth_service.repository.UserRepository;
import com.klu.auth_service.security.JwtService;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

import java.util.List;
import java.util.Map;

@Service
public class AuthService {

    private final UserRepository users;
    private final JwtService jwt;

    private final BCryptPasswordEncoder encoder =
            new BCryptPasswordEncoder();

    public AuthService(UserRepository users, JwtService jwt) {
        this.users = users;
        this.jwt = jwt;
    }

    @PostConstruct
    public void createDefaultAdmin() {
        if (users.findByEmailIgnoreCase("admin@talentsync.com") == null) {

            users.save(
                    new User(
                            "TalentSync Admin",
                            "admin@talentsync.com",
                            encoder.encode("admin123"),
                            "ADMIN",
                            true
                    )
            );
        }
    }

    public AuthResponse register(RegisterRequest r) {

        if (users.findByEmailIgnoreCase(r.email()) != null) {
            throw new IllegalArgumentException(
                    "Email already registered"
            );
        }

        User u = users.save(
                new User(
                        r.name(),
                        r.email(),
                        encoder.encode(r.password()),
                        "JOB_SEEKER",
                        true
                )
        );

        return new AuthResponse(
                jwt.createToken(u.getEmail(), u.getRole()),
                u.getName(),
                u.getEmail(),
                u.getRole(),
                true
        );
    }

    public AuthResponse login(LoginRequest r) {

        User u = users.findByEmailIgnoreCase(r.email());

        if (u == null ||
                !encoder.matches(r.password(), u.getPassword())) {

            throw new IllegalArgumentException(
                    "Invalid email or password"
            );
        }

        if (!u.isApproved()) {
            throw new IllegalArgumentException(
                    "Account is waiting for admin approval"
            );
        }

        return new AuthResponse(
                jwt.createToken(u.getEmail(), u.getRole()),
                u.getName(),
                u.getEmail(),
                u.getRole(),
                true
        );
    }

    public List<Map<String, Object>> allUsers() {

        return users.findAll()
                .stream()
                .map(u -> Map.<String, Object>of(
                        "name", u.getName(),
                        "email", u.getEmail(),
                        "role", u.getRole(),
                        "approved", u.isApproved(),
                        "recruiterRequested",
                        u.isRecruiterRequested()
                ))
                .toList();
    }

    public Map<String, Object> requestRecruiter(String email) {

        User u = users.findByEmailIgnoreCase(email);

        if (u == null) {
            throw new IllegalArgumentException(
                    "User not found"
            );
        }

        if (!u.getRole().equals("JOB_SEEKER")) {
            throw new IllegalArgumentException(
                    "Only job seekers can request recruiter access"
            );
        }

        u.setRecruiterRequested(true);
        users.save(u);

        return Map.of(
                "message",
                "Recruiter request sent for admin approval",
                "email",
                u.getEmail()
        );
    }

    public Map<String, Object> approve(
            String email,
            String role) {

        User u = users.findByEmailIgnoreCase(email);

        if (u == null) {
            throw new IllegalArgumentException(
                    "User not found"
            );
        }

        String newRole =
                role == null || role.isBlank()
                        ? "JOB_SEEKER"
                        : role.toUpperCase();

        if (newRole.equals("RECRUITER")
                && !u.isRecruiterRequested()) {

            throw new IllegalArgumentException(
                    "User has not requested recruiter access"
            );
        }

        if (!newRole.equals("JOB_SEEKER")
                && !newRole.equals("RECRUITER")) {

            throw new IllegalArgumentException(
                    "Role must be JOB_SEEKER or RECRUITER"
            );
        }

        u.setRole(newRole);
        u.setApproved(true);
        u.setRecruiterRequested(false);

        users.save(u);

        return Map.of(
                "message",
                "Access approved",
                "email",
                u.getEmail(),
                "role",
                u.getRole()
        );
    }
}