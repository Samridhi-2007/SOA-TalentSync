package com.klu.auth_service.service;

import com.klu.auth_service.dto.CandidateProfileResponse;
import com.klu.auth_service.dto.CandidateProfileUpdateRequest;
import com.klu.auth_service.dto.ResumeUploadResponse;
import com.klu.auth_service.model.User;
import com.klu.auth_service.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class CandidateService {
    private final UserRepository users;

    public CandidateService(UserRepository users) {
        this.users = users;
    }

    public CandidateProfileResponse getProfile(String email) {
        return toProfile(findCandidate(email));
    }

    public CandidateProfileResponse updateProfile(String email, CandidateProfileUpdateRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Profile data is required");
        }
        User user = findCandidate(email);
        user.setName(request.name());
        user.setPhone(request.phone());
        user.setSkills(request.skills());
        user.setLocation(request.location());
        return toProfile(users.save(user));
    }

    public ResumeUploadResponse uploadResume(String email, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("A resume file is required");
        }

        User user = findCandidate(email);
        try {
            user.setResumeData(file.getBytes());
        } catch (IOException exception) {
            throw new IllegalArgumentException("Unable to read the resume file", exception);
        }
        user.setResumeFileName(file.getOriginalFilename());
        user.setResumeContentType(file.getContentType());
        users.save(user);

        return new ResumeUploadResponse(
                "Resume uploaded successfully",
                file.getOriginalFilename(),
                file.getContentType(),
                file.getSize()
        );
    }

    private User findCandidate(String email) {
        User user = users.findByEmailIgnoreCase(email);
        if (user == null) {
            throw new IllegalArgumentException("Candidate not found");
        }
        if (!"CANDIDATE".equalsIgnoreCase(user.getRole())) {
            throw new IllegalArgumentException("The account is not a candidate account");
        }
        return user;
    }

    private CandidateProfileResponse toProfile(User user) {
        return new CandidateProfileResponse(
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getSkills(),
                user.getLocation()
        );
    }
}
