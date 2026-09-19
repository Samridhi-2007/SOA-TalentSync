package com.klu.job_service;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/jobs")
public class JobController {
 private final JobRepository jobs;
 public JobController(JobRepository jobs){this.jobs=jobs;}
 @GetMapping public List<Job> all(){return jobs.findAll();}
 @PostMapping public Job create(@RequestBody Job job){return jobs.save(job);}
 @GetMapping("/{id}") public Job one(@PathVariable Long id){return jobs.findById(id).orElseThrow();}
 @PutMapping("/{id}") public Job update(@PathVariable Long id,@RequestBody Job data){Job job=one(id);job.setStatus(data.getStatus());return jobs.save(job);}
}
