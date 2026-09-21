package com.klu.auth_service.dto;

public record CandidateProfileResponse(
        String name,
        String email,
        String phone,
        String skills,
        String location
) {
}
