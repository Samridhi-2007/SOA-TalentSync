package com.klu.job_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.CommandLineRunner;

@SpringBootApplication
@org.springframework.cloud.client.discovery.EnableDiscoveryClient
public class JobServiceApplication {
	@Bean CommandLineRunner seed(JobRepository jobs) { return args -> { if (jobs.count() == 0) { jobs.save(new Job("Java Backend Developer", "Engineering", "Build simple Spring Boot APIs")); jobs.save(new Job("Frontend Developer", "Product", "Create clean React screens")); } }; }

	public static void main(String[] args) {
		SpringApplication.run(JobServiceApplication.class, args);
	}

}
