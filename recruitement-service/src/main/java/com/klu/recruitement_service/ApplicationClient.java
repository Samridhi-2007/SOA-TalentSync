package com.klu.recruitement_service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Map;

@FeignClient(name = "application-service")
public interface ApplicationClient {
    @GetMapping("/api/recruitment/pipeline")
    Map<String, Long> pipeline();
}
