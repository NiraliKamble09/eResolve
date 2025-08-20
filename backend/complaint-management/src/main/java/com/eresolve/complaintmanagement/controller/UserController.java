package com.eresolve.complaintmanagement.controller;

import com.eresolve.complaintmanagement.entity.UserDetails;
import com.eresolve.complaintmanagement.enums.Status;
import com.eresolve.complaintmanagement.repository.UserDetailsRepository;
import com.eresolve.complaintmanagement.service.UserService;
import com.eresolve.complaintmanagement.dto.ComplaintUserView;
import com.eresolve.complaintmanagement.dto.ComplaintView;
import com.eresolve.complaintmanagement.dto.DashboardView;
import com.eresolve.complaintmanagement.dto.UserInfo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private UserDetailsRepository userDetailsRepository;
    
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/dashboard")
    public ResponseEntity<?> getUserDashboard(Authentication authentication) {
        String email = authentication.getName();
        try {
            DashboardView dashboard = userService.getUserDashboard(email);
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            logger.error("Error fetching dashboard for user {}: {}", email, e.getMessage());
            return ResponseEntity.badRequest().body("Unable to fetch dashboard.");
        }
    }

    @PreAuthorize("hasRole('USER')")
    @DeleteMapping("/deactivate/{userId}")
    public ResponseEntity<?> deactivateOwnAccount(@PathVariable Integer userId, Authentication authentication) {
        String email = authentication.getName();
        try {
            UserDetails user = userDetailsRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

            if (!userId.equals(user.getUserId())) {
                logger.warn("User {} attempted to deactivate account of userId {}", email, userId);
                return ResponseEntity.status(403).body("You can only deactivate your own account");
            }

            userService.deactivateUser(userId);
            logger.info("User {} (ID: {}) deactivated their account", email, userId);
            return ResponseEntity.ok("Your account has been deactivated.");
        } catch (Exception e) {
            logger.error("Deactivation failed for userId {}: {}", userId, e.getMessage());
            return ResponseEntity.badRequest().body("Failed to deactivate account.");
        }
    }

    @PreAuthorize("hasRole('USER')")
    @PutMapping("/reactivate/{userId}")
    public ResponseEntity<?> reactivateOwnAccount(@PathVariable Integer userId, Authentication authentication) {
        String email = authentication.getName();
        try {
            UserDetails user = userDetailsRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

            if (!userId.equals(user.getUserId())) {
                logger.warn("User {} attempted to reactivate account of userId {}", email, userId);
                return ResponseEntity.status(403).body("You can only reactivate your own account");
            }

            String tempPassword = userService.reactivateUser(userId);
            logger.info("User {} (ID: {}) reactivated their account", email, userId);
            return ResponseEntity.ok("Your account has been reactivated. Temporary password is: " + tempPassword);
        } catch (Exception e) {
            logger.error("Reactivation failed for userId {}: {}", userId, e.getMessage());
            return ResponseEntity.badRequest().body("Failed to reactivate account.");
        }
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/complaints/id/{complaintId}")
    public ResponseEntity<?> getOwnComplaintById(@PathVariable Integer complaintId, Authentication authentication) {
        String email = authentication.getName();
        try {
            ComplaintView complaint = userService.getOwnComplaintById(complaintId, email);
            return ResponseEntity.ok(complaint);
        } catch (Exception e) {
            logger.error("Error fetching complaint {} for user {}: {}", complaintId, email, e.getMessage());
            return ResponseEntity.badRequest().body("Unable to fetch complaint.");
        }
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/complaints/category/{category}")
    public ResponseEntity<?> getOwnComplaintsByCategory(@PathVariable String category, Authentication authentication) {
        String email = authentication.getName();
        try {
            List<ComplaintView> complaints = userService.getOwnComplaintsByCategory(category, email);
            return ResponseEntity.ok(complaints);
        } catch (Exception e) {
            logger.error("Error fetching complaints for category '{}' and user {}: {}", category, email, e.getMessage());
            return ResponseEntity.badRequest().body("Unable to fetch complaints.");
        }
    }
    
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/complaints/status/{status}")
    public ResponseEntity<?> getOwnComplaintsByStatus(@PathVariable Status status) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        logger.info("Fetching complaints for user '{}' with status '{}'", email, status);

        try {
            List<ComplaintView> complaints = userService.getComplaintsByStatus(status);
            logger.info("Retrieved {} complaints for user '{}' with status '{}'", complaints.size(), email, status);
            return ResponseEntity.ok(complaints);
        } catch (Exception e) {
            logger.error("Error fetching complaints for user '{}' with status '{}': {}", email, status, e.getMessage(), e);
            return ResponseEntity.badRequest().body("Unable to fetch complaints.");
        }
    }
    
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/me")
    public ResponseEntity<?> getAuthenticatedUserDetails(Authentication authentication) {
        try {
            UserInfo userDTO = userService.getAuthenticatedUserInfo();
            return ResponseEntity.ok(userDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Unable to fetch account details.");
        }
    }
    
    
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/complaints/my")
    public ResponseEntity<?> getOwnComplaints(Authentication authentication) {
        String email = authentication.getName();
        try {
            List<ComplaintUserView> complaints = userService.getOwnComplaints(email);
            return ResponseEntity.ok(complaints);
        } catch (Exception e) {
            logger.error("Error fetching own complaints for user {}: {}", email, e.getMessage());
            return ResponseEntity.badRequest().body("Unable to fetch your complaints.");
        }
    }

    
    
}

