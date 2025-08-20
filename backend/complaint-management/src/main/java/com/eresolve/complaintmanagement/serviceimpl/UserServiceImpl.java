package com.eresolve.complaintmanagement.serviceimpl;

import com.eresolve.complaintmanagement.service.UserService;
import com.eresolve.complaintmanagement.dto.ComplaintUserView;
import com.eresolve.complaintmanagement.dto.ComplaintView;
import com.eresolve.complaintmanagement.dto.DashboardView;
import com.eresolve.complaintmanagement.dto.UserInfo;
import com.eresolve.complaintmanagement.entity.AssignedComplaint;
import com.eresolve.complaintmanagement.entity.Complaint;
import com.eresolve.complaintmanagement.entity.DeletedUser;
import com.eresolve.complaintmanagement.entity.UserCredentials;
import com.eresolve.complaintmanagement.entity.UserDetails;
import com.eresolve.complaintmanagement.enums.Role;
import com.eresolve.complaintmanagement.enums.Status;
import com.eresolve.complaintmanagement.repository.AssignedComplaintRepository;
import com.eresolve.complaintmanagement.repository.ComplaintRepository;
import com.eresolve.complaintmanagement.repository.DeletedUserRepository;
import com.eresolve.complaintmanagement.repository.PublicViewRepository;
import com.eresolve.complaintmanagement.repository.UserCredentialsRepository;
import com.eresolve.complaintmanagement.repository.UserDetailsRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;



