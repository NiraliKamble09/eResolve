package com.eresolve.complaintmanagement.controller;

import com.eresolve.complaintmanagement.dto.ComplaintResponse;
import com.eresolve.complaintmanagement.dto.ComplaintView;

import com.eresolve.complaintmanagement.service.ComplaintService;
import com.eresolve.complaintmanagement.service.FileStorageService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/complaints")
public class ComplaintController {

    private static final Logger logger = LoggerFactory.getLogger(ComplaintController.class);

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private ComplaintService complaintService;

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createComplaint(
            @RequestParam("userId") Integer userId,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("category") String category,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        logger.info("Received create complaint request");

        try {
            String mediaUrl = null;
            if (file != null && !file.isEmpty()) {
                String storedFilename = fileStorageService.storeFile(file);
                mediaUrl = "http://localhost:8082/files/" + storedFilename;
            }

            ComplaintResponse response = complaintService.createComplaint(userId, title, description, category, mediaUrl);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Failed to create complaint: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Failed to create complaint: " + e.getMessage());
        }
    }

    @DeleteMapping("/{complaintId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteComplaint(@PathVariable Integer complaintId) {
        try {
            complaintService.deleteComplaintWithMedia(complaintId);
            return ResponseEntity.ok("Complaint deleted successfully");
        } catch (Exception e) {
            logger.error("Error deleting complaint: {}", e.getMessage());
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ComplaintView>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @GetMapping("/id/{complaintId}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<ComplaintView> getComplaintById(@PathVariable Integer complaintId) {
        return ResponseEntity.ok(complaintService.getComplaintById(complaintId));
    }
    
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ComplaintView>> getUserComplaints(@PathVariable Integer userId) {
        List<ComplaintView> complaints = complaintService.getUserComplaints(userId);
        return ResponseEntity.ok(complaints);
    }


    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<List<ComplaintView>> getComplaintsByStatus(
            @PathVariable String status,
            Authentication authentication) {

        List<ComplaintView> complaints = complaintService.getComplaintsByStatus(status, authentication);
        return ResponseEntity.ok(complaints);
    }
    
    @GetMapping("/category/{category}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<List<ComplaintView>> getComplaintsByCategory(
            @PathVariable String category,
            Authentication authentication) {

        List<ComplaintView> complaints = complaintService.getComplaintsByCategory(category, authentication);
        return ResponseEntity.ok(complaints);
    }




}