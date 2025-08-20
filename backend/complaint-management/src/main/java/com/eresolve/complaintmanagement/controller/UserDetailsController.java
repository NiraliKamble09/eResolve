package com.eresolve.complaintmanagement.controller;

import com.eresolve.complaintmanagement.dto.UserResponse;
import com.eresolve.complaintmanagement.enums.Role;
import com.eresolve.complaintmanagement.service.UserDetailsService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/user-details")
public class UserDetailsController {

    private static final Logger logger = LoggerFactory.getLogger(UserDetailsController.class);

    private final UserDetailsService service;

    public UserDetailsController(UserDetailsService service) {
        this.service = service;
    }

    //ADMIN and STAFF can fetch by email (Path Variable)
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    @GetMapping("/by-email/{email}")
    public ResponseEntity<?> getByEmail(@PathVariable String email) {
        logger.info("Fetching user by email: {}", email);
        try {
            UserResponse response = service.getUserResponseByEmail(email);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error fetching user by email: {}", email, e);
            return ResponseEntity.badRequest().body("Failed to fetch user by email: " + e.getMessage());
        }
    }

    //Only ADMIN can fetch users by role
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/by-role")
    public ResponseEntity<?> getByRole(@RequestParam Role role) {
        logger.info("Fetching users by role: {}", role);
        try {
            List<UserResponse> responses = service.getUserResponsesByRole(role);
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            logger.error("Error fetching users by role: {}", role, e);
            return ResponseEntity.badRequest().body("Failed to fetch users by role: " + e.getMessage());
        }
    }
}