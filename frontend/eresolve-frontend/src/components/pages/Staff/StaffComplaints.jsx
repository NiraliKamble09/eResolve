import React, { useState, useContext, createContext, useEffect } from "react";
import StaffComplaintsList from "./StaffComplaintsList";
import StaffComplaintDetailModal from "./StaffComplaintDetailsModal";
import {
  fetchComplaintDetails,
  updateAssignmentStatus,
} from "../../../services/staffService";

// 🌗 Theme Context
const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [isDark, setIsDark] = useState(prefersDark);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => setIsDark(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark }}>
      <div className={isDark ? "dark" : ""}>{children}</div>
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};

const StaffComplaints = ({ loadDashboardDataRef }) => {
  const { isDark } = useTheme();
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [complaints, setComplaints] = useState([]);

  const themeClasses = {
    background: isDark ? "bg-gray-900" : "bg-gray-50",
    cardBg: isDark ? "bg-gray-800" : "bg-white",
    cardBorder: isDark ? "border-gray-700" : "border-gray-200",
    text: isDark ? "text-white" : "text-gray-900",
    textSecondary: isDark ? "text-gray-400" : "text-gray-600",
    textMuted: isDark ? "text-gray-500" : "text-gray-500",
    modalBg: isDark ? "bg-gray-800" : "bg-white",
    modalOverlay: isDark ? "bg-black bg-opacity-60" : "bg-black bg-opacity-40",
    inputBg: isDark ? "bg-gray-700" : "bg-gray-100",
    inputBorder: isDark ? "border-gray-600" : "border-gray-300",
    buttonSecondary: isDark ? "bg-gray-600 hover:bg-gray-700" : "bg-gray-200 hover:bg-gray-300",
    remarkBg: isDark ? "bg-gray-750 border-gray-600" : "bg-blue-50 border-blue-200",
    headerBg: isDark ? "bg-gray-750" : "bg-gray-100",
  };

  const loadComplaintDetails = async (complaintId) => {
    setLoading(true);
    try {
      const response = await fetchComplaintDetails(complaintId);
      setSelectedComplaint(response.data);
    } catch (error) {
      console.error("Error loading complaint details:", error);
    }
    setLoading(false);
  };

  const handleRemarkUpdate = (assignmentId, newRemark) => {
    // Update the complaints list
    setComplaints((prev) =>
      prev.map((c) =>
        c.assignmentId === assignmentId ? { ...c, remark: newRemark } : c
      )
    );

    // Also update the selected complaint if it's the one being edited
    setSelectedComplaint((prev) =>
      prev?.assignmentId === assignmentId ? { ...prev, remark: newRemark } : prev
    );
  };

  const handleStatusUpdate = async (assignmentId, newStatus) => {
    try {
      await updateAssignmentStatus(assignmentId, { status: newStatus });

      if (
        selectedComplaint &&
        (selectedComplaint.assignmentId === assignmentId ||
          selectedComplaint.complaintId === assignmentId)
      ) {
        setSelectedComplaint((prev) => ({ ...prev, status: newStatus }));
      }

      if (loadDashboardDataRef?.current) {
        loadDashboardDataRef.current();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const closeModal = () => setSelectedComplaint(null);

  return (
    <div className={`min-h-screen ${themeClasses.background} transition-colors duration-200`}>
      <div className="p-4 sm:p-6">
        <StaffComplaintsList
          themeClasses={themeClasses}
          onComplaintSelect={loadComplaintDetails}
          onStatusUpdate={handleStatusUpdate}
          loading={loading}
        />

        <StaffComplaintDetailModal
          selectedComplaint={selectedComplaint}
          onClose={closeModal}
          onStatusUpdate={handleStatusUpdate}
          onRemarkUpdate={handleRemarkUpdate}
          setSelectedComplaint={setSelectedComplaint}
          themeClasses={themeClasses}
          loading={loading}
        />
      </div>
    </div>
  );
};

// 🌟 Main App Component
const App = () => (
  <ThemeProvider>
    <StaffComplaints />
  </ThemeProvider>
);

export default App;
