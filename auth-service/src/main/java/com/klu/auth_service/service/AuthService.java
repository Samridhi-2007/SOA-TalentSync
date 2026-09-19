package com.klu.auth_service.service;
import com.klu.auth_service.dto.*;
import com.klu.auth_service.model.User;
import com.klu.auth_service.repository.UserRepository;
import com.klu.auth_service.security.JwtService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
@Service public class AuthService {
 private final UserRepository users; private final JwtService jwt; private final BCryptPasswordEncoder encoder=new BCryptPasswordEncoder();
 public AuthService(UserRepository users,JwtService jwt){this.users=users;this.jwt=jwt;}
 public AuthResponse register(RegisterRequest r){if(users.findByEmailIgnoreCase(r.email())!=null)throw new IllegalArgumentException("Email already registered");String role=r.role()==null||r.role().isBlank()?"CANDIDATE":r.role().toUpperCase();User u=users.save(new User(r.name(),r.email(),encoder.encode(r.password()),role));return new AuthResponse(jwt.createToken(u.getEmail(),u.getRole()),u.getName(),u.getEmail(),u.getRole());}
 public AuthResponse login(LoginRequest r){User u=users.findByEmailIgnoreCase(r.email());if(u==null||!encoder.matches(r.password(),u.getPassword()))throw new IllegalArgumentException("Invalid email or password");return new AuthResponse(jwt.createToken(u.getEmail(),u.getRole()),u.getName(),u.getEmail(),u.getRole());}
}
