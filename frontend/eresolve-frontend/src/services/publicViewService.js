import api from './api';

// 📊 Fetch upvote count for a complaint
export const fetchUpvoteCount = (complaintId) =>
  api.get(`/api/public/upvotes/${complaintId}`);

// 👍 Upvote a complaint (USER only)
export const submitUpvote = (complaintId) =>
  api.post(`/api/public/upvote/${complaintId}`);

// 🧹 Reset upvotes for a complaint (ADMIN only)
export const resetUpvoteCount = (complaintId) =>
  api.post(`/api/public/reset/${complaintId}`);