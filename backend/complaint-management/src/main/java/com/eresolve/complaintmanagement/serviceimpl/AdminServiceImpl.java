package com.eresolve.complaintmanagement.serviceimpl;

import com.eresolve.complaintmanagement.dto.*;
import com.eresolve.complaintmanagement.entity.AssignedComplaint;
import com.eresolve.complaintmanagement.entity.Complaint;
import com.eresolve.complaintmanagement.entity.User;
import com.eresolve.complaintmanagement.entity.UserCredentials;
import com.eresolve.complaintmanagement.entity.UserDetails;
import com.eresolve.complaintmanagement.enums.Role;
import com.eresolve.complaintmanagement.enums.Status;
import com.eresolve.complaintmanagement.repository.*;
import com.eresolve.complaintmanagement.service.AdminService;

import jakarta.persistence.EntityNotFoundException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

    private static final Logger logger = LoggerFactory.getLogger(AdminServiceImpl.class);
    

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private final ComplaintRepository complaintRepository;
    private final UserCredentialsRepository userCredentialsRepository;
    private final UserDetailsRepository userDetailsRepository;
    private final UserRepository userRepository;
    private final AssignedComplaintRepository assignedComplaintRepository;

    public AdminServiceImpl(ComplaintRepository complaintRepository,
                            UserDetailsRepository userDetailsRepository,
                            UserCredentialsRepository userCredentialsRepository,
                            UserRepository userRepository,
                            AssignedComplaintRepository assignedComplaintRepository) {
        this.complaintRepository = complaintRepository;
        this.userDetailsRepository = userDetailsRepository;
        this.userCredentialsRepository = userCredentialsRepository;
        this.userRepository = userRepository;
        this.assignedComplaintRepository = assignedComplaintRepository;
    }

    private String getCurrentUserEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null ? auth.getName() : "system";
    }


    @Override
    public AssignmentResponse assignComplaintToStaff(AssignComplaintRequest request) {
        logger.info("Assigning complaint {} to user {}", request.getComplaintId(), request.getUserId());

        Complaint complaint = complaintRepository.findByComplaintId(request.getComplaintId())
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        UserDetails staff = userDetailsRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!Role.STAFF.equals(staff.getRole())) {
            throw new RuntimeException("User is not a staff member");
        }

        complaint.setUserId(staff.getUserId());
        complaint.setUpdatedAt(LocalDateTime.now());
        complaintRepository.save(complaint);

        AssignedComplaint assigned = new AssignedComplaint();
        assigned.setUserId(staff.getUserId());
        assigned.setComplaintId(complaint.getComplaintId());
        assigned.setStatus(Status.OPEN);
        assigned.setAssignedDate(
            request.getAssignedDate() != null ? request.getAssignedDate() : LocalDateTime.now()
        );

        assignedComplaintRepository.save(assigned);

        String assignedByEmail = getCurrentUserEmail();

        return new AssignmentResponse(
        	    complaint.getComplaintId(),
        	    staff.getUserId(),
        	    assigned.getStatus(),
        	    assignedByEmail,
        	    assigned.getAssignedDate()
        	);
    }

    @Override
    public AssignmentResponse reassignComplaint(ReassignComplaintRequest request) {
        logger.info("Reassigning complaint {} to {}", request.getComplaintId(), request.getNewStaffEmail());

        Complaint complaint = complaintRepository.findByComplaintId(request.getComplaintId())
                .orElseThrow(() -> new EntityNotFoundException("Complaint not found"));

        UserDetails newStaff = userDetailsRepository.findByEmail(request.getNewStaffEmail())
                .orElseThrow(() -> new EntityNotFoundException("User with email " + request.getNewStaffEmail() + " not found"));

        if (!Role.STAFF.equals(newStaff.getRole())) {
            throw new IllegalArgumentException("User is not a staff member");
        }

        complaint.setUserId(newStaff.getUserId());
        complaint.setUpdatedAt(LocalDateTime.now());
        complaintRepository.save(complaint);

        AssignedComplaint assigned = assignedComplaintRepository
                .findByComplaintId(complaint.getComplaintId())
                .orElseThrow(() -> new EntityNotFoundException("AssignedComplaint not found for complaint " + complaint.getComplaintId()));

        // ✅ Only update — don't insert
        assigned.setUserId(newStaff.getUserId());
        assigned.setAssignedDate(LocalDateTime.now());
        assignedComplaintRepository.save(assigned);

        String reassignedByEmail = getCurrentUserEmail();

        logger.info("Complaint {} reassigned to {} by {}", complaint.getComplaintId(), newStaff.getEmail(), reassignedByEmail);

        return new AssignmentResponse(
                complaint.getComplaintId(),
                newStaff.getUserId(),
                assigned.getStatus(),
                reassignedByEmail,
                assigned.getAssignedDate()
        );
    }
    
    
    @Override
    public void updateComplaintDetails(Integer complaintId, ComplaintRequest updatedComplaint) {
        logger.info("Updating complaint {}", complaintId);
        logger.debug("Incoming complaint update payload: {}", updatedComplaint);

        Complaint complaint = complaintRepository.findByComplaintId(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        if (updatedComplaint.getTitle() != null) {
            complaint.setTitle(updatedComplaint.getTitle());
        }

        if (updatedComplaint.getDescription() != null) {
            complaint.setDescription(updatedComplaint.getDescription());
        }

        if (updatedComplaint.getCategory() != null) {
            complaint.setCategory(updatedComplaint.getCategory());
        }

        if (updatedComplaint.getMedia() != null) {
            complaint.setMedia(updatedComplaint.getMedia());
        }

        if (updatedComplaint.getStatus() != null) {
            complaint.setStatus(updatedComplaint.getStatus());
        }

        complaint.setUpdatedAt(LocalDateTime.now());

        complaintRepository.save(complaint);

        logger.info("Complaint {} updated successfully", complaintId);
    }


    @Override
    public void deleteUserById(Integer userId) {
        logger.info("Deleting user with ID {}", userId);

        UserDetails user = userDetailsRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userDetailsRepository.delete(user);

        logger.info("User {} deleted successfully", userId);
    }

    @Transactional
    @Override
    public void deleteUserCompletely(Integer userId) {
        logger.info("Hard deleting userId: {}", userId);

        UserDetails user = userDetailsRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String email = user.getEmail();

        userCredentialsRepository.findById(email)
                .ifPresent(userCredentialsRepository::delete);

        userDetailsRepository.deleteById(userId);

        if (userRepository.existsById(userId)) {
            userRepository.deleteById(userId);
        }

        logger.info("Successfully hard deleted userId: {}", userId);
    }


    @Override
    public List<StaffSummaryResponse> getAllStaffMembers() {
        logger.info("Fetching all staff members");

        List<UserDetails> staffList = Optional.ofNullable(userDetailsRepository.findByRole(Role.STAFF))
            .orElse(Collections.emptyList());

        logger.info("Found {} staff members", staffList.size());

        return staffList.stream()
            .map(u -> new StaffSummaryResponse(u.getUserId(), u.getName(), u.getEmail()))
            .collect(Collectors.toList());
    }

    @Override
    public List<ComplaintResponse> getAllComplaintsByUserEmail() {
        logger.info("Fetching all complaints with user email");

        List<Complaint> complaints = complaintRepository.findAll(); // Consider join fetch if possible

        return complaints.stream().map(c -> {
            UserDetails user = c.getUser();
            if (user == null) {
                user = userDetailsRepository.findById(c.getUserId()).orElse(null);
                if (user == null) {
                    logger.warn("User not found for complaint ID {}", c.getComplaintId());
                }
            }

            return new ComplaintResponse(
                c.getComplaintId(),
                c.getTitle(),
                c.getDescription(),
                c.getCategory(),
                c.getStatus(),
                c.getMedia(),
                c.getCreatedAt(),
                c.getUpdatedAt(),
                user
            );
        }).collect(Collectors.toList());
    }

    @Override
    public List<Complaint> getComplaintsByStatus(Status status) {
        logger.info("Fetching complaints with status {}", status);
        return complaintRepository.findByStatus(status);
    }

    @Override
    public DashboardStatsResponse getDashboardStats() {
        logger.info("Fetching dashboard statistics");

        long totalComplaints = complaintRepository.count();
        long openComplaints = complaintRepository.countByStatus(Status.OPEN);
        long inProgress = complaintRepository.countByStatus(Status.IN_PROGRESS);
        long resolved = complaintRepository.countByStatus(Status.RESOLVED);
        long closed = complaintRepository.countByStatus(Status.CLOSED);

        logger.info("Dashboard stats: total={}, open={}, inProgress={}, resolved={}, closed={}",
            totalComplaints, openComplaints, inProgress, resolved, closed);

        return new DashboardStatsResponse(
            totalComplaints,
            openComplaints,
            inProgress,
            resolved,
            closed
        );
    }
    
    
    @Override
    public List<UserDetails> getAllUsers() {
        logger.info("Fetching all users");
        return userDetailsRepository.findAll();
    }

    @Override
    @Transactional
    public void addUser(String name, String email, String password, Role role) {
        logger.info("Adding user: {} with email: {}", name, email);
        if (userDetailsRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        UserDetails details = new UserDetails();
        details.setUser(user);
        details.setName(name);
        details.setEmail(email);
        details.setRole(role);
        user.setUserDetails(details);
        userRepository.save(user);

        UserCredentials credentials = new UserCredentials();
        credentials.setEmail(email);
        credentials.setPassword(passwordEncoder.encode(password));
        userCredentialsRepository.save(credentials);
    }

    @Override
    public void updateUser(Integer userId, String name, String email, Role role) {
        logger.info("Updating userId: {}", userId);
        UserDetails details = userDetailsRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        details.setName(name);
        details.setRole(role);
        userDetailsRepository.save(details);
    }

    
    @Override
    public UserDetails getUserById(Integer userId) {
        return userDetailsRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}