
import React, { useState, useEffect } from "react";
import {
  Filter,
  Eye,
  Edit,
  ChevronDown,
  ChevronUp,
  File,
  MessageSquare,
  Save,
} from "lucide-react";
import {
  fetchStaffAssignments,
  filterAssignmentsByStatus,
  updateAssignmentRemark,
  updateAssignmentStatus,
} from "../../../services/staffService";

const InlineRemarkEditor = ({ complaint, onSave, themeClasses }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [remarkValue, setRemarkValue] = useState(complaint.remark || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(complaint, remarkValue);
    setIsEditing(false);
    setIsSaving(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setRemarkValue(complaint.remark || "");
  };

  if (!isEditing) {
    return (
      <div className={`${themeClasses.remarkBg} rounded-lg p-3 mb-3 border`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-500">Staff Remark:</span>
            </div>
            {complaint.remark ? (
              <p className={`${themeClasses.text} text-sm leading-relaxed`}>
                {complaint.remark}
              </p>
            ) : (
              <p className={`${themeClasses.textMuted} text-sm italic`}>
                No remark added yet.
              </p>
            )}
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className={`${themeClasses.buttonSecondary} text-sm px-3 py-1 rounded transition-colors flex items-center gap-1 flex-shrink-0`}
          >
            <Edit className="h-3 w-3" />
            <span className="hidden sm:inline">Edit</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${themeClasses.remarkBg} rounded-lg p-3 mb-3 border`}>
      <div className="flex items-center gap-2 mb-2">
        <MessageSquare className="h-4 w-4 text-green-500" />
        <span className="text-sm font-medium text-green-500">Edit Remark:</span>
      </div>
      <textarea
        value={remarkValue}
        onChange={(e) => setRemarkValue(e.target.value)}
        placeholder="Add your remarks here..."
        className={`w-full ${themeClasses.inputBg} border ${themeClasses.inputBorder} ${themeClasses.text} rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical`}
        rows={3}
      />
      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white px-3 py-1 rounded text-sm transition-colors flex items-center gap-1"
        >
          <Save className="h-3 w-3" />
          {isSaving ? "Saving..." : "Save"}
        </button>
        <button
          onClick={handleCancel}
          disabled={isSaving}
          className={`${themeClasses.buttonSecondary} ${themeClasses.text} px-3 py-1 rounded text-sm transition-colors disabled:opacity-50`}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const StaffComplaintsList = ({
  themeClasses,
  onComplaintSelect,
  onStatusUpdate,
  loading,
}) => {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [expandedCards, setExpandedCards] = useState({});

  const getStatusColor = (status) => {
    switch (status) {
      case "RESOLVED":
        return "bg-green-500";
      case "IN_PROGRESS":
        return "bg-blue-500";
      case "OPEN":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const toggleCardExpansion = (complaintId) => {
    setExpandedCards((prev) => ({
      ...prev,
      [complaintId]: !prev[complaintId],
    }));
  };

  const editRemarkInline = async (complaint, newRemark) => {
    try {
      await updateAssignmentRemark(complaint.assignmentId, { remark: newRemark });
      setComplaints((prev) =>
        prev.map((c) =>
          c.assignmentId === complaint.assignmentId
            ? { ...c, remark: newRemark }
            : c
        )
      );
      alert("Remark updated successfully!");
    } catch (error) {
      console.error("Error updating remark:", error);
      alert("Failed to update remark. Please try again.");
    }
  };

  const loadAssignedComplaints = async () => {
    try {
      const response = await fetchStaffAssignments();
      setComplaints(response.data);
    } catch (error) {
      console.error("Error loading complaints:", error);
      setComplaints([]);
    }
  };

  const filterComplaints = async () => {
    if (statusFilter === "ALL") {
      setFilteredComplaints(complaints);
    } else {
      try {
        const response = await filterAssignmentsByStatus(statusFilter);
        setFilteredComplaints(response.data);
      } catch (error) {
        console.error("Error filtering complaints:", error);
        setFilteredComplaints([]);
      }
    }
  };

  const updateComplaintStatus = async (assignmentId, newStatus) => {
    try {
      await updateAssignmentStatus(assignmentId, { status: newStatus });
      setComplaints((prev) =>
        prev.map((complaint) =>
          complaint.assignmentId === assignmentId
            ? { ...complaint, status: newStatus }
            : complaint
        )
      );
      onStatusUpdate(assignmentId, newStatus);
      alert(`Complaint status updated to ${newStatus.replace("_", " ")}`);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update complaint status. Please try again.");
    }
  };

  useEffect(() => {
    loadAssignedComplaints();
  }, []);

  useEffect(() => {
    filterComplaints();
  }, [statusFilter, complaints]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <h2 className={`text-xl sm:text-2xl font-semibold ${themeClasses.text}`}>
            Assigned Complaints
          </h2>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className={`h-4 w-4 ${themeClasses.textSecondary}`} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`${themeClasses.inputBg} border ${themeClasses.inputBorder} ${themeClasses.text} rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 sm:flex-initial`}
          >
            <option value="ALL">All Status</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* Complaints List */}
<div className="space-y-4">
  {loading ? (
    <div className={`${themeClasses.cardBg} rounded-lg p-8 border ${themeClasses.cardBorder} text-center`}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
      <p className={themeClasses.textSecondary}>Loading complaints...</p>
    </div>
  ) : filteredComplaints.length === 0 ? (
    <div className={`${themeClasses.cardBg} rounded-lg p-8 border ${themeClasses.cardBorder} text-center`}>
      <p className={themeClasses.textSecondary}>No complaints found</p>
    </div>
  ) : (
    filteredComplaints.map((complaint) => {
      const isExpanded = expandedCards[complaint.complaintId];
      const showExpandButton = complaint.description?.length > 100;

      return (
        <div
          key={complaint.assignmentId || complaint.complaintId}
          className={`${themeClasses.cardBg} rounded-lg p-4 sm:p-6 border ${themeClasses.cardBorder} hover:border-gray-500 transition-colors`}
        >
          <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <h3 className={`text-lg font-semibold ${themeClasses.text} break-words`}>
                    {complaint.title}
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        complaint.status
                      )} text-white flex-shrink-0`}
                    >
                      {complaint.status.replace("_", " ")}
                    </span>
                    {complaint.hasAttachment && (
                      <div className="flex items-center text-blue-400 text-xs bg-blue-900 px-2 py-1 rounded">
                        <File className="h-3 w-3 mr-1" />
                        Attachment
                      </div>
                    )}
                    {complaint.remark && (
                      <div className="flex items-center text-green-400 text-xs bg-green-900 px-2 py-1 rounded">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Has Remark
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="mb-3">
                  <p className={`${themeClasses.textSecondary} break-words`}>
                    {showExpandButton && !isExpanded
                      ? `${complaint.description.substring(0, 100)}...`
                      : complaint.description}
                  </p>
                  {showExpandButton && (
                    <button
                      onClick={() => toggleCardExpansion(complaint.complaintId)}
                      className="text-blue-500 hover:text-blue-400 text-sm mt-1 flex items-center gap-1"
                    >
                      {isExpanded ? (
                        <>
                          Show less <ChevronUp className="h-3 w-3" />
                        </>
                      ) : (
                        <>
                          Show more <ChevronDown className="h-3 w-3" />
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Inline Remark Editor */}
                <InlineRemarkEditor
                  complaint={complaint}
                  onSave={editRemarkInline}
                  themeClasses={themeClasses}
                />

                {/* Meta Info */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm">
                  <span className={themeClasses.textMuted}>
                    Category: {complaint.category}
                  </span>
                  <span className={themeClasses.textMuted}>
                    Created: {new Date(complaint.createdAt || complaint.assignedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-gray-600">
              <button
                onClick={() => onComplaintSelect(complaint.complaintId)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Eye className="h-4 w-4" />
                View Details
              </button>

              {complaint.status !== "RESOLVED" && (
                <div className="relative">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        updateComplaintStatus(
                          complaint.assignmentId,
                          e.target.value
                        );
                        e.target.value = "";
                      }
                    }}
                    value=""
                    className={`${themeClasses.inputBg} border ${themeClasses.inputBorder} ${themeClasses.text} rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto`}
                  >
                    <option value="">Update Status</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                    {complaint.status !== "OPEN" && (
                      <option value="OPEN">Open</option>
                    )}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    })
  )}
</div>
</div>
);
};

export default StaffComplaintsList;