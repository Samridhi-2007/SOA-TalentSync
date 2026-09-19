package com.klu.auth_service.dto;
public record AuthResponse(String token, String name, String email, String role) { }
