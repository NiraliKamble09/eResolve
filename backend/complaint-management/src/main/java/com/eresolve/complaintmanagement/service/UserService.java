package com.eresolve.complaintmanagement.service;

import com.eresolve.complaintmanagement.dto.ComplaintUserView;
import com.eresolve.complaintmanagement.dto.ComplaintView;
import com.eresolve.complaintmanagement.dto.DashboardView;
import com.eresolve.complaintmanagement.dto.UserInfo;
import com.eresolve.complaintmanagement.entity.UserDetails;

import com.eresolve.complaintmanagement.enums.Status;

import java.util.List;


public interface UserService {

    UserDetails getUserById(Integer userId);
    
    void deactivateUser(Integer userId);
    


	String reactivateUser(Integer userId);
	ComplaintView getOwnComplaintById(Integer complaintId, String email);
	List<ComplaintView> getOwnComplaintsByCategory(String category, String email);

	List<ComplaintView> getComplaintsByStatus(Status status);

	UserInfo getAuthenticatedUserInfo();

	List<ComplaintUserView> getOwnComplaints(String email);

	DashboardView getUserDashboard(String email);
}


