


import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";

import { fetchAllComplaints, deleteComplaintById, fetchComplaintById } from "../../../services/complaintService";
import { updateComplaintDetails } from "../../../services/adminService";

const ComplaintsManagementFromAdmin = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: "all", category: "all" });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await fetchAllComplaints();
      const data = response.data;
      setComplaints(data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  // 👁️ View Complaint Details
const handleViewComplaint = async (complaintId) => {
  try {
    const response = await fetchComplaintById(complaintId);
    setSelectedComplaint(response.data);
    setShowModal(true);
  } catch (error) {
    console.error("Error fetching complaint details:", error);
  }
};

// ✏️ Edit Complaint Status
const handleEditComplaint = async (complaint) => {
  const newStatus = prompt("Enter new status (e.g. PENDING, IN_PROGRESS, RESOLVED, REJECTED):", complaint.status);
  if (!newStatus || newStatus === complaint.status) return;

  try {
    const payload = {
      ...complaint,
      status: newStatus,
    };
    await updateComplaintDetails(complaint.complaintId, payload);
    console.log("Complaint updated:", complaint.complaintId);
    fetchComplaints(); // Refresh list
  } catch (error) {
    console.error("Error updating complaint:", error);
  }
};

// 🗑️ Delete Complaint
const handleDeleteComplaint = async (complaintId) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this complaint?");
  if (!confirmDelete) return;

  try {
    await deleteComplaintById(complaintId);
    console.log("Complaint deleted:", complaintId);
    fetchComplaints(); // Refresh list
  } catch (error) {
    console.error("Error deleting complaint:", error);
  }
};




  const getStatusColor = (status) => {
    const colors = {
      IN_PROGRESS:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      RESOLVED:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      OPEN: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return (
      colors[status] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    );
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.user?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filter.status === "all" || complaint.status === filter.status;
    const matchesCategory =
      filter.category === "all" || complaint.category === filter.category;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Complaints Management
        </h1>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              value={filter.status}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, status: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="OPEN">Open</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              value={filter.category}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Categories</option>
              <option value="Account">Account</option>
              <option value="Technical">Technical</option>
              <option value="Network">Network</option>
               <option value="Facilities">Facilities</option>
                <option value="HR">HR</option>
            </select>
          </div>
        </div>
      </div>

{/* Complaints Table */}
<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
  {loading ? (
    <div className="p-8 text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Loading complaints...
      </p>
    </div>
  ) : (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Complaint
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredComplaints.map((complaint) => (
            <tr
              key={complaint.complaintId}
              className="hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {/* Complaint */}
              <td className="px-6 py-4">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {complaint.title}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {complaint.category}
                  </div>
                </div>
              </td>

              {/* Status */}
              <td className="px-6 py-4">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    complaint.status
                  )}`}
                >
                  {complaint.status}
                </span>
              </td>

              {/* User */}
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                {complaint.userName || complaint.user?.name || "—"}
              </td>

              {/* Date */}
              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {complaint.createdAt?.slice(0, 10) || "—"}
              </td>

              {/* Actions */}
              <td className="px-6 py-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleViewComplaint(complaint.complaintId)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEditComplaint(complaint)}
                    className="text-green-600 hover:text-green-800 dark:text-green-400"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteComplaint(complaint.complaintId)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && selectedComplaint && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Complaint Details
      </h2>
      <p className="text-sm text-gray-700 dark:text-gray-300">
        <strong>Title:</strong> {selectedComplaint.title}
      </p>
      <p className="text-sm text-gray-700 dark:text-gray-300">
        <strong>Category:</strong> {selectedComplaint.category}
      </p>
      <p className="text-sm text-gray-700 dark:text-gray-300">
        <strong>Status:</strong> {selectedComplaint.status}
      </p>
      <p className="text-sm text-gray-700 dark:text-gray-300">
        <strong>Description:</strong> {selectedComplaint.description}
      </p>
      <p className="text-sm text-gray-700 dark:text-gray-300">
        <strong>User:</strong> {selectedComplaint.user?.name || selectedComplaint.userName || "—"}
      </p>
      <div className="mt-4 text-right">
        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  )}
</div>

</div>

  );
};

export default ComplaintsManagementFromAdmin;
     