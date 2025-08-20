import api from './api';

//Fetch user details by email (ADMIN and STAFF)
export const fetchUserByEmail = (email) =>
  api.get(`/api/user-details/by-email/${email}`);

//Fetch users by role (ADMIN only)
export const fetchUsersByRole = (role) =>
  api.get(`/api/user-details/by-role`, {
    params: { role },
  });




  
