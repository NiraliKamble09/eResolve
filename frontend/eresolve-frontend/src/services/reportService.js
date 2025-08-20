import api from './api';

//Fetch all reports (ADMIN only)
export const fetchAllReports = () =>
  api.get('/api/reports');

//Create a new report (ADMIN only)
export const submitReport = (data) =>
  api.post('/api/reports/create', data);

//Export all reports as PDF (ADMIN only)
export const exportReportsPdf = () =>
  api.get('/api/reports/pdf', { responseType: 'blob' });

//Download complaint report PDF (ADMIN only)
export const downloadComplaintReport = () =>
  api.get('/api/reports/download-report', { responseType: 'blob' });

//Fetch reports by user (ADMIN or same user)
export const fetchReportsByUser = (userId, token) =>
  api.get(`/api/reports/user/${userId}`, {
    headers: { Authorization: token },
  });

//Filter reports by status (ADMIN only)
export const filterReportsByStatus = (status) =>
  api.get(`/api/reports/filter/status/${status}`);

//Filter reports by date range (ADMIN only)
export const filterReportsByDateRange = (start, end) =>
  api.get(`/api/reports/filter/dates?start=${start}&end=${end}`);