@Service
public class UserServiceImpl implements UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    @Autowired 
    private DeletedUserRepository deletedUserRepository;
    
    @Autowired 
    private UserDetailsRepository userDetailsRepository;
    
    @Autowired 
    private UserCredentialsRepository userCredentialsRepository;
    
    @Autowired 
    private ComplaintRepository complaintRepository;
    
    @Autowired 
    private AssignedComplaintRepository assignedComplaintRepository;
    @Autowired
    private PublicViewRepository upvoteRepository;

    
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    
    @Override
    public UserDetails getUserById(Integer userId) {
        return userDetailsRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public void deactivateUser(Integer userId) {
        logger.info("Deactivating userId: {}", userId);
        UserDetails user = getUserById(userId);
        String email = user.getEmail();

        UserCredentials credentials = userCredentialsRepository.findById(email)
                .orElseThrow(() -> new RuntimeException("Credentials not found"));

        if (!deletedUserRepository.existsByUserId(userId)) {
            DeletedUser deleted = new DeletedUser(
                    userId, user.getName(), email, user.getRole(),
                    credentials.getPassword(), LocalDateTime.now()
            );
            deletedUserRepository.save(deleted);
            logger.info("UserId {} archived in deleted_users", userId);
        }

        userDetailsRepository.deleteById(userId);
        userCredentialsRepository.deleteById(email);
        logger.info("UserId {} removed from active tables", userId);
    }
    

    @Override
    public String reactivateUser(Integer userId) {
        logger.info("Reactivating userId: {}", userId);
        DeletedUser deleted = deletedUserRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found in deleted_users"));

        String email = deleted.getEmail();
        String name = deleted.getName();
        Role role = deleted.getRole();

        String tempPassword = "Temp@123";
        String hashedPassword = passwordEncoder.encode(tempPassword);

        UserDetails user = new UserDetails();
        user.setUserId(userId);
        user.setName(name);
        user.setEmail(email);
        user.setRole(role);
        userDetailsRepository.save(user);

        UserCredentials credentials = new UserCredentials();
        credentials.setEmail(email);
        credentials.setPassword(hashedPassword);
        userCredentialsRepository.save(credentials);

        deletedUserRepository.deleteById(userId);
        logger.info("UserId {} reactivated", userId);

        return tempPassword;
    }

    
    @Override
    public ComplaintView getOwnComplaintById(Integer complaintId, String email) {
        UserDetails user = getUserByEmail(email);
        Complaint complaint = complaintRepository.findByComplaintId(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        if (!complaint.getUserId().equals(user.getUserId())) {
            throw new AccessDeniedException("Unauthorized access to complaint");
        }

        return mapToView(complaint);
    }

    @Override
    public List<ComplaintView> getOwnComplaintsByCategory(String category, String email) {
        UserDetails user = getUserByEmail(email);
        List<Complaint> complaints = complaintRepository.findByUserIdAndCategory(user.getUserId(), category);
        return complaints.stream().map(this::mapToView).collect(Collectors.toList());
    }

    private UserDetails getUserByEmail(String email) {
        return userDetailsRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private ComplaintView mapToView(Complaint complaint) {
        return ComplaintView.builder()
                .complaintId(complaint.getComplaintId())
                .title(complaint.getTitle())
                .description(complaint.getDescription())
                .category(complaint.getCategory())
                .status(complaint.getStatus())
                .media(complaint.getMedia())
                .createdAt(complaint.getCreatedAt())
                .build();
    }
    
    @Override
    public List<ComplaintView> getComplaintsByStatus(Status status) {
        String email = getAuthenticatedEmail();
        UserDetails user = getUserByEmail(email);

        logger.debug("Fetching complaints for userId '{}' and status '{}'", user.getUserId(), status);

        List<Complaint> complaints = complaintRepository.findByUserIdAndStatus(user.getUserId(), status);

        return complaints.stream()
                .map(this::mapToView)
                .collect(Collectors.toList());
    }

    private String getAuthenticatedEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        return authentication.getName(); 
    }

    @Override
    public UserInfo getAuthenticatedUserInfo() {
        String email = getAuthenticatedEmail();
        UserDetails user = getUserByEmail(email);

        return new UserInfo(
            user.getUserId(),
            user.getName(),
            user.getEmail(),
            "Active" 
        );
    }
  
    public List<ComplaintUserView> getOwnComplaints(String email) {
        UserDetails user = userDetailsRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        Integer userId = user.getUserId();
        List<Complaint> complaints = complaintRepository.findByUserId(userId);

        List<ComplaintUserView> result = complaints.stream()
                .map((Complaint complaint) -> {
                    Integer complaintId = complaint.getComplaintId();
                    int upvoteCount = upvoteRepository.countByComplaintId(complaintId); 
                    
                    String remark = null;
                    if (complaint.getStatus() == Status.RESOLVED) {
                        remark = assignedComplaintRepository.findByComplaintId(complaintId)
                                    .map(AssignedComplaint::getRemark)
                                    .orElse(null);
                    }


                    return ComplaintUserView.builder()
                            .complaintId(complaintId)
                            .title(complaint.getTitle())
                            .description(complaint.getDescription())
                            .category(complaint.getCategory())
                            .status(complaint.getStatus())
                            .mediaUrl(complaint.getMedia())
                            .createdAt(complaint.getCreatedAt())
                            .updatedAt(complaint.getUpdatedAt())
                            .upvoteCount(upvoteCount)
                            .userHasUpvoted(false) // ✅ Always false since you're not tracking per-user
                            .remark(remark)
                            .build();
                })
                .collect(Collectors.toList());

        return result;
    }
    
    
    @Override
    public DashboardView getUserDashboard(String email) {
        List<ComplaintUserView> complaints = getOwnComplaints(email);
        DashboardView dashboard = new DashboardView();
        dashboard.setTotalComplaints(complaints.size());
        dashboard.setInProgressCount((int) complaints.stream().filter(c -> c.getStatus() == Status.IN_PROGRESS).count());
        dashboard.setResolvedCount((int) complaints.stream().filter(c -> c.getStatus() == Status.RESOLVED).count());
        dashboard.setOpenCount((int) complaints.stream().filter(c -> c.getStatus() == Status.OPEN).count());
        dashboard.setRecentComplaints(complaints.stream()
            .sorted(Comparator.comparing(ComplaintUserView::getCreatedAt).reversed())
            .limit(3)
            .collect(Collectors.toList()));

        return dashboard;
    }
    
    
}

