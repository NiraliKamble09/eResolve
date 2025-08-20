import api from './api';

//Fetch all complaints assigned to the logged-in staff
export const fetchStaffAssignments = () =>
  api.get('/api/staff/assigned_complaints');

//Filter assigned complaints by status
export const filterAssignmentsByStatus = (status) =>
  api.get(`/api/staff/assigned_complaints/filter`, {
    params: { status },
  });

// Get detailed complaint view (includes user info)
export const fetchComplaintDetails = (complaintId) =>
  api.get(`/api/staff/complaint-details/${complaintId}`);

//Update assignment status (syncs complaint status)
export const updateAssignmentStatus = (assignmentId, payload) =>
  api.put(`/api/staff/assignments/${assignmentId}/status`, payload);

//Update assignment remark
export const updateAssignmentRemark = (assignmentId, payload) =>
  api.put(`/api/staff/assignments/${assignmentId}/remark`, payload);

//Get user info assigned to a complaint
export const fetchAssignedUser = (complaintId) =>
  api.get(`/api/staff/complaint/${complaintId}/user`);

//Fetch dashboard stats for logged-in staff
export const fetchStaffDashboard = () =>
  api.get('/api/staff/dashboard');

//Fetch authenticated staff profile info
export const fetchAuthenticatedStaffInfo = () =>
  api.get('/api/staff/me'); 


