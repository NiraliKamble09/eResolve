import api from './api';

// 📝 Create complaint (multipart form)
export const createComplaint = async (formData) => {
  try {
    const response = await api.post('/api/complaints/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response;
  } catch (error) {
    // Optional: log or rethrow for better debugging
    console.error('API error while creating complaint:', error);
    throw error;
  }
};

// 🗑️ Delete complaint by ID
export const deleteComplaintById = (complaintId) =>
  api.delete(`/api/complaints/${complaintId}`);

// 📂 Fetch all complaints (ADMIN only)
export const fetchAllComplaints = () =>
  api.get('/api/complaints/all');

// 🔍 Fetch complaint by ID
export const fetchComplaintById = (complaintId) =>
  api.get(`/api/complaints/id/${complaintId}`);

// 👤 Fetch complaints by user ID
export const fetchComplaintsByUser = (userId) =>
  api.get(`/api/complaints/user/${userId}`);

// 📊 Filter complaints by status
export const fetchComplaintsByStatus = (status) =>
  api.get(`/api/complaints/status/${status}`);

// 🗂️ Filter complaints by category
export const fetchComplaintsByCategory = (category) =>
  api.get(`/api/complaints/category/${category}`);




