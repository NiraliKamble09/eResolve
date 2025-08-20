package com.eresolve.complaintmanagement.controller;

import com.eresolve.complaintmanagement.entity.UserCredentials;
import com.eresolve.complaintmanagement.service.UserCredentialsService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/credentials")
@CrossOrigin(origins = "http://localhost:3000")
public class UserCredentialsController {

    private static final Logger logger = LoggerFactory.getLogger(UserCredentialsController.class);
    private final UserCredentialsService service;

    public UserCredentialsController(UserCredentialsService service) {
        this.service = service;
    }

    //View all credentials (ADMIN only)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<UserCredentials>> getAllCredentials() {
        logger.info("Admin fetching all user credentials");
        return ResponseEntity.ok(service.getAll());
    }

    //Delete credentials by email (ADMIN only)
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{email}")
    public ResponseEntity<Void> deleteCredentials(@PathVariable String email) {
        logger.warn("Admin deleting credentials for email: {}", email);
        service.delete(email);
        return ResponseEntity.noContent().build();
    }


}