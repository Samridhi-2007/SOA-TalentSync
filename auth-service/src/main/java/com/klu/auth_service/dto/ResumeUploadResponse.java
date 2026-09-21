package com.klu.auth_service.dto;

public record ResumeUploadResponse(
        String message,
        String fileName,
        String contentType,
        long size
) {
}
