package com.eresolve.complaintmanagement.serviceimpl;

import com.eresolve.complaintmanagement.dto.AssignedComplaintResponse;
import com.eresolve.complaintmanagement.dto.ComplaintView;
import com.eresolve.complaintmanagement.dto.StaffDashboardResponse;
import com.eresolve.complaintmanagement.dto.UserResponse;
import com.eresolve.complaintmanagement.entity.AssignedComplaint;
import com.eresolve.complaintmanagement.entity.Complaint;
import com.eresolve.complaintmanagement.entity.UserDetails;
import com.eresolve.complaintmanagement.enums.Role;
import com.eresolve.complaintmanagement.enums.Status;
import com.eresolve.complaintmanagement.repository.AssignedComplaintRepository;
import com.eresolve.complaintmanagement.repository.ComplaintRepository;
import com.eresolve.complaintmanagement.repository.UserDetailsRepository;
import com.eresolve.complaintmanagement.service.StaffService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class StaffServiceImpl implements StaffService {

    private static final Logger logger = LoggerFactory.getLogger(StaffServiceImpl.class);

    private final ComplaintRepository complaintRepository;
    private final UserDetailsRepository userDetailsRepository;
    private final AssignedComplaintRepository assignedComplaintRepository;

    public StaffServiceImpl(ComplaintRepository complaintRepository,
                            UserDetailsRepository userDetailsRepository,                          
                            AssignedComplaintRepository assignedComplaintRepository) {
        this.complaintRepository = complaintRepository;
        this.userDetailsRepository = userDetailsRepository;
        this.assignedComplaintRepository = assignedComplaintRepository;
    }

    private UserDetails getStaffByEmail(String email) {
        return userDetailsRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Staff not found"));
    }

    private Complaint getComplaintOrThrow(Integer complaintId) {
        return complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
    }

    private void validateAssignmentOwnership(AssignedComplaint assignment, UserDetails staff) {
        if (!assignment.getUserId().equals(staff.getUserId())) {
            throw new RuntimeException("Unauthorized: not your assignment");
        }
    }

    @Override
    public List<AssignedComplaintResponse> getAssignedComplaints(String email) {
        logger.info("Looking up staff by email: {}", email);
        UserDetails staff = userDetailsRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        Integer userId = staff.getUserId();
        logger.info("Resolved userId: {}", userId);

        List<AssignedComplaintResponse> assignments = assignedComplaintRepository.findAssignmentsByUserId(userId);
        logger.info("Found {} assignments for userId {}", assignments.size(), userId);

        return assignments;
    }
    @Override
    public Complaint getComplaintById(Integer complaintId) {
        return complaintRepository.findByComplaintId(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
    }

    @Transactional
    @Override
    public AssignedComplaintResponse updateAssignmentStatus(Integer assignmentId, Status newStatus, String staffEmail) {
        UserDetails staff = getStaffByEmail(staffEmail);

        AssignedComplaint assignment = assignedComplaintRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        if (!assignment.getUserId().equals(staff.getUserId())) {
            throw new AccessDeniedException("Assignment does not belong to the authenticated staff");
        }


        assignment.setStatus(newStatus);
        assignment.setClosedDate(newStatus == Status.RESOLVED ? LocalDateTime.now() : null);
        assignedComplaintRepository.save(assignment);


        Complaint complaint = complaintRepository.findById(assignment.getComplaintId())
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        if (complaint.getStatus() != newStatus) {
            complaint.setStatus(newStatus);
            complaint.setUpdatedAt(LocalDateTime.now());
            complaintRepository.save(complaint);
            logger.info("Complaint {} status updated to {}", complaint.getComplaintId(), newStatus);
        }

        return new AssignedComplaintResponse(
                assignment.getId(),
                assignment.getUserId(),
                assignment.getComplaintId(),
                assignment.getStatus(),
                assignment.getAssignedDate(),
                assignment.getClosedDate(),
                assignment.getRemark()
        );
    }
    
    
    @Override
    public UserResponse getUserAssignedToComplaint(Long complaintId, String staffEmail) {
        logger.info("STAFF [{}] requesting user info for complaint ID [{}]", staffEmail, complaintId);
        UserDetails staff = getStaffByEmail(staffEmail);
        if (!Role.STAFF.equals(staff.getRole())) {
            throw new RuntimeException("User is not a staff member");
        }

        AssignedComplaint assignment = assignedComplaintRepository.findByComplaintId(complaintId.intValue())
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        validateAssignmentOwnership(assignment, staff);

        UserDetails assignedUser = userDetailsRepository.findByUserId(assignment.getUserId())
                .orElseThrow(() -> new RuntimeException("Assigned user not found"));

        return new UserResponse(
                assignedUser.getUserId(),
                assignedUser.getName(),
                assignedUser.getEmail(),
                assignedUser.getRole()
        );
    }

    @Override
    public ComplaintView getComplaintViewById(Integer complaintId, String staffEmail) {
        Complaint complaint = getComplaintOrThrow(complaintId);
        UserDetails user = userDetailsRepository.findById(complaint.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

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

    @SuppressWarnings("incomplete-switch")
	@Override
    public StaffDashboardResponse getDashboardStats(String staffEmail) {
        UserDetails staff = getStaffByEmail(staffEmail);
        Integer userId = staff.getUserId();
        List<AssignedComplaintResponse> assignments = assignedComplaintRepository.findAssignmentsByUserId(userId);

        int total = assignments.size();
        int resolved = 0, inProgress = 0, open = 0;

        for (AssignedComplaintResponse ac : assignments) {
            switch (ac.getStatus()) {
                case RESOLVED -> resolved++;
                case IN_PROGRESS -> inProgress++;
                case OPEN -> open++;
            }
        }

        return new StaffDashboardResponse(total, resolved, inProgress, open);
    }
    
    @Override
    public List<AssignedComplaintResponse> getAssignedComplaintsByStatus(String staffEmail, Status status) {
        logger.info("Filtering assignments for staff [{}] by status [{}]", staffEmail, status);
        UserDetails staff = getStaffByEmail(staffEmail);
        Integer userId = staff.getUserId();

        List<AssignedComplaintResponse> allAssignments = assignedComplaintRepository.findAssignmentsByUserId(userId);
        return allAssignments.stream()
                .filter(ac -> ac.getStatus() == status)
                .toList();
    }

    @Transactional
    @Override
    public AssignedComplaintResponse updateAssignmentRemark(Integer assignmentId, String remark, String staffEmail) {
        logger.info("Staff [{}] attempting to update remark for assignment [{}]", staffEmail, assignmentId);

        UserDetails staff = userDetailsRepository.findByEmail(staffEmail)
                .orElseThrow(() -> {
                    logger.error(" Staff not found for email [{}]", staffEmail);
                    return new RuntimeException("Staff not found");
                });

        AssignedComplaint assignment = assignedComplaintRepository.findById(assignmentId)
                .orElseThrow(() -> {
                    logger.error("Assignment not found for ID [{}]", assignmentId);
                    return new RuntimeException("Assignment not found");
                });

        if (!assignment.getUserId().equals(staff.getUserId())) {
            logger.warn("Unauthorized attempt by staff [{}] on assignment [{}]", staffEmail, assignmentId);
            throw new AccessDeniedException("Assignment does not belong to the authenticated staff");
        }


        assignment.setRemark(remark);
        assignedComplaintRepository.save(assignment);

        logger.info("Remark updated successfully for assignment [{}] by staff [{}]", assignmentId, staffEmail);

        return new AssignedComplaintResponse(
                assignment.getId(),
                assignment.getUserId(),
                assignment.getComplaintId(),
                assignment.getStatus(),
                assignment.getAssignedDate(),
                assignment.getClosedDate(),
                assignment.getRemark()
        );
    }

    @Override
    public UserResponse getStaffInfoByEmail(String email) {
        UserDetails staff = userDetailsRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Staff not found"));

        return new UserResponse(
            staff.getUserId(),
            staff.getName(),
            staff.getEmail(),
            Role.STAFF 
        );
    }
}

    