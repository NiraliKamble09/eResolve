import { createComplaint } from '../../../services/complaintService';


import React, { useState, useEffect } from "react";
import {
  AlertCircle, CheckCircle, Clock, XCircle,
  Plus, ThumbsUp, Eye, Upload, X
} from "lucide-react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { userService } from "../../../services/userService";

const UserComplaints = ({ user: userProp }) => {
  // User prop fallback for demo/testing
  const user = userProp || { userId: 1 };
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [upvotes, setUpvotes] = useState({});
  const [loading, setLoading] = useState(false);
  const [authenticatedUserId, setAuthenticatedUserId] = useState(null);
  const [newComplaint, setNewComplaint] = useState({
    userId: '',
    title: '',
    description: '',
    category: '',
    files: [],
  });

  const [complaints, setComplaints] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const categories = ["Technical", "HR", "Facilities", "Security"];
  const statuses = ["IN_PROGRESS", "RESOLVED", "OPEN"];

  // ✅ Fetch complaints from backend using the correct API endpoint
  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      try {
        // Use fetchOwnComplaints which calls /api/users/complaints/my
        const response = await userService.fetchOwnComplaints();
        console.log('Fetched complaints:', response.data);
        setComplaints(response.data);

        // Fetch upvotes for each complaint
        const upvoteMap = {};
        for (const complaint of response.data) {
          try {
            const upvoteRes = await userService.getUpvotes(complaint.complaintId);
            upvoteMap[complaint.complaintId] = upvoteRes.data.upvotes || 0;
          } catch (upvoteError) {
            console.warn(`Failed to fetch upvotes for complaint ${complaint.complaintId}:`, upvoteError);
            upvoteMap[complaint.complaintId] = 0;
          }
        }
        setUpvotes(upvoteMap);
      } catch (error) {
        console.error("Error fetching complaints:", error);
        toast.error('Failed to fetch complaints');
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  // Helper to fetch complaints and upvotes
  const fetchUserComplaints = async () => {
    setLoading(true);
    try {
      const response = await userService.fetchOwnComplaints();
      setComplaints(response.data);

      // Fetch upvotes for each complaint
      const upvoteMap = {};
      for (const complaint of response.data) {
        try {
          const upvoteRes = await userService.getUpvotes(complaint.complaintId);
          upvoteMap[complaint.complaintId] = upvoteRes.data.upvotes || 0;
        } catch (upvoteError) {
          console.warn(`Failed to fetch upvotes for complaint ${complaint.complaintId}:`, upvoteError);
          upvoteMap[complaint.complaintId] = 0;
        }
      }
      setUpvotes(upvoteMap);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      toast.error('Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  const filterComplaints = () => {
    let filtered = complaints;
    if (selectedCategory) {
      filtered = filtered.filter((c) => c.category === selectedCategory);
    }
    if (selectedStatus) {
      filtered = filtered.filter((c) => c.status === selectedStatus);
    }
    return filtered;
  };

  const viewComplaintDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setShowModal(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "IN_PROGRESS":
        return <AlertCircle className="w-4 h-4 text-blue-100" />;
      case "RESOLVED":
        return <CheckCircle className="w-4 h-4 text-blue-300" />;
      case "OPEN":
        return <XCircle className="w-4 h-4 text-slate-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewComplaint((prev) => ({ ...prev, files }));
  };

  const handleCreateComplaint = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Close modal immediately for smoother UX
    setShowCreateModal(false);

    try {
      // Basic validation
      if (!newComplaint.title || !newComplaint.description || !newComplaint.category) {
        toast.error('Please fill in all required fields');
        return;
      }

      const formData = new FormData();
      formData.append('userId', authenticatedUserId);
      formData.append('title', newComplaint.title);
      formData.append('description', newComplaint.description);
      formData.append('category', newComplaint.category);

      if (newComplaint.files?.length > 0) {
        formData.append('file', newComplaint.files[0]);
      }

      console.log('Creating complaint with data:', {
        title: newComplaint.title,
        description: newComplaint.description,
        category: newComplaint.category,
        hasFile: newComplaint.files.length > 0,
      });

      const response = await createComplaint(formData);

      if (response.status === 200 || response.status === 201) {
        toast.success('Complaint created successfully!');
        fetchUserComplaints(); // Refresh list
      } else {
        toast.error('Failed to create complaint. Please try again.');
      }
    } catch (err) {
      console.error('Complaint creation failed:', err);
      toast.error(err?.response?.data?.message || err.message || 'Error creating complaint');
    } finally {
      setLoading(false);
      setNewComplaint({ title: '', description: '', category: '', files: [] });
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await userService.fetchAuthenticatedUserInfo();
        setAuthenticatedUserId(response.data.userId); // or whatever your DTO returns
      } catch (err) {
        console.error('Failed to fetch user info:', err);
      }
    };

    fetchUserInfo();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "IN_PROGRESS":
        return "bg-slate-800 text-blue-100 border-slate-700";
      case "RESOLVED":
        return "bg-blue-800 text-blue-100 border-blue-700";
      case "OPEN":
        return "bg-slate-600 text-slate-100 border-slate-500";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleUpvote = async (complaintId) => {
    try {
      await userService.upvoteComplaint(complaintId);
      setUpvotes((prev) => ({
        ...prev,
        [complaintId]: (prev[complaintId] || 0) + 1,
      }));
      toast.success('Upvote added successfully!');
    } catch (error) {
      console.error("Error upvoting complaint:", error);
      toast.error('Failed to upvote complaint');
    }
  };

  // Loading state
  if (loading && complaints.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex justify-center items-center h-32">
          <div className="text-slate-600">Loading complaints...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">My Complaints</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Complaint</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Filter by Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Filter by Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white"
            >
              <option value="">All Statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {filterComplaints().length === 0 ? (
          <div className="text-center py-8 text-slate-600">
            <p>No complaints found. Create your first complaint to get started!</p>
          </div>
        ) : (
          filterComplaints().map((complaint) => (
            <div
              key={complaint.complaintId}
              className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-slate-800">
                      {complaint.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                        complaint.status
                      )}`}
                    >
                      {complaint.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-slate-600 mb-3">{complaint.description}</p>
                  <div className="flex items-center space-x-6 text-sm text-slate-500">
                    <span>
                      Category:{" "}
                      <span className="font-medium">{complaint.category}</span>
                    </span>
                    {/* {complaint.priority && (
                      <span>
                        Priority:{" "}
                        <span className="font-medium">{complaint.priority}</span>
                      </span>
                    )} */}
                    <span>
                      Submitted:{" "}
                      <span className="font-medium">
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </span>
                    </span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleUpvote(complaints.complaintId)}
                        className="flex items-center space-x-1 text-slate-500 hover:text-blue-600 transition-colors p-1 rounded hover:bg-blue-50"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span className="font-medium">
                          {upvotes[complaint.complaintId] || 0} upvotes
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => viewComplaintDetails(complaint)}
                  className="ml-4 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Complaint Details Modal */}
      {showModal && selectedComplaint && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-800">Complaint Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="font-medium text-slate-700">Title:</label>
                  <p className="text-slate-800 mt-1">{selectedComplaint.title}</p>
                </div>

                <div>
                  <label className="font-medium text-slate-700">Description:</label>
                  <p className="text-slate-800 mt-1">{selectedComplaint.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-medium text-slate-700">Category:</label>
                    <p className="text-slate-800 mt-1">{selectedComplaint.category}</p>
                  </div>
                  <div>
                    <label className="font-medium text-slate-700">Status:</label>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusIcon(selectedComplaint.status)}
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          selectedComplaint.status
                        )}`}
                      >
                        {selectedComplaint.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="font-medium text-slate-700">Submitted On:</label>
                  <p className="text-slate-800 mt-1">
                    {new Date(selectedComplaint.createdAt).toLocaleString()}
                  </p>
                </div>

                {selectedComplaint.mediaUrl && (
                  <div>
                    <label className="font-medium text-slate-700">Attachment:</label>
                    <div className="mt-2">
                      <a
                        href={selectedComplaint.mediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 underline"
                      >
                        View Attachment
                      </a>
                    </div>
                  </div>
                )}

                <div>
                  <label className="font-medium text-slate-700">Community Support:</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <button
                      onClick={() => handleUpvote(selectedComplaint.complaintId)}
                      className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors p-2 rounded hover:bg-blue-50"
                    >
                      <ThumbsUp className="w-5 h-5" />
                      <span className="text-slate-800 font-medium">
                        {upvotes[selectedComplaint.complaintId] || 0} people found this helpful
                      </span>
                    </button>
                  </div>
                </div>

                {/* ✅ Staff Remark Section */}
                {selectedComplaint.status === "RESOLVED" && selectedComplaint.remark && (
                  <div>
                    <label className="font-medium text-slate-700">Staff Remark:</label>
                    <p className="mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-700">
                      {selectedComplaint.remark}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* Create Complaint Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowCreateModal(false)} // Close when clicking outside
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-800">
                  Create New Complaint
                </h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewComplaint({ title: '', description: '', category: '', files: [] });
                  }}
                  className="text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateComplaint} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newComplaint.title}
                    onChange={(e) =>
                      setNewComplaint((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter complaint title"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newComplaint.category}
                    onChange={(e) =>
                      setNewComplaint((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={newComplaint.description}
                    onChange={(e) =>
                      setNewComplaint((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Provide detailed information about your complaint"
                    required
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Attachment (optional)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg hover:border-slate-400 transition-colors">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-slate-400" />
                      <div className="flex text-sm text-slate-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            type="file"
                            className="sr-only"
                            onChange={handleFileChange}
                            accept="image/*,.pdf,.doc,.docx"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-slate-500">
                        PNG, JPG, PDF up to 10MB
                      </p>
                      {newComplaint.files.length > 0 && (
                        <p className="text-sm text-slate-700 mt-2">
                          Selected: {newComplaint.files[0].name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setNewComplaint({ title: '', description: '', category: '', files: [] });
                    }}
                    className="px-4 py-2 text-slate-700 bg-slate-200 rounded-lg hover:bg-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Create Complaint'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserComplaints;