package com.eresolve.complaintmanagement.service;

import com.eresolve.complaintmanagement.dto.AssignedComplaintResponse;
import com.eresolve.complaintmanagement.dto.ComplaintView;
import com.eresolve.complaintmanagement.dto.StaffDashboardResponse;
import com.eresolve.complaintmanagement.dto.UserResponse;
import com.eresolve.complaintmanagement.entity.Complaint;
import com.eresolve.complaintmanagement.enums.Status;

import java.util.List;

public interface StaffService {
    List<AssignedComplaintResponse> getAssignedComplaints(String staffEmail);
    Complaint getComplaintById(Integer complaintId);
    AssignedComplaintResponse updateAssignmentStatus(Integer assignmentId, Status status, String staffEmail);
    UserResponse getUserAssignedToComplaint(Long complaintId, String staffEmail);
    StaffDashboardResponse getDashboardStats(String staffEmail);
	List<AssignedComplaintResponse> getAssignedComplaintsByStatus(String staffEmail, Status status);
	ComplaintView getComplaintViewById(Integer complaintId, String staffEmail);
	AssignedComplaintResponse updateAssignmentRemark(Integer assignmentId, String remark, String staffEmail);
	UserResponse getStaffInfoByEmail(String email);
}