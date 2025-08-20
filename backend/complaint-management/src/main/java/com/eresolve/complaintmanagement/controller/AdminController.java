package com.eresolve.complaintmanagement.controller;

import com.eresolve.complaintmanagement.dto.*;
import com.eresolve.complaintmanagement.entity.UserDetails;
import com.eresolve.complaintmanagement.service.AdminService;
import com.eresolve.complaintmanagement.service.UserService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);
    private final AdminService adminService;
    private final UserService userService;

    public AdminController(AdminService adminService, UserService userService) {
        this.adminService = adminService;
        this.userService = userService;
    }

    // 📊 Admin Dashboard Metrics
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DashboardStatsResponse> getAdminDashboard() {
        logger.info("Accessing admin dashboard");
        DashboardStatsResponse stats = adminService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }


 // 📌 Assign complaint to staff
    @PutMapping("/complaints/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AssignmentResponse> assignComplaintToStaff(@Valid @RequestBody AssignComplaintRequest request) {
        try {
            AssignmentResponse response = adminService.assignComplaintToStaff(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error assigning complaint: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }


    // ✏️ Update complaint
    @PutMapping("/complaints/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> updateComplaint(@PathVariable Integer id,
                                                  @Valid @RequestBody ComplaintRequest updatedComplaint) {
        try {
            adminService.updateComplaintDetails(id, updatedComplaint);
            return ResponseEntity.ok("Complaint updated successfully");
        } catch (Exception e) {
            logger.error("Error updating complaint: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Failed to update complaint.");
        }
    }


    // 🔁 Reassign complaint
    @PutMapping("/reassign-complaint")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> reassignComplaint(@Valid @RequestBody ReassignComplaintRequest request) {
        try {
            AssignmentResponse reassignment = adminService.reassignComplaint(request);
            return ResponseEntity.ok(reassignment);
        } catch (EntityNotFoundException e) {
            logger.warn("Reassignment failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid reassignment request: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error during reassignment", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }
    
    
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/soft-delete/{userId}")
    public ResponseEntity<?> deleteUserById(@PathVariable Integer userId) {
        logger.info("Deleting user with ID {}", userId);
        try {
            adminService.deleteUserById(userId);
            return ResponseEntity.ok("User deleted successfully.");
        } catch (RuntimeException e) {
            logger.error("Error deleting user", e);
            return ResponseEntity.badRequest().body("Failed to delete user: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/hard-delete/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Integer userId) {
        logger.info("Hard deleting user {}", userId);
        try {
            adminService.deleteUserCompletely(userId);
            return ResponseEntity.ok("User deleted successfully");
        } catch (Exception e) {
            logger.error("Error deleting user", e);
            return ResponseEntity.badRequest().body("Failed to delete user: " + e.getMessage());
        }
    }
    
    // 👥 Staff listing
    @GetMapping("/staff")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<StaffSummaryResponse>> getAllStaff() {
        try {
            return ResponseEntity.ok(adminService.getAllStaffMembers());
        } catch (Exception e) {
            logger.error("Error fetching staff members: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all-registered-users")
    public ResponseEntity<?> getAllUsers() {
        logger.info("ADMIN requested all users");
        try {
            List<UserDetails> users = adminService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            logger.error("Error fetching users", e);
            return ResponseEntity.status(500).body("Internal server error while fetching users");
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/add-user")
    public ResponseEntity<?> addUser(@RequestBody UserRequest request) {
        logger.info("Adding user with email: {}", request.getEmail());
        try {
        	adminService.addUser(request.getName(), request.getEmail(), request.getPassword(), request.getRole());
            return ResponseEntity.ok("User added successfully");
        } catch (Exception e) {
            logger.error("Failed to add user", e);
            return ResponseEntity.badRequest().body("Failed to add user: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable Integer userId) {
        logger.info("Fetching user by ID: {}", userId);
        try {
            UserDetails user = userService.getUserById(userId);

            UserResponse response = new UserResponse(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error fetching user", e);
            return ResponseEntity.badRequest().body("Failed to fetch user: " + e.getMessage());
        }
    }


    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable Integer userId,
                                        @RequestBody UserRequest request) {
        logger.info("Updating userId: {}", userId);
        try {
        	adminService.updateUser(userId, request.getName(), request.getEmail(), request.getRole());
            return ResponseEntity.ok("User updated successfully");
        } catch (Exception e) {
            logger.error("Failed to update user", e);
            return ResponseEntity.badRequest().body("Failed to update user: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @DeleteMapping("/deactivate/{userId}")
    public ResponseEntity<?> deactivateUser(@PathVariable Integer userId) {
        try {
            userService.deactivateUser(userId);
            return ResponseEntity.ok("User deactivated successfully.");
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body("Error during deactivation: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @PutMapping("/reactivate/{userId}")
    public ResponseEntity<?> reactivateUser(@PathVariable Integer userId) {
        try {
            userService.reactivateUser(userId);
            return ResponseEntity.ok("User reactivated successfully. Temporary password is: Temp@123");
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body("Error during reactivation: " + e.getMessage());
        }
    }
      
}