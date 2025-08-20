import api from './api';
import { createComplaint } from './complaintService';

// 🔐 Account Actions (USER role)


//Deactivate the authenticated user's account
const deactivateOwnAccount = (userId) =>
  api.delete(`/api/users/deactivate/${userId}`);

//Reactivate the authenticated user's account
const reactivateOwnAccount = (userId) =>
  api.put(`/api/users/reactivate/${userId}`);

// 📄 Complaint Retrieval (USER role)

// Fetch a specific complaint by ID
const fetchOwnComplaintById = (complaintId) =>
  api.get(`/api/users/complaints/id/${complaintId}`);

//Fetch complaints by category
const fetchOwnComplaintsByCategory = (category) =>
  api.get(`/api/users/complaints/category/${category}`);

//Fetch complaints by status
const fetchOwnComplaintsByStatus = (status) =>
  api.get(`/api/users/complaints/status/${status}`);

// Add stubs for missing methods used in UserDashboard.jsx
const getComplaintsByUser = (userId) =>
  api.get(`/api/users/complaints/user/${userId}`);

const getUpvotes = (complaintId) =>
  api.get(`/api/users/complaints/${complaintId}/upvotes`);

const upvoteComplaint = (complaintId) =>
  api.post(`/api/users/complaints/${complaintId}/upvote`);

// 👤 Fetch authenticated user's account info
const fetchAuthenticatedUserInfo = () =>
  api.get('/api/users/me');


// Fetch all complaints created by the authenticated user
const fetchOwnComplaints = () =>
  api.get('/api/users/complaints/my');

const fetchUserDashboard = () => 
  api.get('/api/users/dashboard');


export const userService = {
  deactivateOwnAccount,
  reactivateOwnAccount,
  fetchOwnComplaintById,
  fetchOwnComplaintsByCategory,
  fetchOwnComplaintsByStatus,
  getComplaintsByUser,
  getUpvotes,
  upvoteComplaint,
    fetchAuthenticatedUserInfo,
    createComplaint,
    fetchOwnComplaints,
    fetchUserDashboard,
};