import React, { useState } from "react";
import {
  AlertCircle,
  Edit3,
  FileText,
  Image,
  File,
  MessageSquare,
  Save,
  X,
  BarChart3,
  User,
  Eye,
  Download,
  Clock,
  CheckCircle,
} from "lucide-react";
import { updateAssignmentRemark, updateAssignmentStatus } from "../../../services/staffService";

const StaffComplaintDetailModal = ({
  selectedComplaint,
  onClose,
  onStatusUpdate,
  onRemarkUpdate,
  setSelectedComplaint,
  themeClasses,
  loading,
}) => {
  const [editingRemark, setEditingRemark] = useState(false);
  const [remarkText, setRemarkText] = useState("");
  const [savingRemark, setSavingRemark] = useState(false);

  // Define updateComplaintStatus if not present
  const updateComplaintStatus = async (assignmentId, newStatus) => {
    try {
      await updateAssignmentStatus(assignmentId, { status: newStatus });
      if (onStatusUpdate) onStatusUpdate(assignmentId, newStatus);
      if (onClose) onClose();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update complaint status. Please try again.");
    }
  };

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

  const getFileIcon = (fileType) => {
    if (fileType?.startsWith("image/")) {
      return <Image className="h-5 w-5" />;
    } else if (fileType === "application/pdf") {
      return <FileText className="h-5 w-5" />;
    } else {
      return <File className="h-5 w-5" />;
    }
  };

  const startEditingRemark = () => {
    setEditingRemark(true);
    setRemarkText(selectedComplaint?.remark || "");
  };

  const cancelEditingRemark = () => {
    setEditingRemark(false);
    setRemarkText(selectedComplaint?.remark || "");
  };

  const saveRemark = async () => {
  const assignmentId = selectedComplaint?.assignmentId;

  // ✅ Defensive logging for debugging
  if (!assignmentId || !remarkText.trim()) {
    console.warn("Missing assignmentId or remark:", {
      assignmentId,
      remark: remarkText,
    });

    // ✅ Replace alert with toast/snackbar if available
    alert("Missing assignment ID or remark.");
    return;
  }

  setSavingRemark(true);

  try {
    const response = await updateAssignmentRemark(assignmentId, {
      remark: remarkText.trim(),
    });

    // ✅ Update local selectedComplaint state
    setSelectedComplaint((prev) =>
      prev?.assignmentId === assignmentId
        ? { ...prev, remark: remarkText.trim() }
        : prev
    );

    // ✅ Notify parent to update complaint list
    if (onRemarkUpdate) {
      onRemarkUpdate(assignmentId, remarkText.trim());
    }

    setEditingRemark(false);

    // ✅ Replace alert with toast/snackbar if available
    alert("Remark saved successfully!");
  } catch (error) {
    console.error("Error saving remark:", error);

    // ✅ Replace alert with toast/snackbar if available
    alert("Failed to save remark. Please try again.");
  } finally {
    setSavingRemark(false);
  }
};

  if (!selectedComplaint) return null;

  return (
    <div
      className={`fixed inset-0 ${themeClasses.modalOverlay} flex items-center justify-center p-4 z-50`}
      onClick={onClose}
    >
      <div
        className={`${themeClasses.modalBg} rounded-xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl border ${themeClasses.cardBorder}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          className={`${themeClasses.headerBg} px-4 sm:px-6 py-4 border-b ${themeClasses.cardBorder} flex items-center justify-between`}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm sm:text-base">
                #{selectedComplaint.complaintId}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <h2
                className={`text-lg sm:text-xl font-bold ${themeClasses.text} break-words`}
              >
                {selectedComplaint.title}
              </h2>
              <div
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(
                  selectedComplaint.status
                )} text-white`}
              >
                {selectedComplaint.status.replace("_", " ")}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-400 hover:bg-gray-700 transition-all p-2 rounded-lg"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
          <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
            {/* Description Section */}
            <div
              className={`${themeClasses.cardBg} rounded-lg p-4 sm:p-5 border ${themeClasses.cardBorder}`}
            >
              <h3
                className={`text-lg font-semibold ${themeClasses.text} mb-3 flex items-center gap-2`}
              >
                <AlertCircle className="h-5 w-5 text-blue-500" />
                Description
              </h3>
              <p className={`${themeClasses.textSecondary} leading-relaxed`}>
                {selectedComplaint.description}
              </p>
            </div>

            {/* Staff Remarks Section */}
            <div
              className={`${themeClasses.cardBg} rounded-lg p-4 sm:p-5 border ${themeClasses.cardBorder}`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  className={`text-lg font-semibold ${themeClasses.text} flex items-center gap-2`}
                >
                  <MessageSquare className="h-5 w-5 text-green-500" />
                  Staff Remarks
                </h3>
                {!editingRemark && (
                  <button
                    onClick={startEditingRemark}
                    className={`${themeClasses.buttonSecondary} ${themeClasses.text} px-3 py-1 rounded text-sm transition-colors flex items-center gap-2`}
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </button>
                )}
              </div>

              {editingRemark ? (
                <div className="space-y-3">
                  <textarea
                    value={remarkText}
                    onChange={(e) => setRemarkText(e.target.value)}
                    placeholder="Add your remarks here..."
                    className={`w-full ${themeClasses.inputBg} border ${themeClasses.inputBorder} ${themeClasses.text} rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical`}
                    rows={4}
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={saveRemark}
                      disabled={savingRemark}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded text-sm transition-colors flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {savingRemark ? "Saving..." : "Save Remark"}
                    </button>
                    <button
                      onClick={cancelEditingRemark}
                      disabled={savingRemark}
                      className={`${themeClasses.buttonSecondary} ${themeClasses.text} px-4 py-2 rounded text-sm transition-colors disabled:opacity-50`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="min-h-[60px] flex items-center">
                  {selectedComplaint.remark ? (
                    <p className={`${themeClasses.textSecondary} leading-relaxed`}>
                      {selectedComplaint.remark}
                    </p>
                  ) : (
                    <p className={`${themeClasses.textMuted} italic`}>
                      No remarks added yet. Click "Edit" to add remarks.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Complaint Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Left Column - Complaint Info */}
              <div className={`${themeClasses.cardBg} rounded-lg p-4 sm:p-5 border ${themeClasses.cardBorder}`}>
                <h3 className={`text-lg font-semibold ${themeClasses.text} mb-4 flex items-center gap-2`}>
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  Complaint Information
                </h3>
                <div className="space-y-4">
                  <div className={`flex justify-between items-center py-2 border-b ${themeClasses.cardBorder}`}>
                    <span className={`${themeClasses.textSecondary} font-medium`}>Category</span>
                    <span className={`${themeClasses.text} ${themeClasses.inputBg} px-3 py-1 rounded-full text-sm`}>
                      {selectedComplaint.category || <span className={themeClasses.textMuted}>Not specified</span>}
                    </span>
                  </div>
                  <div className={`flex justify-between items-center py-2 border-b ${themeClasses.cardBorder}`}>
                    <span className={`${themeClasses.textSecondary} font-medium`}>Created</span>
                    <span className={themeClasses.text}>
                      {selectedComplaint.createdAt
                        ? new Date(selectedComplaint.createdAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                        : <span className={themeClasses.textMuted}>Unknown</span>}
                    </span>
                  </div>
                  <div className={`flex justify-between items-center py-2 border-b ${themeClasses.cardBorder}`}>
                    <span className={`${themeClasses.textSecondary} font-medium`}>Last Updated</span>
                    <span className={themeClasses.text}>
                      {selectedComplaint.updatedAt
                        ? new Date(selectedComplaint.updatedAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                        : <span className={themeClasses.textMuted}>Unknown</span>}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column - User Info */}
              <div className={`${themeClasses.cardBg} rounded-lg p-4 sm:p-5 border ${themeClasses.cardBorder}`}>
                <h3 className={`text-lg font-semibold ${themeClasses.text} mb-4 flex items-center gap-2`}>
                  <User className="h-5 w-5 text-blue-500" />
                  User Information
                </h3>
                <div className="space-y-4">
                  <div className={`flex items-center gap-4 p-3 ${themeClasses.inputBg} rounded-lg`}>
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className={`${themeClasses.text} font-semibold`}>
                        {selectedComplaint.userName || <span className={themeClasses.textMuted}>Name not available</span>}
                      </p>
                      <p className={`${themeClasses.textSecondary} text-sm`}>
                        ID: {selectedComplaint.userId ? `#${selectedComplaint.userId}` : <span className={themeClasses.textMuted}>Missing</span>}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className={`flex justify-between items-center py-2 border-b ${themeClasses.cardBorder}`}>
                      <span className={`${themeClasses.textSecondary} font-medium`}>Email</span>
                      <span className="text-blue-400">
                        {selectedComplaint.userEmail || <span className={themeClasses.textMuted}>Not provided</span>}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Attached Files */}
            {Array.isArray(selectedComplaint.attachments) && selectedComplaint.attachments.length > 0 && (
              <div className={`${themeClasses.cardBg} rounded-lg p-4 sm:p-5 border ${themeClasses.cardBorder}`}>
                <h3 className={`text-lg font-semibold ${themeClasses.text} mb-4 flex items-center gap-2`}>
                  <Eye className="h-5 w-5 text-blue-500" />
                  Attached Files ({selectedComplaint.attachments.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedComplaint.attachments.map((file) => (
                    <div
                      key={file.id}
                      className={`${themeClasses.inputBg} rounded-lg p-4 border ${themeClasses.cardBorder} hover:border-gray-500 transition-colors`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="text-blue-400 flex-shrink-0">
                            {getFileIcon(file.fileType)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p
                              className={`${themeClasses.text} font-medium truncate`}
                              title={file.fileName}
                            >
                              {file.fileName}
                            </p>
                            <p className={`${themeClasses.textSecondary} text-sm`}>
                              {file.fileSize || "Unknown size"}
                            </p>
                          </div>
                        </div>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 transition-colors flex-shrink-0 ml-2"
                          title="Download file"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      </div>

                      {/* Image Preview */}
                      {file.fileType?.startsWith("image/") && (
                        <div className="mt-3">
                          <img
                            src={file.url}
                            alt={file.fileName}
                            className={`w-full h-32 object-cover rounded border ${themeClasses.cardBorder}`}
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextElementSibling.style.display = "flex";
                            }}
                          />
                          <div className={`hidden w-full h-32 ${themeClasses.inputBg} rounded border ${themeClasses.cardBorder} items-center justify-center`}>
                            <div className={`text-center ${themeClasses.textSecondary}`}>
                              <Image className="h-8 w-8 mx-auto mb-2" />
                              <p className="text-xs">Preview unavailable</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {selectedComplaint.status !== "RESOLVED" && (
              <div className={`${themeClasses.cardBg} rounded-lg p-4 sm:p-5 border ${themeClasses.cardBorder}`}>
                <h3 className={`text-lg font-semibold ${themeClasses.text} mb-4 flex items-center gap-2`}>
                  <Edit3 className="h-5 w-5 text-blue-500" />
                  Update Status
                </h3>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                  {selectedComplaint.status !== "IN_PROGRESS" && (
                    <button
                      onClick={() =>
                        updateComplaintStatus(selectedComplaint.assignmentId, "IN_PROGRESS")
                      }
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-4 sm:px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                      <Clock className="h-5 w-5" />
                      {loading ? "Updating..." : "Mark In Progress"}
                    </button>
                  )}
                  <button
                    onClick={() =>
                      updateComplaintStatus(selectedComplaint.assignmentId, "RESOLVED")
                    }
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white px-4 sm:px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
                  >
                    <CheckCircle className="h-5 w-5" />
                    {loading ? "Updating..." : "Mark Resolved"}
                  </button>
                  {selectedComplaint.status !== "OPEN" && (
                    <button
                      onClick={() =>
                        updateComplaintStatus(selectedComplaint.assignmentId, "OPEN")
                      }
                      disabled={loading}
                      className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 disabled:cursor-not-allowed text-white px-4 sm:px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                      <AlertCircle className="h-5 w-5" />
                      {loading ? "Updating..." : "Reopen"}
                    </button>
                  )}
                </div>
              </div>
            )}


          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffComplaintDetailModal;












