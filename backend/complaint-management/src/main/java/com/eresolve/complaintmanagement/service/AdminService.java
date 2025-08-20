package com.eresolve.complaintmanagement.service;

import com.eresolve.complaintmanagement.dto.ComplaintRequest;
import com.eresolve.complaintmanagement.dto.ComplaintResponse;
import com.eresolve.complaintmanagement.entity.Complaint;
import com.eresolve.complaintmanagement.entity.UserDetails;
import com.eresolve.complaintmanagement.enums.Role;
import com.eresolve.complaintmanagement.enums.Status;



import java.util.List;

import com.eresolve.complaintmanagement.dto.*;

public interface AdminService {
    AssignmentResponse assignComplaintToStaff(AssignComplaintRequest request);

    void updateComplaintDetails(Integer complaintId, ComplaintRequest updatedComplaint);

    List<UserDetails> getAllUsers();
    
    void addUser(String name, String email, String password, Role role);
    
    void updateUser(Integer userId, String name, String email, Role role);
    
    void deleteUserCompletely(Integer userId);


    List<StaffSummaryResponse> getAllStaffMembers();


    List<Complaint> getComplaintsByStatus(Status status);

    AssignmentResponse reassignComplaint(ReassignComplaintRequest request);

    DashboardStatsResponse getDashboardStats();

	void deleteUserById(Integer userId);

	List<ComplaintResponse> getAllComplaintsByUserEmail();

	UserDetails getUserById(Integer userId);
}