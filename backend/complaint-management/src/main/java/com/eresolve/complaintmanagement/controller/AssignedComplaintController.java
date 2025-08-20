package com.eresolve.complaintmanagement.controller;

import com.eresolve.complaintmanagement.dto.AssignedComplaintResponse;
import com.eresolve.complaintmanagement.enums.Status;
import com.eresolve.complaintmanagement.service.AssignedComplaintService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assigned-complaints")
@CrossOrigin(origins = "http://localhost:3000")
public class AssignedComplaintController {

    private static final Logger logger = LoggerFactory.getLogger(AssignedComplaintController.class);
    private final AssignedComplaintService assignedComplaintService;

    public AssignedComplaintController(AssignedComplaintService assignedComplaintService) {
        this.assignedComplaintService = assignedComplaintService;
    }

    //Update status of assignment (ADMIN  only)
    @PreAuthorize("hasAnyRole('ADMIN')")
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Integer id, @RequestParam Status status) {
        logger.info("Updating status of assignment id {} to {}", id, status);
        AssignedComplaintResponse updated = assignedComplaintService.updateStatus(id, status);
        return ResponseEntity.ok(updated);
    }

    //Admin-only status update with closedDate handling
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/admin-update-status")
    public ResponseEntity<?> adminUpdateStatus(@PathVariable Integer id, @RequestParam Status status) {
        logger.info("Admin updating status of assignment id {} to {}", id, status);
        try {
            AssignedComplaintResponse updated = assignedComplaintService.updateStatusWithClosure(id, status);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            logger.error("Failed to update assignment status for id {}: {}", id, e.getMessage());
            return ResponseEntity.status(404).body("Assignment not found");
        }
    }

    //Get assignment by id (ADMIN only)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id) {
        logger.info("Fetching assignment for id {}", id);
        try {
            AssignedComplaintResponse assignment = assignedComplaintService.getById(id);
            return ResponseEntity.ok(assignment);
        } catch (RuntimeException e) {
            logger.error("Assignment not found for id {}: {}", id, e.getMessage());
            return ResponseEntity.status(404).body("Assignment not found");
        }
    }

    //Get all assignments (ADMIN only)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<?> getAllAssigned() {
        logger.info("Fetching all assigned complaints");
        return ResponseEntity.ok(assignedComplaintService.getAllAssigned());
    }

    //Delete assignment (ADMIN only)
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAssignedComplaint(@PathVariable Integer id) {
        logger.warn("Deleting assignment for id {}", id);
        assignedComplaintService.delete(id);
        return ResponseEntity.noContent().build();
    }
}