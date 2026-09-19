package com.klu.recruitement_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@org.springframework.cloud.client.discovery.EnableDiscoveryClient
public class RecruitementServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(RecruitementServiceApplication.class, args);
	}

}
