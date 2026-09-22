package com.klu.application_service;

import org.springframework.stereotype.Service;
import feign.FeignException;

import java.util.List;
import java.util.Map;

@Service
public class ApplicationService {
    private static final List<String> ALLOWED_STATUSES = List.of(
            "APPLIED", "SHORTLISTED", "INTERVIEW", "HIRED", "REJECTED"
    );

    private final ApplicationRepository applications;
    private final JobClient jobs;

    public ApplicationService(ApplicationRepository applications, JobClient jobs) {
        this.applications = applications;
        this.jobs = jobs;
    }

    public synchronized Application create(Application application) {
        validateApplication(application);
        if (applications.existsByCandidateIgnoreCaseAndJobId(application.getCandidate(), application.getJobId())) {
            throw new IllegalArgumentException("You have already applied for this job.");
        }
        try {
            JobSummary job = jobs.getJob(application.getJobId());
            application.setJobTitle(job.title());
        } catch (FeignException.NotFound exception) {
            throw new IllegalArgumentException("Job not found");
        } catch (FeignException exception) {
            if (exception.status() == 500) {
                throw new IllegalArgumentException("Job not found");
            }
            throw new IllegalArgumentException("Job service is unavailable");
        }
        application.setStatus("APPLIED");
        return applications.save(application);
    }

    public List<Application> findByCandidate(String candidate) {
        if (candidate == null || candidate.isBlank()) {
            throw new IllegalArgumentException("Candidate email is required");
        }
        return applications.findByCandidateIgnoreCaseOrderBySubmittedAtDesc(candidate);
    }

    public Application updateStatus(Long id, String value) {
        String status = value == null ? "" : value.trim().toUpperCase();
        if (!ALLOWED_STATUSES.contains(status)) {
            throw new IllegalArgumentException("Invalid application status. Allowed values: " + ALLOWED_STATUSES);
        }

        Application application = applications.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Application not found"));
        application.setStatus(status);
        return applications.save(application);
    }
public Map<String, Long> recruiterStatistics(String recruiterEmail) {

    if (recruiterEmail == null || recruiterEmail.isBlank()) {
        throw new IllegalArgumentException(
                "Recruiter email is required"
        );
    }

    List<JobSummary> recruiterJobs =
            jobs.getRecruiterJobs(recruiterEmail);

    List<Long> jobIds = recruiterJobs.stream()
            .map(JobSummary::id)
            .toList();

    if (jobIds.isEmpty()) {
        return Map.of(
                "totalJobs", 0L,
                "openJobs", 0L,
                "totalApplications", 0L,
                "shortlistedCandidates", 0L,
                "interviews", 0L,
                "hiredCandidates", 0L
        );
    }

    long totalJobs = recruiterJobs.size();

    long openJobs = recruiterJobs.stream()
            .filter(job -> "OPEN".equalsIgnoreCase(job.status()))
            .count();

    long totalApplications =
            applications.countByJobIdIn(jobIds);

    long shortlistedCandidates =
            applications.countByJobIdInAndStatus(
                    jobIds,
                    "SHORTLISTED"
            );

    long interviews =
            applications.countByJobIdInAndStatus(
                    jobIds,
                    "INTERVIEW"
            );

    long hiredCandidates =
            applications.countByJobIdInAndStatus(
                    jobIds,
                    "HIRED"
            );

    return Map.of(
            "totalJobs", totalJobs,
            "openJobs", openJobs,
            "totalApplications", totalApplications,
            "shortlistedCandidates", shortlistedCandidates,
            "interviews", interviews,
            "hiredCandidates", hiredCandidates
    );
}
    private void validateApplication(Application application) {
        if (application == null || application.getJobId() == null || application.getJobTitle() == null
                || application.getJobTitle().isBlank() || application.getCandidate() == null
                || application.getCandidate().isBlank()) {
            throw new IllegalArgumentException("jobId, jobTitle, and candidate are required");
        }
    }
}
