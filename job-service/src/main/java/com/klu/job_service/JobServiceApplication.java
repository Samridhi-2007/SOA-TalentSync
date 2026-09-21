package com.klu.job_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.CommandLineRunner;
import java.util.List;

@SpringBootApplication
@org.springframework.cloud.client.discovery.EnableDiscoveryClient
public class JobServiceApplication {
	@Bean CommandLineRunner seed(JobRepository jobs) {
		return args -> {
			List<Job> demoJobs = List.of(
					new Job("Java Spring Boot Developer", "Engineering", "Build and maintain REST APIs with Java and Spring Boot for TalentSync's hiring workflows. You will design service endpoints, write database queries, and improve reliability through testing and observability."),
					new Job("React Frontend Developer", "Product", "Create accessible, responsive interfaces with React and modern JavaScript. You will turn product requirements into reusable components, connect frontend screens to APIs, and refine the experience from user feedback."),
					new Job("Full Stack JavaScript Developer", "Engineering", "Develop end-to-end features using React on the frontend and Node.js services on the backend. You will shape API contracts, work with PostgreSQL data, and collaborate across design and engineering to ship complete product improvements."),
					new Job("Machine Learning Engineer", "AI/ML", "Build and evaluate machine learning models for practical product problems using Python. You will prepare datasets, compare model approaches, measure results, and help integrate reliable models into application services."),
					new Job("Data Science Analyst", "Data", "Use Python and SQL to explore product data and uncover useful patterns for the business. You will clean datasets, create analysis reports, develop meaningful metrics, and communicate findings to product and engineering teams."),
					new Job("Cloud and DevOps Engineer", "Cloud & DevOps", "Automate deployment and infrastructure workflows using AWS, Docker, and CI/CD pipelines. You will improve monitoring, containerize services, and make development and release environments more reliable."),
					new Job("Cybersecurity Analyst", "Cybersecurity", "Monitor systems and investigate security signals across TalentSync's services. You will assess vulnerabilities, help maintain security controls, document incidents, and work with engineering to reduce operational risk."),
					new Job("Android and Flutter Developer", "Mobile", "Build mobile experiences for candidates and recruiters using Android and Flutter technologies. You will implement polished screens, connect mobile workflows to backend APIs, and test behavior across devices and release builds."),
					new Job("Product UI/UX Designer", "Design", "Design clear and approachable workflows for candidates, recruiters, and hiring teams. You will conduct lightweight user research, create Figma prototypes, test interface ideas, and partner with engineers through implementation."),
					new Job("Data Engineering Specialist", "Data", "Create dependable SQL and PostgreSQL data workflows for reporting and product features. You will design ETL jobs, maintain data pipelines, improve query performance, and help teams trust the data they use."),
					new Job("Generative AI Engineer", "AI/ML", "Prototype generative AI features that help users search, summarize, and work with recruiting information. You will evaluate prompts and model outputs, build safe service integrations, and measure quality with realistic test cases."),
					new Job("QA Automation Engineer", "Engineering", "Build automated tests for web APIs and React workflows using practical quality strategies. You will create regression coverage, investigate failures, partner with developers on fixes, and help maintain dependable releases.")
			);

			for (Job demoJob : demoJobs) {
				Job existingJob = jobs.findByTitle(demoJob.getTitle());
				if (existingJob == null) {
					jobs.save(demoJob);
				} else {
					existingJob.setDepartment(demoJob.getDepartment());
					existingJob.setDescription(demoJob.getDescription());
					existingJob.setStatus("OPEN");
					jobs.save(existingJob);
				}
			}
		};
	}

	public static void main(String[] args) {
		SpringApplication.run(JobServiceApplication.class, args);
	}

}
