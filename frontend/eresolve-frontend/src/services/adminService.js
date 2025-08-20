import api from './api';

// 📊 Dashboard
export const fetchDashboardStats = () =>
  api.get('/api/admin/dashboard');

// 📌 Complaint Management
export const assignComplaintToStaff = (payload) =>
  api.put('/api/admin/complaints/assign', payload);

export const updateComplaintDetails = (complaintId, payload) =>
  api.put(`/api/admin/complaints/${complaintId}`, payload);

export const reassignComplaint = (payload) =>
  api.put('/api/admin/reassign-complaint', payload);

// 👥 Staff & User Listing
export const fetchAllStaff = () =>
  api.get('/api/admin/staff');

export const fetchAllUsers = () =>
  api.get('/api/admin/all-registered-users');

// ➕ User Management
export const createUser = (payload) =>
  api.post('/api/admin/add-user', payload);

export const fetchUserById = (userId) =>
  api.get(`/api/admin/${userId}`);

export const updateUserDetails = (userId, payload) =>
  api.put(`/api/admin/${userId}`, payload);

// 🚫 User Status Actions
export const deactivateUser = (userId) =>
  api.delete(`/api/admin/deactivate/${userId}`);

export const reactivateUser = (userId) =>
  api.put(`/api/admin/reactivate/${userId}`);

// 🗑️ User Deletion
export const softDeleteUser = (userId) =>
  api.delete(`/api/admin/soft-delete/${userId}`);

export const hardDeleteUser = (userId) =>
  api.delete(`/api/admin/hard-delete/${userId}`);



