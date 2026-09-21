package com.klu.auth_service.dto;

public record CandidateProfileUpdateRequest(
        String name,
        String phone,
        String skills,
        String location
) {
}
