package com.eresolve.complaintmanagement.controller;

import com.eresolve.complaintmanagement.dto.UpvoteCount;
import com.eresolve.complaintmanagement.dto.UpvoteResponse;
import com.eresolve.complaintmanagement.service.PublicViewService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/public")
public class PublicViewController {

    private static final Logger logger = LoggerFactory.getLogger(PublicViewController.class);
    private final PublicViewService publicViewService;

    public PublicViewController(PublicViewService publicViewService) {
        this.publicViewService = publicViewService;
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/upvotes/{complaintId}")
    public ResponseEntity<UpvoteCount> getUpvotes(@PathVariable Integer complaintId) {
        logger.info("GET /upvotes/{} - Fetching upvote count", complaintId);
        UpvoteCount count = publicViewService.getUpvotes(complaintId);
        logger.debug("Upvote count for complaintId {}: {}", complaintId, count.getUpvotes());
        return ResponseEntity.ok(count);
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/upvote/{complaintId}")
    public ResponseEntity<UpvoteResponse> upvoteComplaint(@PathVariable Integer complaintId) {
        logger.info("POST /upvote/{} - Upvoting complaint", complaintId);
        UpvoteResponse response = publicViewService.upvoteComplaint(complaintId);
        logger.debug("Upvote successful for complaintId {}: new count = {}", complaintId, response.getTotalUpvotes());
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/reset/{complaintId}")
    public ResponseEntity<UpvoteResponse> resetUpvotes(@PathVariable Integer complaintId) {
        logger.warn("POST /reset/{} - Resetting upvotes", complaintId);
        UpvoteResponse response = publicViewService.resetUpvotes(complaintId);
        logger.info("Upvotes reset for complaintId {}: new count = {}", complaintId, response.getTotalUpvotes());
        return ResponseEntity.ok(response);
    }
}