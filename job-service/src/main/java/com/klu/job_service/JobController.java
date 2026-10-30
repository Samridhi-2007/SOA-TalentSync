package com.klu.job_service;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
@RestController @RequestMapping("/api/jobs")
public class JobController {
 private final JobRepository jobs;
 public JobController(JobRepository jobs){this.jobs=jobs;}
 @GetMapping public List<Job> all(){return jobs.findAll();}
 @PostMapping public ResponseEntity<?> create(@RequestBody Job job){try{validate(job);job.setStatus(normalizeStatus(job.getStatus()));return ResponseEntity.status(HttpStatus.CREATED).body(jobs.save(job));}catch(IllegalArgumentException exception){return ResponseEntity.badRequest().body(exception.getMessage());}}
 @GetMapping("/{id}") public Job one(@PathVariable Long id){return find(id);}
 @PutMapping("/{id}") public ResponseEntity<?> update(@PathVariable Long id,@RequestBody Job data){Job job=find(id);if(data.getTitle()!=null)job.setTitle(data.getTitle());if(data.getDepartment()!=null)job.setDepartment(data.getDepartment());if(data.getDescription()!=null)job.setDescription(data.getDescription());if(data.getStatus()!=null)job.setStatus(data.getStatus());try{validate(job);job.setStatus(normalizeStatus(job.getStatus()));return ResponseEntity.ok(jobs.save(job));}catch(IllegalArgumentException exception){return ResponseEntity.badRequest().body(exception.getMessage());}}
 @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id){jobs.delete(find(id));return ResponseEntity.noContent().build();}
 private Job find(Long id){return jobs.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Job not found"));}
 private void validate(Job job){if(job==null||blank(job.getTitle())||blank(job.getDepartment())||blank(job.getDescription()))throw new IllegalArgumentException("Title, department, and description are required");normalizeStatus(job.getStatus());}
 private String normalizeStatus(String status){String normalized=status==null||status.isBlank()?"OPEN":status.trim().toUpperCase();if(!normalized.equals("OPEN")&&!normalized.equals("CLOSED"))throw new IllegalArgumentException("Status must be OPEN or CLOSED");return normalized;}
 private boolean blank(String value){return value==null||value.isBlank();}
}
