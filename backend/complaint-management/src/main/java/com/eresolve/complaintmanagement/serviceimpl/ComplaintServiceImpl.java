package com.eresolve.complaintmanagement.serviceimpl;

import com.eresolve.complaintmanagement.dto.ComplaintResponse;
import com.eresolve.complaintmanagement.dto.ComplaintView;
import com.eresolve.complaintmanagement.entity.Complaint;
import com.eresolve.complaintmanagement.entity.UserDetails;
import com.eresolve.complaintmanagement.enums.Status;
import com.eresolve.complaintmanagement.repository.ComplaintRepository;
import com.eresolve.complaintmanagement.repository.UserDetailsRepository;
import com.eresolve.complaintmanagement.service.ComplaintService;

import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ComplaintServiceImpl implements ComplaintService {

    private static final Logger logger = LoggerFactory.getLogger(ComplaintServiceImpl.class);

    private final ComplaintRepository complaintRepository;
    private final UserDetailsRepository userDetailsRepository;
   

    public ComplaintServiceImpl(
            ComplaintRepository complaintRepository,
            UserDetailsRepository userDetailsRepository
    ) {
        this.complaintRepository = complaintRepository;
        this.userDetailsRepository = userDetailsRepository;
    }

    private ComplaintResponse mapToResponse(Complaint complaint) {
        return new ComplaintResponse(
                complaint.getComplaintId(),
                complaint.getTitle(),
                complaint.getDescription(),
                complaint.getCategory(),
                complaint.getStatus(),
                complaint.getMedia(),
                complaint.getCreatedAt(),
                complaint.getUpdatedAt(),
                complaint.getUser()
        );
    }

    @Override
    public ComplaintResponse createComplaint(Integer userId, String title, String description, String category, String media) {
        logger.info("Creating complaint for userId: {}", userId);
        UserDetails user = userDetailsRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Complaint complaint = new Complaint();
        complaint.setUserId(userId);
        complaint.setUser(user);
        complaint.setTitle(title);
        complaint.setDescription(description);
        complaint.setCategory(category);
        complaint.setMedia(media);
        complaint.setStatus(Status.OPEN);
        complaint.setCreatedAt(LocalDateTime.now());
        complaint.setUpdatedAt(LocalDateTime.now());

        return mapToResponse(complaintRepository.save(complaint));
    }

    @Transactional
    @Override
    public void deleteComplaintWithMedia(Integer complaintId) {
        Complaint complaint = complaintRepository.findByComplaintId(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        if (complaint.getMedia() != null) {
            String mediaUrl = complaint.getMedia();
            String fileName = mediaUrl.substring(mediaUrl.lastIndexOf("/") + 1);
            Path filePath = Paths.get("uploads").resolve(fileName);
            try {
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                throw new RuntimeException("Failed to delete media file: " + fileName);
            }
        }

        complaintRepository.delete(complaint);
    }


    @Override
    public List<ComplaintView> getAllComplaints() {
        return complaintRepository.findAll().stream()
                .map(this::mapToView)
                .collect(Collectors.toList());
    }

    @Override
    public ComplaintView getComplaintById(Integer complaintId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        return mapToView(complaint);
    }

    private ComplaintView mapToView(Complaint complaint) {
        var user = complaint.getUser();
        return ComplaintView.builder()
                .complaintId(complaint.getComplaintId())
                .title(complaint.getTitle())
                .description(complaint.getDescription())
                .category(complaint.getCategory())
                .status(complaint.getStatus())
                .media(complaint.getMedia())
                .createdAt(complaint.getCreatedAt())
                .updatedAt(complaint.getUpdatedAt())
                .userId(user.getUserId())
                .userName(user.getName())
                .userEmail(user.getEmail())
                .build();
    }

    
    @Override
    public List<ComplaintView> getComplaintsByStatus(String status, Authentication auth) {
        String email = (String) auth.getPrincipal();
        String role = auth.getAuthorities().stream()
                          .map(GrantedAuthority::getAuthority)
                          .findFirst()
                          .orElse("ROLE_USER");

        logger.info("Fetching complaints with status '{}' for user '{}' and role '{}'", status, email, role);

        UserDetails user = userDetailsRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Status statusEnum;
        try {
            statusEnum = Status.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status value: " + status);
        }

        List<Complaint> complaints;

        if ("ROLE_ADMIN".equals(role) || "ROLE_STAFF".equals(role)) {
            complaints = complaintRepository.findByStatus(statusEnum);
        } else if ("ROLE_USER".equals(role)) {
            complaints = complaintRepository.findByUserIdAndStatus(user.getUserId(), statusEnum);
        } else {
            throw new AccessDeniedException("Unauthorized role");
        }

        return complaints.stream()
                         .map(this::mapToView)
                         .collect(Collectors.toList());
    }

    @Override
    public List<ComplaintView> getUserComplaints(Integer userId) {
        logger.info("Fetching complaints for userId '{}'", userId);

        List<Complaint> complaints = complaintRepository.findByUserId(userId);
        if (complaints.isEmpty()) {
            logger.warn("No complaints found for userId '{}'", userId);
            return List.of();
        }

        return complaints.stream()
                         .map(this::mapToView)
                         .collect(Collectors.toList());
    }
    
    @Override
    public List<ComplaintView> getComplaintsByCategory(String category, Authentication auth) {
        String email = (String) auth.getPrincipal();
        String role = auth.getAuthorities().stream()
                          .map(GrantedAuthority::getAuthority)
                          .findFirst()
                          .orElse("ROLE_USER");

        logger.info("Fetching complaints with category '{}' for user '{}' and role '{}'", category, email, role);

        UserDetails user = userDetailsRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Complaint> complaints;

        if ("ROLE_ADMIN".equals(role) || "ROLE_STAFF".equals(role)) {
            complaints = complaintRepository.findByCategoryIgnoreCase(category);
        } else if ("ROLE_USER".equals(role)) {
            complaints = complaintRepository.findByUserIdAndCategoryIgnoreCase(user.getUserId(), category);
        } else {
            throw new AccessDeniedException("Unauthorized role");
        }

        return complaints.stream()
                         .map(this::mapToView)
                         .collect(Collectors.toList());
    }
}