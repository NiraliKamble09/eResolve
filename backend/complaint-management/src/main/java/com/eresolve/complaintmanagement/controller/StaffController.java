package com.eresolve.complaintmanagement.controller;

import com.eresolve.complaintmanagement.dto.AssignedComplaintResponse;
import com.eresolve.complaintmanagement.dto.ComplaintView;
import com.eresolve.complaintmanagement.dto.RemarkUpdateRequest;
import com.eresolve.complaintmanagement.dto.StatusUpdateRequest;
import com.eresolve.complaintmanagement.dto.UserResponse;
import com.eresolve.complaintmanagement.enums.Status;
import com.eresolve.complaintmanagement.dto.StaffDashboardResponse;
import com.eresolve.complaintmanagement.service.StaffService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/staff")
@CrossOrigin(origins = "http://localhost:3000")
public class StaffController {

    private static final Logger logger = LoggerFactory.getLogger(StaffController.class);
    private final StaffService staffService;

    public StaffController(StaffService staffService) {
        this.staffService = staffService;
    }

    //Fetch all complaints assigned to the logged-in staff
    @GetMapping("/assigned_complaints")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<List<AssignedComplaintResponse>> getStaffTasks(Authentication authentication) {
        String email = authentication.getName();
        logger.info("Fetching tasks for staff: {}", email);
        try {
            List<AssignedComplaintResponse> complaints = staffService.getAssignedComplaints(email);
            return ResponseEntity.ok(complaints);
        } catch (Exception e) {
            logger.error("Error fetching tasks: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }
    }

    
 //View detailed complaint info (includes user info)
    @GetMapping("/complaint-details/{complaintId}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<?> getComplaintDetails(@PathVariable Integer complaintId) {
        logger.info("Fetching complaint details for ID: {}", complaintId);
        try {
            ComplaintView view = staffService.getComplaintViewById(complaintId, null);
            return ResponseEntity.ok(view);
        } catch (Exception e) {
            logger.error("Error fetching complaint: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Failed to fetch complaint");
        }
    }

 //Update assignment status (which auto-syncs complaint status)
    @PutMapping("/assignments/{id}/status")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<?> updateAssignmentStatus(@PathVariable Integer id,
                                                    @RequestBody StatusUpdateRequest request,
                                                    Authentication authentication) {
        String email = authentication.getName();
        logger.info("Staff {} attempting to update assignment {} to status {}", email, id, request.getStatus());

        try {
            AssignedComplaintResponse updated = staffService.updateAssignmentStatus(id, request.getStatus(), email);
            return ResponseEntity.ok(updated);
        } catch (AccessDeniedException ade) {
            logger.warn("Access denied for staff {} on assignment {}: {}", email, id, ade.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to update this assignment");
        } catch (RuntimeException re) {
            logger.error("Error updating assignment status: {}", re.getMessage());
            return ResponseEntity.badRequest().body(re.getMessage());
        }
    }

    
    //Fetch dashboard stats for logged-in staff
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<StaffDashboardResponse> getDashboard(Authentication authentication) {
        String email = authentication.getName();
        logger.info("Fetching dashboard stats for staff: {}", email);
        try {
            StaffDashboardResponse stats = staffService.getDashboardStats(email);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            logger.error("Error fetching dashboard: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    //Get user info assigned to a complaint (with ownership validation)
    @GetMapping("/complaint/{complaintId}/user")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<?> getUserAssignedToComplaint(@PathVariable Long complaintId,
                                                        Authentication authentication) {
        String email = authentication.getName();
        logger.info("Fetching user assigned to complaint {} for staff {}", complaintId, email);
        try {
            UserResponse user = staffService.getUserAssignedToComplaint(complaintId, email);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            logger.error("Error fetching assigned user: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Failed to fetch assigned user");
        }
    }
    
    //get assignd_complaints by status
    @GetMapping("/assigned_complaints/filter")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<?> getFilteredAssignments(@RequestParam Status status,
                                                    Authentication authentication) {
        String email = authentication.getName();
        logger.info("Fetching assignments for staff {} with status {}", email, status);
        try {
            List<AssignedComplaintResponse> filtered = staffService.getAssignedComplaintsByStatus(email, status);
            return ResponseEntity.ok(filtered);
        } catch (Exception e) {
            logger.error("Error filtering assignments: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Failed to filter assignments");
        }
    }
    
    @PutMapping("/assignments/{id}/remark")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<?> updateAssignmentRemark(@PathVariable Integer id,
                                                    @RequestBody RemarkUpdateRequest request,
                                                    Authentication authentication) {
        String email = authentication.getName();
        logger.info("Staff {} updating remark for assignment {}", email, id);
        try {
            AssignedComplaintResponse updated = staffService.updateAssignmentRemark(id, request.getRemark(), email);
            return ResponseEntity.ok(updated);
        } catch (AccessDeniedException ade) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized to update this assignment");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update remark");
        }
    }
    
    
    @PreAuthorize("hasRole('STAFF')")
    @GetMapping("/me")
    public ResponseEntity<?> getAuthenticatedStaffInfo(Authentication authentication) {
        String email = authentication.getName();
        logger.info("Fetching profile info for staff: {}", email);
        try {
            UserResponse staffInfo = staffService.getStaffInfoByEmail(email);
            return ResponseEntity.ok(staffInfo);
        } catch (Exception e) {
            logger.error("Error fetching staff info for {}: {}", email, e.getMessage());
            return ResponseEntity.badRequest().body("Unable to fetch staff profile.");
        }
    }

}