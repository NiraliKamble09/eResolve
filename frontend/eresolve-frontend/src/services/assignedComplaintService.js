import api from './api';

// 📂 Fetch all assigned complaints (ADMIN only)
export const getAllAssignments = () =>
  api.get('/api/assigned-complaints/all');

// 🔍 Fetch assignment by ID
export const getAssignmentById = (assignmentId) =>
  api.get(`/api/assigned-complaints/${assignmentId}`);

// 🔄 Update assignment status (basic)
export const updateAssignmentStatus = (assignmentId, status) =>
  api.put(`/api/assigned-complaints/${assignmentId}/status`, null, {
    params: { status },
  });

// 🛠️ Admin-only status update with closure logic
export const adminUpdateAssignmentStatus = (assignmentId, status) =>
  api.put(`/api/assigned-complaints/${assignmentId}/admin-update-status`, null, {
    params: { status },
  });

// 🗑️ Delete assignment
export const deleteAssignmentById = (assignmentId) =>
  api.delete(`/api/assigned-complaints/${assignmentId}`);



