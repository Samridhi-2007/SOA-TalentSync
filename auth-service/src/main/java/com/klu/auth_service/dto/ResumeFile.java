package com.klu.auth_service.dto;

public record ResumeFile(byte[] data, String fileName, String contentType) {
}
