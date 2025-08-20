import React, { useState, useEffect } from "react";
import { Users, Edit, Trash2, UserCheck } from "lucide-react";
import {
  fetchAllStaff,
  assignComplaintToStaff,
} from "../../../services/adminService";
import {
  getAllAssignments,
  deleteAssignmentById,
} from "../../../services/assignedComplaintService";
import { toast } from "react-toastify";

const StaffManagementFromAdmin = () => {
  const [staff, setStaff] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState({
    complaintId: "",
    staffId: "",
  });

  useEffect(() => {
    fetchStaff();
    fetchAssignments();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await fetchAllStaff();
      console.log("Fetched staff:", response.data); // ✅ Debug log
      setStaff(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching staff:", error);
      setStaff([]);
    }
  };


  const getStaffName = (userId) => {
    const staffMember = staff.find((s) => s.userId === userId);
    return staffMember ? staffMember.name : `User ${userId}`;
  };

  const fetchAssignments = async () => {
    try {
      const response = await getAllAssignments();
      console.log("Fetched assignments:", response.data); // ✅ Debug log
      setAssignments(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      setAssignments([]);
    }
  };


  const handleDeleteAssignment = async (assignmentId) => {
    const confirmDelete = window.confirm("Delete this assignment?");
    if (!confirmDelete) return;

    try {
      await deleteAssignmentById(assignmentId);
      fetchAssignments(); // refresh
    } catch (error) {
      console.error("Error deleting assignment:", error);
    }
  };

  const handleAssignComplaint = async (e) => {
    // e.preventDefault();

    console.log("Assigning complaint:", assignmentForm);

    if (
      !assignmentForm.complaintId ||
      !assignmentForm.staffId ||
      isNaN(assignmentForm.complaintId) ||
      isNaN(assignmentForm.staffId)
    ) {
      alert("Please enter a valid Complaint ID and select a Staff Member.");
      return;
    }

    try {
      const payload = {
        complaintId: assignmentForm.complaintId,
        userId: assignmentForm.staffId,
      };

      const response = await assignComplaintToStaff(payload);
      console.log("Assignment successful:", response.data);
      toast.success("Complaint assigned successfully");

      setShowAssignModal(false);
    } catch (error) {
      console.error("Assignment failed:", error);
      toast.error("Failed to assign complaint");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      RESOLVE: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      IN_PROGRESS:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      OPEN: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    };
    return (
      colors[status] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Staff Management
        </h1>
        <button
          onClick={() => setShowAssignModal(true)}
          className="mt-3 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
        >
          <UserCheck className="h-4 w-4 mr-2" />
          Assign Complaint
        </button>
      </div>

      {/* Staff Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((member) => (
          <div
            key={member.staffId}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {member.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {member.email}
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {member.activeAssignments}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Completed
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {member.totalCompleted}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Current Assignments */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Current Assignments
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Complaint
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date Assigned
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {assignments.map((assignment) => (
                <tr
                  key={assignment.assignmentId}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {assignment.complaintTitle ||
                          `Complaint #${assignment.complaintId}`}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        ID: #{assignment.complaintId}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {assignment.staff?.name || assignment.staffName || getStaffName(assignment.userId)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        assignment.status
                      )}`}
                    >
                      {assignment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {assignment.assignedDate?.slice(0, 10)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteAssignment(assignment.assignmentId)
                        }
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
        </div>
      </div>
      {/* Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Assign Complaint
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAssignComplaint(); // ❌ called before validation
                  console.log("Assigning complaint:", assignmentForm);

                  if (
                    !assignmentForm.complaintId ||
                    !assignmentForm.staffId ||
                    isNaN(assignmentForm.complaintId) ||
                    isNaN(assignmentForm.staffId)
                  ) {
                    alert(
                      "Please enter a valid Complaint ID and select a Staff Member."
                    );
                    return;
                  }

                  handleAssignComplaint(); // ✅ called again after validation
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Complaint ID
                  </label>
                  <input
                    type="number"
                    value={assignmentForm.complaintId}
                    onChange={(e) =>
                      setAssignmentForm((prev) => ({
                        ...prev,
                        complaintId: Number(e.target.value), // ✅ convert to number
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Assign to Staff
                  </label>
                  <select
                    value={assignmentForm.staffId}
                    onChange={(e) =>
                      setAssignmentForm((prev) => ({
                        ...prev,
                        staffId:
                          e.target.value === ""
                            ? ""
                            : Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Select Staff Member</option>
                    {staff.map((member) => (
                      <option key={member.userId} value={member.userId}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAssignModal(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Assign
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagementFromAdmin;